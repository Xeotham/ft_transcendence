// Fastify request and response to create the controllers for the API
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from "ws";
import { Game } from "../../pong_app/server/pong_game";
import * as Constants from "../../pong_app/server/constants";
import * as repl from "node:repl";

// Interactions with the DataBase to create and get Users
// import { createUser, getUserByUsername } from '../../database/models/Games';

interface Room {
	id:			number;
	P1:	WebSocket | null;
	P2:	WebSocket | null;
	full:		boolean;
	game:		Game | null;
	isP1Ready:	boolean;
	isP2Ready:	boolean;
	// private:	boolean;
	// inviteCode:	string;
}

export interface PongRequestBody {
	key:	string;
	roomId:	number;
	side:	string;
}

export interface responseFormat {
	type: string;
	data: any;
	player: string | null;
	roomID: number | null;
	message: string;
}

export let	Rooms: Room[] = [];

function* idGenerator() {
	let i = 0;
	while (1)
		yield i++;
	return i;
}

const idGen = idGenerator();

export const joinRoom = async (socket: WebSocket, req: FastifyRequest) => {
	console.log("Joining room");

	// Check existing rooms for an available spot
	for (const room of Rooms) {
		if (room.P1 === socket || room.P2 === socket) {
			return socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }));
		}
		if (room.P1 && !room.P2) {
			room.P2 = socket;
			room.full = true;
			room.game = new Game(room.id, room.P1, room.P2);
			room.P1.send(JSON.stringify({ type: "ALERT", message: "Room found, ready to start, awaiting confirmation" }));
			room.P2.send(JSON.stringify({ type: "ALERT", message: "Room found, ready to start, awaiting confirmation" }));
			room.P1.send(JSON.stringify({ type: "CONFIRM" }));
			room.P2.send(JSON.stringify({ type: "CONFIRM" }));
			return socket.send(JSON.stringify({ type: "INFO", message: "Room joined", player: "P2", roomID: room.id }));
		}
	}

	// If no available room is found, create a new one
	const id = idGen.next().value;
	const newRoom = { id: id, P1: socket, P2: null, isP1Ready: false, isP2Ready: false, full: false, game: null };
	Rooms.push(newRoom);
	return socket.send(JSON.stringify({ type: "INFO", message: "Room created, awaiting player 2", player: "P1", roomID: id }));
};

function waitingPlayers(room: Room) {
	console.log("Waiting for players: P1: " + room.isP1Ready + " P2: " + room.isP2Ready);
	return !(!room.isP1Ready || !room.isP2Ready);
}

export const startConfirm = async (request: FastifyRequest<{ Body: PongRequestBody }>, reply: FastifyReply) => {
	let		room = Rooms.find((room) => { return (room.id === request.body.roomId); });
	const	player = (request.body.side === "left") ? "P1" : "P2";

	if (!room)
		return reply.send(JSON.stringify({type: "ERROR", message: "Room not found"}));
	if (player === "P1") {
		room.P1.send(JSON.stringify({ type: "ALERT", message: "You are ready, waiting for your opponent" }))
		room.isP1Ready = true;
	} else if (player === "P2") {
		room.P2.send(JSON.stringify({ type: "ALERT", message: "You are ready, waiting for your opponent" }))
		room.isP2Ready = true;
	}
	if (!waitingPlayers(room))
		return reply.send(JSON.stringify({type: "ERROR", message: "Players not ready"}));
	console.log("Starting game");
	room.P1.send(JSON.stringify({ type: "ALERT", message: "Both players are ready, the game is starting." }));
	room.P2.send(JSON.stringify({ type: "ALERT", message: "Both players are ready, the game is starting." }));
	if (player === "P1")
		room.game.GameLoop();
	return reply.send(JSON.stringify({type: "GAME", message: "FINISH"}));
}

export const quitRoom = async (socket: WebSocket, req: FastifyRequest) => {
	console.log("Quitting room");

	Rooms.forEach((room) => {
		if (socket === room.P1 && room.P2 !== null) {
			room.P1 = room.P2;
			room.P2 = null;
			room.full = false;
			room.game.Forfeit("P1");
			room.P1.send("Your opponent has left the room");
			return socket.send("You have left the room");
		}
		else if (socket === room.P2) {
			room.P2 = null;
			room.full = false;
			room.game.Forfeit("P2");
			room.P1?.send("Your opponent has left the room");
			return socket.send("You have left the room");
		}
		else if (socket === room.P1) {
			Rooms.splice(Rooms.indexOf(room), 1);
			return socket.send("You have left the room");
		}
	});
	return socket.send("You are not in a room");
};

export const startGame = async (request: FastifyRequest<{ Body: PongRequestBody }>, reply: FastifyReply) => {
	console.log("Starting game");
	let room = Rooms.find((room) => { return room.id === request.body.roomId; });

	if (!room || !room.game)
		return reply.send(JSON.stringify({type: "ERROR", message: "Room not found"}));
	room.game.GameLoop();
};

export const movePaddle = async (request: FastifyRequest<{ Body: PongRequestBody }>, reply: FastifyReply) => {
	let room = Rooms.find((room) => { return room.id === request.body.roomId; });

	if (!room || !room.game)
		return reply.send(JSON.stringify({type: "ERROR", message: "Room not found"}));
	room.game.MovePaddle(request.body);

};

export const finishGame = async (request: FastifyRequest, reply: FastifyReply) => {
	console.log("Game Finished");
	return reply.send(JSON.stringify("Game Finished????"));

};
