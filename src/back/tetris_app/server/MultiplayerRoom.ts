import WebSocket from "ws";
import { TetrisGame } from "./Game/TetrisGame";
import { multiplayerRoomLst } from "../api/controllers";


export class MultiplayerRoom {
	private sockets:			WebSocket[];
	private owner:				string;
	private games:				TetrisGame[];
	private private:			boolean;
	private code:				string;
	private playersRemaining:	number;
	private settings:			any;

	constructor(sockets: WebSocket[], username: string, isPrivate: boolean = false) {
		this.sockets = sockets;
		this.owner = username;
		this.games = [];
		this.private = isPrivate;
		this.code = this.generateInviteCode();
		this.playersRemaining = 0;
	}

	public addPlayer(socket: WebSocket): void		{
		this.sockets.push(socket);
		socket.send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: this.code }));
	}
	public isPrivate(): boolean						{ return this.private; }
	public getCode(): string						{ return this.code; }

	public removePlayer(socket: WebSocket): void	{ this.sockets.splice(this.sockets.indexOf(socket), 1); };
	public changeCode(): void						{ this.code = this.generateInviteCode(); }
	public setPrivate(isPrivate: boolean): void		{ this.private = isPrivate; }
	public setSettings(settings: any): void { this.settings = settings; }

	public isEmpty(): boolean {
		return this.sockets.length <= 0;
	}

	public getGameById(id: number): TetrisGame | undefined {
		return this.games.find((game) => game.getGameId() === id);
	}

	generateInviteCode(): string {
		const   characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const   length = 4;
		let     result: string = '';

		for (let i = 0; i < length; i++)
			result += characters.charAt(Math.floor(Math.random() * characters.length));

		if (multiplayerRoomLst.find((room) => { return room.generateInviteCode() === result; }))
			return this.generateInviteCode();
		console.log(this.sockets + " length: " + this.sockets.length);
		for (let i = 0; i < this.sockets.length; ++i) {
			console.log("Sending code to socket " + i);
			this.sockets[i].send(JSON.stringify({type: "MULTIPLAYER_JOIN", argument: result}));
		}
		console.log("Generated code: " + result);
		return result;
	}

	public startGames(): void {
		this.playersRemaining = this.sockets.length;

		const endOfGame = (pos: number) => {
			console.log("Player at pos " + pos + " has finished the game. The player is at place " + this.playersRemaining);
			this.sockets[pos].send(JSON.stringify({ type: "MULTIPLAYER_FINISH", argument: this.playersRemaining }));
			--this.playersRemaining;
			if (this.playersRemaining === 1)
				this.games.find((game) => { !game.isOver() })?.setOver(true);
			if (this.playersRemaining <= 0)
				for (let i = 0; i < this.sockets.length; ++i)
					this.sockets[i].send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: this.code }));
		};

		for (let i = 0; i < this.sockets.length; ++i) {
			const game = new TetrisGame(this.sockets[i]);
			game.setSettings(this.settings);
			this.games.push(game);
			this.sockets[i].send(JSON.stringify({ type: "SOLO", game: this.games[i].toJSON() }));
			this.games[i].gameLoop().then(() => endOfGame(i));
		}
	}
}
