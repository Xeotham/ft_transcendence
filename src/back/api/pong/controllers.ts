// Fastify request and response to create the controllers for the API
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from "ws";
import { Game } from "../../pong_app/server/pong_game";

// Interactions with the DataBase to create and get Users
// import { createUser, getUserByUsername } from '../../database/models/Games';

interface Room {
	id:			number;
	player1:	WebSocket | null;
	player2:	WebSocket | null;
	full:		boolean;
	game:		Game;
	// private:	boolean;
	// inviteCode:	string;
}

interface MovePaddleRequestBody {
	key: string;
	socket: WebSocket;
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
	Rooms.forEach((room) => {
		if (socket === room.player1 || socket === room.player2)
			return socket.send(JSON.stringify({type: "INFO", message: "You are already in a room"}));
		if (!room.full) {
			room.player2 = socket;
			room.full = true;
			// console.log(type: "INFO",message: "Room found, starting game");
			return socket.send(JSON.stringify({type: "INFO",message: "Room found, starting game"}));
		}
	});
	Rooms.push({id: idGen.next().value, player1: socket, player2: null, full: false, game: new Game() });
	// console.log("Room created, awaiting player 2");
	return socket.send(JSON.stringify({type: "INFO",message: "Room created, awaiting player 2"}));
};

export const quitRoom = async (socket: WebSocket, req: FastifyRequest) => {
	console.log("Quitting room");

	Rooms.forEach((room) => {
		if (socket === room.player1 && room.player2 !== null) {
			room.player1 = room.player2;
			room.player2 = null;
			room.full = false;
			room.player1.send("Your opponent has left the room");
			return socket.send("You have left the room");
		}
		else if (socket === room.player2) {
			room.player2 = null;
			room.full = false;
			room.player1?.send("Your opponent has left the room");
			return socket.send("You have left the room");
		}
		else if (socket === room.player1) {
			Rooms.splice(Rooms.indexOf(room), 1);
			return socket.send("You have left the room");
		}
	});
	return socket.send("You are not in a room");
};

export const startGame = async (socket: WebSocket, req: FastifyRequest) => {

};

export const movePaddle = async (request: FastifyRequest<{ Body: MovePaddleRequestBody }>, reply: FastifyReply) => {

	console.log("Moving paddle");
	console.log(request.body.socket);
	return request.body.socket.send(JSON.stringify("Moving paddle????"));
};

export const finishGame = async (request: FastifyRequest, reply: FastifyReply) => {
	console.log("Game Finished");
	return reply.send(JSON.stringify("Game Finished????"));

};
