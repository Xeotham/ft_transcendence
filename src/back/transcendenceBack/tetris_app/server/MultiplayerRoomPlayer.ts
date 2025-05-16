import { TetrisGame } from "./Game/TetrisGame";
import { WebSocket } from "ws";

export class MultiplayerRoomPlayer {
	private readonly socket:	WebSocket;
	private readonly username:	string;
	private owner:				boolean;
	private left:				boolean;
	private game:				TetrisGame | undefined;

	constructor(socket: WebSocket, username: string, owner: boolean = false) {
		this.socket = socket;
		this.username = username;
		this.owner = owner;
		this.left = false;
		this.game = undefined;
	}

	public getSocket():WebSocket						{ return this.socket; }
	public getUsername(): string						{ return this.username; }
	public isOwner(): boolean							{ return this.owner; }
	public hasLeft(): boolean							{ return this.left; }
	public getGame(): TetrisGame | undefined			{ return this.game; }

	public setOwner(owner: boolean): void				{ this.owner = owner; }
	public setLeft(left: boolean): void					{ this.left = left; }
	public setGame(game: TetrisGame | undefined): void	{ this.game = game; }


	public setupGame(settings: any): void {
		const game = new TetrisGame(this.socket, this.username);
		game.setSettings(settings);
		this.game = game;
	}
}
