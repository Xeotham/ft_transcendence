import { WebSocket } from "ws";
import { Game } from "./pong_game";
import { getTournamentById, responseFormat } from "../utils";

// const { WebSocket } = require('ws');
// const { Game } = require('./pong_game');
// const { getTournamentById, responseFormat } = require('../utils');
//
// type GameType = typeof Game;
// type responseFormatType = typeof responseFormat;

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
	private isInTournament:	boolean;
	private tourId:			number;
	// private:	boolean; // TODO: Implement private rooms
	// inviteCode:	string;

	constructor(id:	number, isSolo: boolean = false, isInTournament: boolean = false, tourId: number = -1) {
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
		this.isInTournament = isInTournament;
		this.tourId = tourId;
	}

	getId() { return this.id; }
	getP1() { return this.P1; }
	getP2() { return this.P2; }
	isFull() { return this.full; }
	getGame() { return this.game; }
	getP1Ready() { return this.isP1Ready; }
	getP2Ready() { return this.isP2Ready; }
	getIsSolo() { return this.isSolo; }
	hasStarted() { return this.started; }
	isOver() { return this.game ? this.getGame()!.isOver() : false; }
	getIsInTournament() { return this.isInTournament; }

	setP1(socket: WebSocket) { this.P1 = socket; }
	setP2(socket: WebSocket) { this.P2 = socket; }
	setFull(bool: boolean) { this.full = bool; }
	setP1Ready(bool: boolean) { this.isP1Ready = bool; }
	setP2Ready(bool: boolean) { this.isP2Ready = bool; }

	sendData(data: responseFormat, toSpectators: boolean = false) {
		this.P1?.send(JSON.stringify(data));
		if (!this.isSolo)
			this.P2?.send(JSON.stringify(data));
		if (toSpectators)
			for (let spectator of this.spectators)
				spectator?.send(JSON.stringify(data));
	}

	addPlayer(socket: WebSocket) {
		if (this.full)
			return ;
		const player: string | "P1" | "P2" = this.P1 ? "P2" : "P1";
		this.P1 ? this.P2 = socket : this.P1 = socket;
		this.full = !!this.P1 && !!this.P2;
		socket.send(JSON.stringify({ type: "INFO", message: "Room found" }));
		socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: player, roomId: this.id }));

		if (!this.full)
			return ;
		this.game = new Game(this.id, this.P1, this.P2, false, this.spectators);
		this.sendData({ type: "INFO", message: "Room is full, ready to start, awaiting confirmation" });
		this.sendData({ type : "CONFIRM" });
	}

	soloSetup(socket: WebSocket) {
		this.P1 = socket;
		this.P2 = socket;
		this.full = true;
		this.isSolo = true;
		this.sendData({ type: "INFO", message: "Solo room created, starting game" });
		this.sendData({ type: "GAME", message: "PREP", player: "P1", roomId: this.id });
		this.game = new Game(this.id, this.P1, this.P2, true, this.spectators);
	}

	startGame() {
		if (!this.full || this.started)
			return ;
		if (!this.game)
			this.game = new Game(this.id, this.P1, this.P2, this.isSolo, this.spectators);
		this.started = true;
		this.sendData({ type: "INFO", message: "The game is starting" });
		this.sendData({ type: "GAME", message: "START" }, true);
		// console.log("Starting game " + this.id + " is In tournament : " + this.isInTournament);
		if (!this.isInTournament)
			this.game.gameLoop();
		else
			this.game.gameLoop().then(() => {
				getTournamentById(this.tourId)?.nextRound(this.id);
			});
	}

	addSpectator(socket: WebSocket) {
		this.spectators.push(socket);
		// this.game?.addSpectator(socket);
		console.log("Spectator added to room " + this.id + " at placement " + (this.spectators.length - 1));
		socket.send(JSON.stringify({ type: "GAME", message: "SPEC", data: (this.spectators.length - 1), roomId: this.id }));
	}

	removeSpectator(index: number, sendPlacementChange: boolean = true) {
		console.log("Removing spectator from room " + this.id + " at placement " + index);
		const socket = this.spectators.at(index);
		if (!socket)
			return ;
		socket.send(JSON.stringify({ type: "INFO", message: "You stopped spectating the room" }));
		socket.send(JSON.stringify({ type: "LEAVE" }));

		this.spectators.splice(this.spectators.indexOf(socket), 1);
		if (sendPlacementChange)
			for (let i = 0; i < this.spectators.length; ++i)
				this.spectators[i].send(JSON.stringify({ type: "GAME", message: "SPEC", data: i }));
	}

	removeAllSpectators() {
		for (let i = this.spectators.length - 1; i >= 0; --i)
			this.removeSpectator(i, false);
	}
}
