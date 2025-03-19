// Fastify request and response to create the controllers for the API
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from "ws";
import { Game } from "../../pong_app/server/pong_game";
import { Tournament } from "../../pong_app/server/tournament";
import { Room } from "../../pong_app/server/Room";

// Interactions with the DataBase to create and get Users
// import { createUser, getUserByUsername } from '../../database/models/Games';

// export interface Room {
// 	id:			number;
// 	P1:			WebSocket | null;
// 	P2:			WebSocket | null;
// 	full:		boolean;
// 	game:		Game | null;
// 	getP1Ready():	boolean;
// 	isP2Ready:	boolean;
// 	isSolo:		boolean;
// 	spectators:	WebSocket[];
// 	// private:	boolean; // TODO: Implement private rooms
// 	// inviteCode:	string;
// }

export interface requestBody {
	matchType:		string;
	message:		string;
	key:			string;
	tourId:			number;
	roomId:			number;
	P:				string;
	tourPlacement:	number;
	specPlacement:	number;
}

export interface responseFormat {
	type: string;
	data: any;
	message: string;
	player: string | null;
	tourPlacement: number | null;
	tourId: number | null;
	roomId: number | null;
}

export let	Rooms: Room[] = [];
export let Tournaments: Tournament[] = [];

export function* idGenerator() {
	let i = 0;
	while (1)
		yield i++;
	return i;
}

export const idGenRoom = idGenerator();
const idGenTour = idGenerator();

function getRoomById(id: number): Room | undefined {

	if (Rooms.find((room) => { return room.getId() === id; }))
		return Rooms.find((room) => { return room.getId() === id; }); // Find the room in the list of rooms

	// Find the room in the list of rooms in the tournaments
	Tournaments.forEach((tour) => {
		if (tour.getRoomById(id) !== null)
			return tour.getRoomById(id);
	});
}

function getTournamentById(id: number): Tournament | undefined {
	return Tournaments.find((tour) => { return tour.getId() === id; });
}

function isPlayerInRoom(socket: WebSocket): boolean {
	return Rooms.find((room) => { return room.getP1() === socket || room.getP2() === socket; }) !== undefined;
}

function isPlayerInTournament(socket: WebSocket): boolean {
	return Tournaments.find((tour) => { return tour.getPlayers().find((player) => { return player === socket }) }) !== undefined;
}

export const joinMatchmaking = async (socket: WebSocket, req: FastifyRequest) => {

	if (isPlayerInRoom(socket) || isPlayerInTournament(socket))
		return socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }));

	console.log("New Player looking to join room");
	// Check existing rooms for an available spot
	for (const room of Rooms) {
		if (!room.isFull()) {
			room.addPlayer(socket);
			break ;
		}
	}

	// If no available room is found, create a new one
	const newRoom = new Room(idGenRoom.next().value);
	newRoom.addPlayer(socket);
	Rooms.push(newRoom);
	return ;
};

export const joinSolo = async (socket: WebSocket, req: FastifyRequest) => {

	if (isPlayerInRoom(socket) || isPlayerInTournament(socket))
		return socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }));

	console.log("New Player creating solo room");
	const newRoom = new Room(idGenRoom.next().value, true);
	Rooms.push(newRoom);
	newRoom.soloSetup(socket);
	newRoom.startGame();
}

export const createTournament = async (socket: WebSocket, req: FastifyRequest) => {

	// console.log("is Player in tournament : " + isPlayerInTournament(socket) + " is Player in room : " + isPlayerInRoom(socket));

	if (isPlayerInTournament(socket) || isPlayerInRoom(socket))
		return socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }));

	console.log("New Player creating tournament");
	const newTour = new Tournament(idGenTour.next().value, socket);
	Tournaments.push(newTour);

	socket.send(JSON.stringify({ type: "INFO", message: "Tournament created, awaiting players" }));
	socket.send(JSON.stringify({ type: "TOURNAMENT", message: "PREP", tourId: newTour.getId(), tourPlacement: 0 }));
}

export const joinTournament = async (socket: WebSocket, req: FastifyRequest) => {

	// Check if player is already in a room
	if (isPlayerInRoom(socket) || isPlayerInTournament(socket))
		return socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }));

	console.log("New Player looking to join tournament");
	for (const tour of Tournaments) {
		if (tour.hasStarted())
			continue ;
		tour.addPlayer(socket);
		socket.send(JSON.stringify({ type: "INFO", message: "You have joined the tournament" }));
		socket.send(JSON.stringify({ type: "TOURNAMENT", message: "PREP", tourId: tour.getId(), tourPlacement: tour.getPlayers().length - 1 }));
		return ;
	}
	socket.send(JSON.stringify({ type: "ALERT", message: "No tournament found. Disconnecting" }));
	socket.send(JSON.stringify({ type: "LEAVE" }));
}

