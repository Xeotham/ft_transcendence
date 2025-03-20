import { WebSocket } from "ws";
import { Game } from "./pong_game";

export class Room {
	private readonly id:	number;
	private P1:				WebSocket | null;
	private P2:				WebSocket | null;
	private full:			boolean;
	private game:			Game | null;
	private isP1Ready:		boolean;
	private isP2Ready:		boolean;
	private isSolo:			boolean;
	private spectators:		WebSocket[];
	private	started:		boolean;
	// private:	boolean; // TODO: Implement private rooms
	// inviteCode:	string;

	constructor(id:	number, isSolo: boolean = false) {
		this.id = id;
		this.P1 = null;
		this.P2 = null;
		this.full = false;
		this.game = null;
		this.isP1Ready = false;
		this.isP2Ready = false;
		this.isSolo = isSolo;
		this.spectators = [];
		this.started = false;
	}

	getId() {
		return this.id;
	}

	getP1() {
		return this.P1;
	}

	getP2() {
		return this.P2;
	}

	setP1(socket: WebSocket) {
		this.P1 = socket;
	}

	setP2(socket: WebSocket) {
		this.P2 = socket;
	}

	isFull() {
		return this.full;
	}

	setFull(bool: boolean) {
		this.full = bool;
	}

	getIsSolo() {
		return this.isSolo;
	}

	getGame() {
		return this.game;
	}

	hasStarted() {
		return this.started;
	}

	getP1Ready() {
		return this.isP1Ready;
	}

	getP2Ready() {
		return this.isP2Ready;
	}

	setP1Ready(bool: boolean) {
		this.isP1Ready = bool;
	}

	setP2Ready(bool: boolean) {
		this.isP2Ready = bool;
	}

	sendData(data, toSpectators: boolean = false) {
		this.P1?.send(JSON.stringify(data));
		if (!this.isSolo)
			this.P2?.send(JSON.stringify(data));
		if (toSpectators)
			for (let spectator of this.spectators)
				spectator.send(JSON.stringify(data));
	}

	addPlayer(socket: WebSocket) {
		if (this.full)
			return ;
		const player: string | "P1" | "P2" = this.P1 ? "P2" : "P1";
		this.P1 ? this.P2 = socket : this.P1 = socket;
		this.full = !!this.P1 && !!this.P2;
		this.sendData({ type: "INFO", message: "Room found" });
		socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: player, roomId: this.id }));

		if (!this.full)
			return ;
		this.game = new Game(this.id, this.P1, this.P2, false, this.spectators);
		this.sendData({type: "INFO", message: "Room is full, ready to start, awaiting confirmation"});
		this.sendData({ type : "CONFIRM" });
	}

	soloSetup(socket) {
		this.P1 = socket;
		this.P2 = socket;
		this.full = true;
		this.sendData({ type: "INFO", message: "Solo room created, starting game" });
		this.sendData({ type: "GAME", message: "PREP", player: "P1", roomId: this.id });
		this.game = new Game(this.id, this.P1, this.P2, true, this.spectators);
	}

	startGame() {
		if (!this.full || this.started)
			return ;
		if (!this.game)
			this.game = new Game(this.id, this.P1, this.P2, false, this.spectators);
		this.started = true;
		this.sendData({ type: "INFO", message: "The game is starting" });
		this.sendData({ type: "GAME", message: "START" });
		this.game.gameLoop();
	}

	addSpectator(socket: WebSocket) {
		this.spectators.push(socket);
		this.game?.addSpectator(socket);
	}

	removeSpectator(index: number) {
		const socket = this.spectators.at(index);
		if (!socket)
			return ;
		this.spectators.splice(this.spectators.indexOf(socket), 1);
		socket.send(JSON.stringify({ type: "INFO", message: "You stopped spectating the room" }));
		socket.send(JSON.stringify({ type: "LEAVE", data: "PONG" }));

	}

}
