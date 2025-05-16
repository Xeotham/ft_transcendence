import { WebSocket } from "ws";
import { TetrisGame } from "./Game/TetrisGame";
import { multiplayerRoomLst } from "../api/controllers";
import { codeNameExists, isUpperCase } from "../utils";
import { MultiplayerRoomPlayer } from "./MultiplayerRoomPlayer";

export class MultiplayerRoom {
	private players:			MultiplayerRoomPlayer[];
	private isInGame:			boolean;
	private private:			boolean;
	private code:				string;
	private playersRemaining:	number;
	private settings:			any; // Object containing the settings of the game : {}

	constructor(socket: WebSocket, username: string, isPrivate: boolean = false, codeName: string | undefined = undefined) {
		this.players = [];
		this.isInGame = false;
		this.private = isPrivate;
		if (codeName && codeName.length === 4 && isUpperCase(codeName) && !codeNameExists(codeName))
			this.code = codeName;
		else
			this.code = this.generateInviteCode();
		console.log("The code of the new room is " + this.code);
		this.playersRemaining = 0;
		this.addPlayer(socket, username);
		this.settings = {isLevelling: false, level: 4, canRetry: true};
	}

	public isPrivate(): boolean						{ return this.private; }
	public getCode(): string						{ return this.code; }

	public changeCode(): void						{ this.code = this.generateInviteCode(); }
	public setPrivate(isPrivate: boolean): void		{ this.private = isPrivate; }
	public setSettings(settings: any): void			{ this.settings = settings; }

	// git commit -m "Added a bunch of settings in rooms, Made settings be persistent through multiple room games, able to restart a room when  being alone in it. Fixed ownership passage when an owner leaves the room. Sending the games of the opponents to the player in rooms so he can print them"

	public addPlayer(socket: WebSocket, username: string): void		{
		if (this.players.length <= 0) {
			socket.send(JSON.stringify({type: "MULTIPLAYER_JOIN", argument: "OWNER"}));
			this.players.push(new MultiplayerRoomPlayer(socket, username, true));
			// console.log("Making " + username + " the owner");
		}
		else {
			this.players.push(new MultiplayerRoomPlayer(socket, username));
			this.settings.canRetry = false;
		}
		socket.send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: this.code }));
	}

	public removePlayer(username: string): void	{
		const player: MultiplayerRoomPlayer | undefined = this.players.find((player) => player.getUsername() === username);
		if (!player)
			return ;
		player.getGame()?.forfeit();
		player.getSocket()?.send(JSON.stringify({ type: "MULTIPLAYER_LEAVE"}));
		this.players.splice(this.players.indexOf(player), 1);

		// console.log("Is" + player.getUsername() + " owner: " + player.isOwner());
		const nonOwner: MultiplayerRoomPlayer | undefined = this.players.find((aPlayer => !aPlayer.isOwner()));
		// console.log("Non owner?: " + nonOwner?.getUsername());
		if (player.isOwner() && nonOwner !== undefined) {
			nonOwner.setOwner(true);
			nonOwner.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: "OWNER" }))
		}
		if (this.players.length === 1)
			this.settings.canRetry = true;
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
			// console.log("Sending code to player " + player.getUsername());
			player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: result }));
		}
		return result;
	}

	public startGames(): void {
		if (this.isInGame)
			return ;
		this.playersRemaining = this.players.length;
		this.isInGame = true;

		for (const player of this.players)
			player.setupGame(this.settings);
		this.assignOpponents();
		for (const player of this.players)
			player.getGame()?.gameLoop().then(() => endOfGame(player));

		const sendOpponentsGames = () => {
			for (let i = 0; i < this.players.length; ++i) {
				let lost: number = 0;
				let games: any[] = [];
				for (let j = (i + 1) % this.players.length; j - lost < 6; ++j) {
					j %= this.players.length;
					if (j === i)
						break ;
					if (this.players[j].getGame()?.isOver()) {
						++lost;
						continue;
					}
					// console.log("Sending game of " + j + " to " + i);
					// console.log("Sending game of " + this.players[j].getUsername() + " to " + this.players[i].getUsername());
					games.push(this.players[j].getGame()?.toJSON());
				}
				// games.push(this.players[i].getGame()); // TODO : See if necessary
				this.players[i].getSocket().send(JSON.stringify({ type: "MULTIPLAYER_OPPONENTS_GAMES", argument: games }));
			}
		}
		const interval = setInterval(sendOpponentsGames, 1000 / 30);

		const endOfGame = (player: MultiplayerRoomPlayer) => {
			// console.log("End of game for player " + player.getUsername() + " is at place " + this.playersRemaining);
			player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_FINISH", argument: this.playersRemaining }));
			--this.playersRemaining;
			if (player.getGame()?.getHasForfeit())
				this.removePlayer(player.getUsername());
			if (this.playersRemaining === 1)
				this.players.find((player) => !player.getGame()?.isOver())?.getGame()?.setOver(true);
			if (this.playersRemaining >= 1)
				return ;
			this.players.forEach((player) => {
				if (!player.getGame()?.getHasForfeit())
					player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: this.code }));
				if (player.isOwner()) // TODO : Send this to everyone?
					player.getSocket().send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: "SETTINGS", value: this.settings }));
				player.setGame(undefined);
			});
			this.isInGame = false;
			clearInterval(interval);
		};
	}

	private assignOpponents(): void {
		if (this.players.length <= 1)
			return ;

		let opponent: MultiplayerRoomPlayer;
		for (const player of this.players) {
			do {
				opponent = this.players[Math.floor(Math.random() * this.players.length)];
			} while (opponent === player || opponent === undefined);
			player.getGame()?.setOpponent(opponent.getGame()!);
		}
	}
 }
