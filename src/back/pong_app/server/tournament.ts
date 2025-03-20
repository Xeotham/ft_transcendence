import { Tournaments } from "../../api/pong/tournament-controllers";
import	{ idGenerator, requestBody } from "../../api/pong/utils";
import * as Constants from "./constants"
import { WebSocket } from "ws";
import { Game } from "./pong_game";
import { Room } from "./Room";

const	idGenRoom = idGenerator();

export class Tournament {
	private readonly id:	number;
	private started:		boolean;
	private rooms:			Room[][]; // tree structure
	private nbRoomsTop:		number;
	private players:		WebSocket[];
	private positions:		number[];
	private needShuffle:	boolean;

	toJSON() {
		return {
			rooms: this.rooms,
		};
	}

	constructor(id: number, player: WebSocket) {
		this.id = id;
		this.started = false;
		this.rooms = [];
		this.nbRoomsTop = 0;
		this.players = [player];
		this.positions = [];
		this.needShuffle = true;
	}

	getId() {
		return this.id;
	}

	hasStarted() {
		return this.started;
	}

	getRooms() {
		return this.rooms;
	}

	getPlayers() {
		return this.players;
	}

	getRoomById(id: number) {
		for (let i = 0; i < this.rooms.length; i++) {
			for (let j = 0; j < this.rooms[i].length; j++) {
				if (this.rooms[i][j].getId() === id)
					return this.rooms[i][j];
			}
		}
		return null;
	}

	sendToAll(data: any) {
		this.players.forEach(player => {
			player.send(JSON.stringify(data));
		});
	}

	addPlayer(player: WebSocket) {
		this.needShuffle = true;
		this.players.push(player);
		player.send(JSON.stringify({ type: "INFO", message: "You have joined the tournament" }));
		player.send(JSON.stringify({ type: "TOURNAMENT", message: "PREP", tourId: this.id, tourPlacement: this.players.length - 1 }));
	}

	removePlayer(placementId: number) {
		this.needShuffle = true;


		// Find the room where the player is
		const room: Room = this.rooms.flat().find((room) => {
			return room.getP1() === this.players[placementId] || room.getP2() === this.players[placementId];
		});

		const player: string | "P1" | "P2" = this.players[placementId] === room.getP1() ? "P1" : "P2";


		// room.startGame();
		// room.getGame().forfeit(player);
		if (room.hasStarted())
			room.getGame().forfeit(player);
		// else
		// 	room.

		(player === "P1" ? room.getP2() : room.getP1())?.send(JSON.stringify({ type: "WARNING", message: "Your opponent has left the room" }));

		this.players.splice(placementId, 1);
		this.sendToAll({ type: "INFO", message: "Player " + placementId + " has left the tournament" })
		if (this.players.length <= 0) {
			return true;
		}
		if (placementId === 0)
			this.players[0].send(JSON.stringify({ type: "TOURNAMENT", message: "OWNER" }));
		return false;
	}

	shuffleTree() {
		console.log("Shuffling tournament : " + this.id);

		if (this.started)
			return this.players[0]?.send(JSON.stringify({ type: "ERROR", message: "Tournament already started, cannot shuffle right now" }));

		this.updateTree();

		// Place the players in the rooms in a random order
		this.positions = [];
		for (let i = 0; i < this.players.length; ++i)
			this.positions.push(i);
		for (let i = this.positions.length - 1; i > 0; --i) { // Fisher-Yates shuffle, to shuffle the player's positions
			const j = Math.floor(Math.random() * (i + 1));
			[this.positions[i], this.positions[j]] = [this.positions[j], this.positions[i]];
		}
		for (let i = 0; i < this.players.length; ++i)
			this.players[i].send(JSON.stringify({ type: "INFO", message: "You are in position " + this.positions[i] }));
		console.log("\x1b[38;5;82mTournament shuffled\x1b[0m");
		this.needShuffle = false;
		this.printTree();
	}

	updateTree() {
		// Create / update the tree structure
		this.nbRoomsTop = Math.ceil(this.players.length / 2);
		if (this.rooms.length && this.nbRoomsTop === this.rooms[0].length)
			return ;
		let roomNb = this.nbRoomsTop;
		let	roundCount = 0;
		let rooms: Room[] = [];
		while (roomNb > 1) {
			rooms = [];
			if (roundCount < this.rooms.length && this.rooms[roundCount].length === roomNb) {
				roomNb = Math.ceil(roomNb / 2);
				roundCount++;
				continue ;
			}
			const alreadyIn = roundCount < this.rooms.length ? this.rooms[roundCount].length : 0;
			for (let i = alreadyIn; i < roomNb; i++) {
				rooms.push(new Room(idGenRoom.next().value, false, true, this.id));
				// rooms.push({ id: idGenRoom.next().value, P1: null, P2: null, isP1Ready: false, isP2Ready: false, full: false, game: null, isSolo: false, spectators: [] });
			}
			if (alreadyIn > roomNb)
				this.rooms[roundCount] = this.rooms[roundCount].slice(0, roomNb);
			else if (alreadyIn > 0)
				this.rooms[roundCount].push(...rooms);
			else
				this.rooms.push(rooms);
			roomNb = Math.ceil(roomNb / 2);
			roundCount++;
		}

		// Clean tree above roundCount if too many rooms
		if (this.rooms.length > roundCount + 1)
			this.rooms.splice(roundCount); // Remove even the last round (Added right after)
		if (roundCount === 0 || this.rooms[this.rooms.length - 1].length !== 1)
			this.rooms.push([new Room(idGenRoom.next().value, false, true, this.id)]);
			// this.rooms.push([{ id: idGenRoom.next().value, P1: null, P2: null, isP1Ready: false, isP2Ready: false, full: false, game: null, isSolo: false, spectators: [] }]);
	}

	printTree() {
		console.log("Tree : ");
		for (let i = 0; i < this.rooms.length; ++i) {
			process.stdout.write("Round " + i + " : ");
			for (let j = 0; j < this.rooms[i].length; ++j) {
				process.stdout.write("" + this.rooms[i][j].getId);
				if (j < this.rooms[i].length - 1)
					process.stdout.write(" - ");
			}
			console.log("");
		}
	}

	async startTournament() {
		if (this.needShuffle)
			this.shuffleTree();
		this.started = true;

		for (let i = 0; i < this.positions.length; ++i) {
			this.rooms[0][Math.floor(i / 2)].addPlayer(this.players[this.positions[i]]);
			
		}

	}

	async nextRound(roomId: number) {
		// let nbRooms = this.nbRoomsTop;

		console.log("A game as ended, trying to start the next one");
		for (let i = 0; i < this.rooms.length; ++i) {
			const winningRoom = this.rooms[i].find((room) => { return room.getId() === roomId });

			// 	for (let j = 0; j < nbRooms; ++j) {
		// 		if (this.rooms[i][j].game.isOver()) {
		//
		// 		}
		// 	}
		// 	nbRooms = Math.ceil(nbRooms / 2);
		}
	}
}
