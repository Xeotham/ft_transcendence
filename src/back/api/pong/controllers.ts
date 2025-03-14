// Fastify request and response to create the controllers for the API
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from "ws";
import { Game } from "../../pong_app/server/pong_game";
import * as Constants from "../../pong_app/server/constants";

// Interactions with the DataBase to create and get Users
// import { createUser, getUserByUsername } from '../../database/models/Games';

interface Room {
	id:			number;
	P1:			WebSocket | null;
	P2:			WebSocket | null;
	full:		boolean;
	game:		Game | null;
	isP1Ready:	boolean;
	isP2Ready:	boolean;
	// private:	boolean; // TODO: Implement private rooms
	// inviteCode:	string;
}

export interface PongRequestBody {
	message: string;
	key:	string;
	roomId:	number;
	P:	string;
}

export interface responseFormat {
	type: string;
	data: any;
	message: string;
	player: string | null;
	roomID: number | null;
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
	console.log("New Player looking to join room");

	if (Rooms.find((room) => { return (room.P1 === socket || room.P2 === socket); }))
		return socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }));

	// Check existing rooms for an available spot
	for (const room of Rooms) {
		if (room.P1 && !room.P2) {
			room.P2 = socket;
			room.full = true;
			room.game = new Game(room.id, room.P1, room.P2);
			room.P1.send(JSON.stringify({ type: "INFO", message: "Room found, ready to start, awaiting confirmation" }));
			room.P2.send(JSON.stringify({ type: "INFO", message: "Room found, ready to start, awaiting confirmation" }));
			room.P1.send(JSON.stringify({ type: "CONFIRM" }));
			room.P2.send(JSON.stringify({ type: "CONFIRM" }));
			socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: "P2", roomID: room.id }));
			return ;
		}
	}

	// If no available room is found, create a new one
	const id = idGen.next().value;
	const newRoom = { id: id, P1: socket, P2: null, isP1Ready: false, isP2Ready: false, full: false, game: null };
	Rooms.push(newRoom);
	socket.send(JSON.stringify({ type: "INFO", message: "Room created, awaiting player 2"}));
	socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: "P1", roomID: id }));
	return ;
};

export const startConfirm = async (request: FastifyRequest<{ Body: PongRequestBody }>, reply: FastifyReply) => {
	let		room = Rooms.find((room) => { return (room.id === request.body.roomId); });
	const	player: string | "P1" | "P2" = request.body.P;
	// TODO: look at that again later

	if (!room)
		return;
	const	playerSocket: WebSocket | null = player === "P1" ? room.P1 : room.P2;
	if (player === "P1")
		room.isP1Ready = true;
	else
		room.isP2Ready = true;
	playerSocket.send(JSON.stringify({ type: "INFO", message: "You are ready, waiting for your opponent" }))

	if (!room.isP1Ready || !room.isP2Ready)
		return playerSocket.send(JSON.stringify({type: "INFO", message: "Players not ready"}));

	room.P1.send(JSON.stringify({ type: "INFO", message: "Both players are ready, the game is starting." }));
	room.P2.send(JSON.stringify({ type: "INFO", message: "Both players are ready, the game is starting." }));
	room.P1.send(JSON.stringify({ type: "GAME", message: "START" }));
	room.P2.send(JSON.stringify({ type: "GAME", message: "START" }));
	console.log("Starting game");
	room.game.GameLoop();
}

export const quitRoom = async (request: FastifyRequest<{ Body: PongRequestBody }>, reply: FastifyReply) => {

	console.log("Player : " + request.body.P + " is quitting room : " + request.body.roomId);

	const room = Rooms.find((room) => { return room.id === request.body.roomId; });

	if (!room)
		return console.log("Room not found");

	const player: string | "P1" | "P2" = request.body.P;
	const playerSocket: WebSocket | null = player === "P1" ? room.P1 : room.P2;
	const opponentSocket: WebSocket | null = player === "P1" ? room.P2 : room.P1;

	if (!playerSocket)
		return console.log("Player not found");
	Rooms.forEach((room) => {
		if (room.P1 !== playerSocket && room.P2 !== playerSocket)
			return ;
		if (room.game)
			room.game.Forfeit(player);
		playerSocket?.send(JSON.stringify({ type: "INFO", message: "You have left the room" }));
		opponentSocket?.send(JSON.stringify({ type: "WARNING", message: "Your opponent has left the room" }));
		if (!room.isP1Ready || !room.isP2Ready)
			opponentSocket?.send(JSON.stringify({ type: "LEAVE", message: request.body.message === "QUEUE_TIMEOUT" ? "QUEUE_AGAIN" : "QUIT" }));
		console.log("Room : " + room.id + " has been deleted");
		Rooms.splice(Rooms.indexOf(room), 1);
	});
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

