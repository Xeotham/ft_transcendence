import { WebSocket } from "ws";
import { TetrisGame } from "./Game/TetrisGame";
import { codeNameExists, isUpperCase } from "../utils";
import { MultiplayerRoomPlayer } from "./MultiplayerRoomPlayer";

export class MultiplayerRoom {
	private players:			MultiplayerRoomPlayer[];
	private isInGame:			boolean;
	private code:				string;
	private playersRemaining:	number;
	private settings:			any; // Object containing the settings of the game : {}

	constructor(socket: WebSocket, username: string, isPrivate: boolean = false, codeName: string | undefined = undefined) {
		this.players = [];
		this.isInGame = false;
		if (codeName && codeName.length === 4 && isUpperCase(codeName) && !codeNameExists(codeName))
			this.code = codeName;
		else
			this.code = this.generateInviteCode();
		console.log("The code of the new room is " + this.code);
		this.playersRemaining = 0;
		this. settings = {
			"isPrivate": true,
			"isVersus": false,
			"showShadowPiece": true,
			"showBags": true,
			"holdAllowed": true,
			"showHold": true,
			"infiniteHold": false,
			"infiniteMovement": false,
			"lockTime": 500,
			"spawnARE": 0,
			"softDropAmp": 1.5,
			"level": 4,
			"isLevelling": false,
			"canRetry": true,
		}
		this.addPlayer(socket, username);
	}

	public getIsInGame(): boolean					{ return this.isInGame; }
	public getPlayers(): MultiplayerRoomPlayer[]	{ return this.players; }
	public isPrivate(): boolean						{ return this.settings.isPrivate == undefined ? false : this.settings.isPrivate; }
	public getIsVersus(): boolean					{ return this.settings.isVersus == undefined ? false : this.settings.isVersus; }
	public getCode(): string						{ return this.code; }

	public changeCode(): void						{ this.code = this.generateInviteCode(); }
	public setSettings(settings: any): void			{ this.settings = settings; this.sendSettingsToPlayers(); }
	public addSetting(key: string, value: any): void{ this.settings[key] = value; this.sendSettingsToPlayers(); }
	public addSettings(settings: any): void			{
		for (const key in settings)
			this.settings[key] = settings[key];
		this.sendSettingsToPlayers();
	}


	public addPlayer(socket: WebSocket, username: string): void		{
		if (this.players.find((player) => player.getUsername() === username)) {
			socket.send(JSON.stringify({ type: "MULTIPLAYER_LEAVE" }));
			return console.log("Player " + username + " already exists in room " + this.code);
		}
		if (this.players.length <= 0) {
			socket.send(JSON.stringify({type: "MULTIPLAYER_JOIN", argument: "OWNER"}));
			this.players.push(new MultiplayerRoomPlayer(socket, username, true));
		}
		else {
			this.players.push(new MultiplayerRoomPlayer(socket, username));
			this.settings.canRetry = false;
		}
		socket.send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: this.code }));
		this.sendSettingsToPlayers();
	}

	public removePlayer(username: string): void	{
		const player: MultiplayerRoomPlayer | undefined = this.players.find((player) => player.getUsername() === username);
		if (!player)
			return ;
		player.getGame()?.forfeit();
		player.getSocket()?.send(JSON.stringify({ type: "MULTIPLAYER_LEAVE"}));
		this.players.splice(this.players.indexOf(player), 1);

		const nonOwner: MultiplayerRoomPlayer | undefined = this.players.find((aPlayer => !aPlayer.isOwner()));
		if (player.isOwner() && nonOwner !== undefined) {
			nonOwner.setOwner(true);
			nonOwner.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: "OWNER" }))
		}
		if (this.players.length === 1)
			this.settings.canRetry = true;
		this.sendSettingsToPlayers();
	}

	public isEmpty(): boolean {
		return this.players.length <= 0;
	}

	public getGameById(id: number): TetrisGame | undefined {
		return this.players.find((player) => player.getGame()?.getGameId() === id)?.getGame();
	}

	generateInviteCode(): string {
		const   characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const   length = 4;
		let     result: string = "";

		for (let i = 0; i < length; i++)
			result += characters.charAt(Math.floor(Math.random() * characters.length));

		if (codeNameExists(result))
			return this.generateInviteCode();
		for (const player of this.players) {
			player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: result }));
		}
		return result;
	}

	public startGames(): void {
		if (this.isInGame)
			return ;
		this.playersRemaining = this.players.length;
		this.isInGame = true;

		this.settings.isInRoom = true;
		for (const player of this.players)
			player.setupGame(this.settings);
		this.assignOpponents();
		for (const player of this.players)
			player.getGame()?.gameLoop().then(() => endOfGame(player));

		const sendOpponentsGames = () => {
			for (let i = 0; i < this.players.length; ++i) {
				let lost: number = 0;
				let games: any[] = [];
				for (let j = i + 1; j - lost < 6; ++j) {
					j %= this.players.length;
					if (j === i)
						break ;
					if (this.players[j].getGame()?.isOver() || this.players[j].getGame() === undefined) {
						++lost;
						continue;
					}
					games.push(this.players[j].getGame()?.toJSON());
				}
				this.players[i].getSocket().send(JSON.stringify({ type: "MULTIPLAYER_OPPONENTS_GAMES", argument: games }));
			}
		}
		const interval = setInterval(sendOpponentsGames, 1000 / 10);

		const endOfGame = (player: MultiplayerRoomPlayer) => {
			console.log("End of game for player " + player.getUsername() + " is at place " + this.playersRemaining);
			player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_FINISH", argument: this.playersRemaining }));
			--this.playersRemaining;
			if (player.getGame()?.getHasForfeit())
				this.removePlayer(player.getUsername());
			if (this.playersRemaining === 1)
				this.players.find((player) => !player.getGame()?.isOver())?.getGame()?.setOver(true);
			this.assignOpponents();
			if (this.playersRemaining >= 1)
				return ;
			this.players.forEach((player) => {
				player.getSocket().send(JSON.stringify({type: "GAME_FINISH"}));
				if (!player.getGame()?.getHasForfeit())
					player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: this.code }));
				player.setGame(undefined);
			});
			this.sendSettingsToPlayers();
			this.isInGame = false;
			clearInterval(interval);
		};
	}

	private assignOpponents(): void {
		if (this.playersRemaining <= 1 || this.players.length <= 1)
			return ;

		let opponent: MultiplayerRoomPlayer;
		for (const player of this.players) {
			do {
				opponent = this.players[Math.floor(Math.random() * this.players.length)];
			} while (opponent === undefined || opponent === player ||
			opponent.getGame() === undefined || opponent.getGame()?.isOver() || opponent.getGame()?.getHasForfeit());
			player.getGame()?.setOpponent(opponent.getGame()!);
		}
	}

	private sendSettingsToPlayers(): void {
		this.settings.nbPlayers = this.players.length;
		for (const player of this.players) {
			player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: "SETTINGS", value: this.settings }));
		}
	}
}
