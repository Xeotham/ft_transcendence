import WebSocket from "ws";
import { TetrisGame } from "./Game/TetrisGame";
import { multiplayerRoomLst } from "../api/controllers";
import {codeNameExists} from "../utils";


export class MultiplayerRoom {
	private sockets:			(WebSocket | undefined)[];
	private owner:				WebSocket;
	private games:				TetrisGame[];
	private isInGame:			boolean;
	private private:			boolean;
	private code:				string;
	private playersRemaining:	number;
	private settings:			any;

	constructor(socket: WebSocket, isPrivate: boolean = false, codeName: string | undefined = undefined) {
		this.sockets = [];
		this.owner = socket;
		this.games = [];
		this.isInGame = false;
		this.private = isPrivate;
		// console.log("Creating a new room with code: " + codeName);
		if (codeName && !codeNameExists(codeName))
			this.code = codeName;
		else
			this.code = this.generateInviteCode();
		console.log("The code of the new room is " + this.code);
		this.playersRemaining = 0;
		this.addPlayer(socket);
	}

	public isPrivate(): boolean						{ return this.private; }
	public getCode(): string						{ return this.code; }

	public changeCode(): void						{ this.code = this.generateInviteCode(); }
	public setPrivate(isPrivate: boolean): void		{ this.private = isPrivate; }
	public setSettings(settings: any): void			{ this.settings = settings; }


	public addPlayer(socket: WebSocket): void		{
		if (this.sockets.length <= 0)
			socket.send(JSON.stringify({type: "MULTIPLAYER_JOIN", argument: "OWNER"}));
		this.sockets.push(socket);
		socket.send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: this.code }));
	}
	public removePlayer(socket: WebSocket): void	{
		this.games[this.sockets.indexOf(socket)]?.forfeit();
		if (this.isInGame)
			return this.sockets[this.sockets.indexOf(socket)] = undefined;
		else
			this.sockets.splice(this.sockets.indexOf(socket), 1);
		const nonOwner: WebSocket | undefined = this.sockets.find((socket => socket !== undefined));
		if (socket === this.owner && nonOwner !== undefined) {
			this.owner = nonOwner;
			this.owner.send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: "OWNER" }));
		}
		if (nonOwner === undefined) // Nobody remaining in the room
			this.removeLeavers();
	}

	public isEmpty(): boolean {
		return this.sockets.length <= 0;
	}

	public getGameById(id: number): TetrisGame | undefined {
		return this.games.find((game) => game.getGameId() === id);
	}

	private removeLeavers(){
		for (let i = 0; i < this.sockets.length; ++i) {
			if (this.sockets[i] === undefined) {
				this.sockets.splice(i, 1);
				--i;
			}
		}
	}

	generateInviteCode(): string {
		const   characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const   length = 4;
		let     result: string = '';

		for (let i = 0; i < length; i++)
			result += characters.charAt(Math.floor(Math.random() * characters.length));

		if (codeNameExists(result))
			return this.generateInviteCode();
		// console.log(this.sockets + " length: " + this.sockets.length);
		for (let i = 0; i < this.sockets.length; ++i) {
			// console.log("Sending code to socket " + i);
			this.sockets[i]?.send(JSON.stringify({type: "MULTIPLAYER_JOIN", argument: result}));
		}
		return result;
	}

	public startGames(): void {
		this.removeLeavers();
		this.playersRemaining = this.sockets.length;

		const endOfGame = (pos: number) => {
			// console.log("Player at pos " + pos + " has finished the game. The player is at place " + this.playersRemaining);
			this.sockets[pos]?.send(JSON.stringify({ type: "MULTIPLAYER_FINISH", argument: this.playersRemaining }));
			--this.playersRemaining;
			// console.log("Players remaining: " + this.playersRemaining);
			if (this.playersRemaining === 1)
				this.games.find((game) => !game.isOver())?.setOver(true);
			if (this.playersRemaining >= 1)
				return ;
			for (let i = 0; i < this.sockets.length; ++i)
				this.sockets[i]?.send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: this.code }));
			this.games = [];
			this.isInGame = false;
			this.removeLeavers();
		};

		for (let i = 0; i < this.sockets.length; ++i) {
			const game = new TetrisGame(this.sockets[i]!);
			game.setSettings(this.settings);
			this.games.push(game);
			this.sockets[i]!.send(JSON.stringify({ type: "SOLO", game: this.games[i].toJSON() }));
			this.games[i].gameLoop().then(() => endOfGame(i));
		}
	}
}
