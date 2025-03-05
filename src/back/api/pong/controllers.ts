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

	Rooms.forEach((room) => {
		if (socket === room.P1 || socket === room.P2)
			return socket.send(JSON.stringify({type: "INFO", message: "You are already in a room"}));
		if (room.P1 && !room.full) {
			room.P2 = socket;
			room.full = true;
			room.game = new Game(room.id, room.P1, room.P2);
			room.P1.send(JSON.stringify({type: "ALERT",message: "Room found, ready to start, awaiting confirmation"}));
			room.P2.send(JSON.stringify({type: "ALERT",message: "Room found, ready to start, awaiting confirmation"}));
			room.P1.send(JSON.stringify({type: "CONFIRM"}));
			room.P2.send(JSON.stringify({type: "CONFIRM"}));
			return ;
		}
	});
	Rooms.push({id: idGen.next().value, P1: socket, P2: null, isP1Ready: false, isP2Ready: false, full: false, game: null });
	return socket.send(JSON.stringify({type: "INFO",message: "Room created, awaiting player 2"}));
};

async function waitingPlayers(room: Room) {
	while (!room.isP1Ready || !room.isP2Ready) {
		console.log("Waiting for players");
	}
	return true
}

export const startConfirm = async (socket: WebSocket, req: FastifyRequest) => {
	let room = Rooms.find((room) => { return (room.P1 === socket || room.P2 === socket); });

	if (!room)
		return socket.send(JSON.stringify({type: "ERROR", message: "Room not found"}));
	if (room.P1 === socket)
		room.isP1Ready = true;
	if (room.P2 === socket)
		room.isP2Ready = true;
	await waitingPlayers(room);
	console.log("Starting game");
	if (room.P1 === socket)
		room.game.GameLoop();
	return socket.send(JSON.stringify({type: "GAME", message: "FINISH"}));
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
