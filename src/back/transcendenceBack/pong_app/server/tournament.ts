import { deleteTournament } from "../api/tournament-controllers";
import { delay, idGenerator, player } from "../utils";
import { WebSocket } from "ws";
import { Room } from "./Room";

const	idGenRoom = idGenerator();

export class Tournament {
	private readonly id:		number;
	private started:			boolean;
	private rooms:				Room[][]; // tree structure
	private nbRoomsTop:			number;
	private players:			player[];
	private positions:			number[];
	private needShuffle:		boolean;
	private round:				number;
	private gameFinished:		number;
	private name:               string;

	toJSON() {
		return {
			rooms: this.rooms,
		};
	}

	constructor(id: number, player: player, name: string) {
		this.id = id;
		this.started = false;
		this.rooms = [];
		this.nbRoomsTop = 0;
		this.players = [player];
		this.positions = [];
		this.needShuffle = true;
		this.round = 0;
		this.gameFinished = 0;
		this.name = name;
	}

	getId() { return this.id; }
	hasStarted() { return this.started; }
	getRooms() { return this.rooms; }
	getPlayers() { return this.players; }
	getName() { return this.name; }
	getRound() { return this.round; }

	getRoomById(id: number) {
		for (let i = 0; i < this.rooms.length; i++) {
			for (let j = 0; j < this.rooms[i].length; j++) {
				if (this.rooms[i][j].getId() === id)
					return this.rooms[i][j];
			}
		}
		return undefined;
	}

	sendToAll(data: any) {
		this.players.forEach(player => {
			player.socket.send(JSON.stringify(data));
		});
	}

	addPlayer(player: player) {
		this.needShuffle = true;
		this.players.push(player);
		player.socket.send(JSON.stringify({ type: "INFO", message: "You have joined the tournament" }));
		player.socket.send(JSON.stringify({ type: "TOURNAMENT", message: "PREP", tourId: this.id, tourPlacement: this.players.length - 1 }));
	}

	removePlayer(placementId: number) {
		this.needShuffle = true;

		this.sendToAll({ type: "WARNING", message: "Player " + placementId + " has left the tournament" })
		for (let i = placementId + 1; i < this.players.length; ++i)
			this.players[i].socket.send(JSON.stringify({ type: "TOURNAMENT", message: "PREP", data: "CHANGE_PLACEMENT", tourId: this.id, tourPlacement: i - 1 }));
		if (!this.started) {
			this.players.splice(placementId, 1);
			if (this.players.length <= 0)
				return deleteTournament(this.id);
			if (placementId === 0)
				this.players[0].socket.send(JSON.stringify({ type: "TOURNAMENT", message: "OWNER" }));
		}

		// Find the room where the player is
		const room: Room | undefined = this.rooms.flat().find((room) => {
			return room.getP1() === this.players[placementId] || room.getP2() === this.players[placementId];
		});

		console.log("Player " + placementId + " is leaving tournament " + this.id + " in room " + room?.getId());

		if (!room)
			return ;

		const player: string | "P1" | "P2" = this.players[placementId] === room.getP1() ? "P1" : "P2";

		if (room.hasStarted() && !room.isOver())
			room.getGame()?.forfeit(player);

		if (!room.getGame()) {
			console.log("Game not started, removing player from room");
			room.setFull(true);
			room.startGame();
			room.getGame()?.forfeit(player);
		}

		this.players.splice(placementId, 1);
		if (this.players.length <= 0)
			deleteTournament(this.id);
	}