export const shuffleTree = async (request: FastifyRequest<{ Body: requestBody }>, reply: FastifyReply) => {
	const tour = getTournamentById(request.body.tourId);
	if (!tour)
		return console.log("Tournament not found");
	tour.shuffleTree();
}

export const startConfirm = async (request: FastifyRequest<{ Body: requestBody }>, reply: FastifyReply) => {
	let room = getRoomById(request.body.roomId);
	const	player: string | "P1" | "P2" = request.body.P;
	// TODO: look at that again later

	if (!room)
		return;
	const	playerSocket: WebSocket | null = player === "P1" ? room.getP1() : room.getP2();
	if (player === "P1")
		room.setP1Ready(true);
	else
		room.setP2Ready(true);
	playerSocket.send(JSON.stringify({ type: "INFO", message: "You are ready, waiting for your opponent" }))

	if (!room.getP1Ready() || !room.getP2Ready())
		return playerSocket.send(JSON.stringify({type: "INFO", message: "Players not ready"}));

	room.startGame();
}

export const quitRoom = async (request: FastifyRequest<{ Body: requestBody }>, reply: FastifyReply) => {
	if (request.body.matchType === "PONG")
		quitPong(request);
	else if (request.body.matchType === "TOURNAMENT")
		quitTournament(request);
}

function quitPong(request: FastifyRequest<{ Body: requestBody }>) {

	const room = getRoomById(request.body.roomId);
	if (!room)
		return console.log("Room not found");

	console.log("Player : " + request.body.P + " is quitting room : " + request.body.roomId);
	const player: string | "P1" | "P2" = request.body.P;
	const playerSocket: WebSocket | null = player === "P1" ? room.getP1() : room.getP2();
	const opponentSocket: WebSocket | null = player === "P1" ? room.getP2() : room.getP1();

	if (!playerSocket)
		return console.log("Player not found");
	if (player === "SPEC")
		return room.removeSpectator(request.body.specPlacement);
	if (room.hasStarted())
		room.getGame().forfeit(player);
	playerSocket?.send(JSON.stringify({ type: "INFO", message: "You have left the room" }));
	opponentSocket?.send(JSON.stringify({ type: "WARNING", message: "Your opponent has left the room" }));
	if (!room.hasStarted())
		opponentSocket?.send(JSON.stringify({ type: "LEAVE", data: "PONG", message: request.body.message === "QUEUE_TIMEOUT" ? "QUEUE_AGAIN" : "QUIT" }));
	console.log("Room : " + room.getId() + " has been deleted");
	Rooms.splice(Rooms.indexOf(room), 1);
}

function quitTournament(request: FastifyRequest<{ Body: requestBody }>) {

	console.log("Player : " + request.body.tourPlacement + " is quitting tournament : " + request.body.tourId);

	const tour = getTournamentById(request.body.tourId);
	if (!tour)
		return console.log("Tournament not found");

	// TODO : Look at that when game already started
	if (tour.removePlayer(request.body.tourPlacement)) {
		console.log("Tournament : " + tour.getId() + " has been deleted");
		Tournaments.splice(Tournaments.indexOf(this), 1);
	}
}

export const startTournament = async (request: FastifyRequest<{ Body: requestBody }>, reply: FastifyReply) => {
	console.log("Starting game");
	const tour = getTournamentById(request.body.tourId);

	if (!tour)
		return console.log("Tournament not found");
	tour.startTournament();
};

export const movePaddle = async (request: FastifyRequest<{ Body: requestBody }>, reply: FastifyReply) => {
	let room = getRoomById(request.body.roomId);

	if (!room || !room.getGame())
		return reply.send(JSON.stringify({type: "ERROR", message: "Room not found"}));
	room.getGame().movePaddle(request.body);
};

export const    addSpectatorToRoom = async (socket: WebSocket, req: FastifyRequest<{ Querystring: { id: number } }>) => {
	const	id = Number(req.query.id);
	const	room = getRoomById(id);
	if (!room || room.getIsSolo()) {
		socket.send(JSON.stringify({type: "INFO", message: "You cannot spectate this room"}));
		socket.send(JSON.stringify({type: "LEAVE", data: "PONG"}));
	}
	room.addSpectator(socket);
}
