import {Room, idGenRoom, Tournaments} from "../../api/pong/controllers";
import * as Constants from "./constants"
import { WebSocket } from "ws";
import { requestBody } from "../../api/pong/controllers";


export class Tournament {
	private readonly id:	number;
	private started:		boolean;
	private rooms:			Room[][]; // tree structure
	private nbRoomsTop:		number;
	private players:		WebSocket[];
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
				if (this.rooms[i][j].id === id)
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
	}

	removePlayer(placementId: number) {
		this.needShuffle = true;
		this.players.splice(placementId, 1);
		this.sendToAll({ type: "INFO", message: "Player " + placementId + " has left the this tournament" })
		if (this.players.length < 0) {
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
		let positions: number[] = [];
		for (let i = 0; i < this.players.length; ++i)
			positions.push(i);
		for (let i = positions.length - 1; i > 0; --i) { // Fisher-Yates shuffle, to shuffle the player's positions
			const j = Math.floor(Math.random() * (i + 1));
			[positions[i], positions[j]] = [positions[j], positions[i]];
		}
		for (let i = 0; i < this.players.length; i += 2) {
			this.players[i].send(JSON.stringify({ type: "INFO", message: "You are in position " + positions[i] }));
			this.rooms[0][Math.floor(i / 2)].P1 = this.players[positions[i]];
			if (i + 1 >= this.players.length)
				continue ;
			this.players[i + 1].send(JSON.stringify({ type: "INFO", message: "You are in position " + positions[i + 1] }));
			this.rooms[0][Math.floor(i / 2)].P2 = this.players[positions[i + 1]];
		}
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
		// console.log("nbOfPlayers : " + this.);
		while (roomNb > 1) {
			rooms = [];
			if (roundCount < this.rooms.length && this.rooms[roundCount].length === roomNb) {
				roomNb = Math.ceil(roomNb / 2);
				roundCount++;
				continue ;
			}
			const alreadyIn = roundCount < this.rooms.length ? this.rooms[roundCount].length : 0;
			for (let i = alreadyIn; i < roomNb; i++) {
				rooms.push({ id: idGenRoom.next().value, P1: null, P2: null, isP1Ready: false, isP2Ready: false, full: false, game: null, isSolo: false });
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
			this.rooms.push([{ id: idGenRoom.next().value, P1: null, P2: null, isP1Ready: false, isP2Ready: false, full: false, game: null, isSolo: false }]);
	}

	printTree() {
		console.log("Tree : ");
		for (let i = 0; i < this.rooms.length; ++i) {
			process.stdout.write("Round " + i + " : ");
			for (let j = 0; j < this.rooms[i].length; ++j) {
				process.stdout.write("" + this.rooms[i][j].id);
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
	}
}