	shuffleTree() {
		if (this.started)
			return this.players[0]?.socket.send(JSON.stringify({ type: "ERROR", message: "Tournament already started, cannot shuffle right now" }));

		this.updateTree();

		// Place the players in the rooms in a random order
		this.positions = [];
		for (let i = 0; i < this.players.length; ++i)
			this.positions.push(i);
		for (let i = this.positions.length - 1; i > 0; --i) { // Fisher-Yates shuffle, to shuffle the player's positions
			const j = Math.floor(Math.random() * (i + 1));
			[this.positions[i], this.positions[j]] = [this.positions[j], this.positions[i]];

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
		while (roomNb > 1) {
			rooms = [];
			if (roundCount < this.rooms.length && this.rooms[roundCount].length === roomNb) {
				roomNb = Math.ceil(roomNb / 2);
				roundCount++;
				continue ;
			}
			const alreadyIn = roundCount < this.rooms.length ? this.rooms[roundCount].length : 0;
			for (let i = alreadyIn; i < roomNb; i++)
				rooms.push(new Room(idGenRoom.next().value, false, true, this.id));
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
	}

	printTree() {
		console.log("Tree of Tournament " + this.id + " : ");
		for (let i = 0; i < this.rooms.length; ++i) {
			process.stdout.write("\tRound " + i + " : ");
			for (let j = 0; j < this.rooms[i].length; ++j) {
				process.stdout.write("" + this.rooms[i][j].getId());
				if (j < this.rooms[i].length - 1)
					process.stdout.write(" - ");
			}
			console.log("");
		}
		process.stdout.write("Positions : ");
		for (let i = 0; i < this.positions.length; ++i)
			process.stdout.write(this.positions[i] + " - ");
		console.log("");
	}

	async startTournament() {
		if (this.needShuffle)
			this.shuffleTree();
		this.started = true;

		for (let i = 0; i < this.positions.length; ++i) {
			const room = this.rooms[0][Math.floor(i / 2)];
			this.players[this.positions[i]].socket.send(JSON.stringify({ type: "INFO", message: "You are in room " + room.getId() }));
			this.players[this.positions[i]].socket.send(JSON.stringify({ type: "TOURNAMENT", message: "CREATE", roomId: room.getId() }));
			room.addPlayer(this.players[this.positions[i]].socket, this.players[this.positions[i]].username);
		}
		if (this.players.length % 2 === 1) {
			const room = this.rooms[0][this.nbRoomsTop - 1];
			room.setFull(true);
			room.startGame();
			room.getGame()?.forfeit("P2");
			}
	}

	async nextRound(roomId: number) {
		console.log("The game of room: " + roomId + " in tournament: " + this.id + " as ended");
		++this.gameFinished;

		if (this.gameFinished < this.rooms[this.round].length)
			return;
		this.gameFinished = 0;

		console.log("\x1b[31mAll games of round " + this.round + " have ended. Moving to next round\x1b[0m");
		if (this.round + 1 === this.rooms.length) {
			console.log("Tournament ended");

			const	winner = this.rooms[this.rooms.length - 1][0].getGame()?.getWinner();

			console.log("\x1b[38;5;204mThe Grand winner is " + winner?.username + "\x1b[0m");
			this.sendToAll({type: "INFO", message: "Tournament ended"});
			this.sendToAll({type: "LEAVE", data: "TOURNAMENT", winner: (winner !== undefined ? winner?.username : "Nobody")});
			deleteTournament(this.id);
			return;
		}

		await delay(1000);

		for (let i = 0; i < this.rooms[this.round].length; ++i) {
			const	winner: player = this.rooms[this.round][i].getGame()?.getWinner()!;

			if (!winner) {
				console.log("No winner found for room " + this.rooms[this.round][i].getId());
				continue ;
			}
			winner.socket.send(JSON.stringify({ type: "TOURNAMENT", message: "CREATE", roomId: this.rooms[this.round + 1][Math.floor(i / 2)].getId() }));
			// Don't add player if already left the tournament, it will check later if a player is alone in a room
			if (winner.socket.readyState !== WebSocket.CLOSED)
				this.rooms[this.round + 1][Math.floor(i / 2)].addPlayer(winner);
			if (i % 2 === 1) {
				const room = this.rooms[this.round + 1][Math.floor(i / 2)];
				console.log("Player " + room.getP1()?.username +
					" will face player " + room.getP2()?.username);
			}
		}
		// If only one player in the room, automatically win

		++this.round;
		for (let i = 0; i < this.rooms[this.round].length; ++i) {
			const room = this.rooms[this.round][i];
			if (!room.isFull()) {
				room.setFull(true);
				room.startGame();
				room.getGame()?.forfeit("P2");
			}
		}
		this.sendToAll({type: "TOURNAMENT", message: "SPECLST"});
	}
}
