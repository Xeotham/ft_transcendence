// Fastify request and response to create the controllers for the API
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from "ws";
import { Game } from "../../pong_app/server/pong_game";
import { Tournament } from "../../pong_app/server/tournament";

// Interactions with the DataBase to create and get Users
// import { createUser, getUserByUsername } from '../../database/models/Games';

export interface Room {
	id:			number;
	P1:			WebSocket | null;
	P2:			WebSocket | null;
	full:		boolean;
	game:		Game | null;
	isP1Ready:	boolean;
	isP2Ready:	boolean;
	isSolo:		boolean;
	spectators:	WebSocket[];
	// private:	boolean; // TODO: Implement private rooms
	// inviteCode:	string;
}

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

	if (Rooms.find((room) => { return room.id === id; }))
		return Rooms.find((room) => { return room.id === id; }); // Find the room in the list of rooms

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
	return Rooms.find((room) => { return room.P1 === socket || room.P2 === socket; }) !== undefined;
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
		if (room.P1 && !room.P2) {
			room.P2 = socket;
			room.full = true;
			room.game = new Game(room.id, room.P1, room.P2, false, room.spectators);
			room.P1.send(JSON.stringify({ type: "INFO", message: "Room found, ready to start, awaiting confirmation" }));
			room.P2.send(JSON.stringify({ type: "INFO", message: "Room found, ready to start, awaiting confirmation" }));
			room.P1.send(JSON.stringify({ type: "CONFIRM" }));
			room.P2.send(JSON.stringify({ type: "CONFIRM" }));
			socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: "P2", roomId: room.id }));
			return ;
		}
	}

	// If no available room is found, create a new one
	const id = idGenRoom.next().value;
	const newRoom = { id: id, P1: socket, P2: null, isP1Ready: false, isP2Ready: false, full: false, game: null, isSolo: false, spectators: [] };
	Rooms.push(newRoom);
	socket.send(JSON.stringify({ type: "INFO", message: "Room created, awaiting player 2"}));
	socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: "P1", roomId: id }));
	return ;
};

export const joinSolo = async (socket: WebSocket, req: FastifyRequest) => {

	if (isPlayerInRoom(socket) || isPlayerInTournament(socket))
		return socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }));

	console.log("New Player creating solo room");
	const newRoom = { id: idGenRoom.next().value, P1: socket, P2: socket, isP1Ready: true, isP2Ready: true, full: true, game: null, isSolo: true, spectators: [] };
	newRoom.game = new Game(newRoom.id, socket, socket, true);
	Rooms.push(newRoom);
	socket.send(JSON.stringify({ type: "INFO", message: "Solo room created, starting game" }));
	socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: "P1", roomId: newRoom.id }));
	socket.send(JSON.stringify({ type: "GAME", message: "START" }));
	newRoom.game.GameLoop();
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
	room.game.gameLoop();
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
	const playerSocket: WebSocket | null = player === "P1" ? room.P1 : room.P2;
	const opponentSocket: WebSocket | null = player === "P1" ? room.P2 : room.P1;

	if (!playerSocket)
		return console.log("Player not found");
	// Rooms.forEach((room) => {
	// 	if (room.P1 !== playerSocket && room.P2 !== playerSocket)
	// 		return ;
	if (player === "SPEC") {
		const socket = room.spectators.at(request.body.specPlacement);
		if (!socket)
			return ;
		room.spectators.splice(room.spectators.indexOf(socket), 1);
		socket.send(JSON.stringify({ type: "INFO", message: "You stopped spectating the room" }));
		socket.send(JSON.stringify({ type: "LEAVE", data: "PONG" }));
		return ;
	}
		if (room.game)
			room.game.forfeit(player);
		playerSocket?.send(JSON.stringify({ type: "INFO", message: "You have left the room" }));
		opponentSocket?.send(JSON.stringify({ type: "WARNING", message: "Your opponent has left the room" }));
		if (!room.isP1Ready || !room.isP2Ready)
			opponentSocket?.send(JSON.stringify({ type: "LEAVE", data: "PONG", message: request.body.message === "QUEUE_TIMEOUT" ? "QUEUE_AGAIN" : "QUIT" }));
		console.log("Room : " + room.id + " has been deleted");
		Rooms.splice(Rooms.indexOf(room), 1);
	// });
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

	if (!room || !room.game)
		return reply.send(JSON.stringify({type: "ERROR", message: "Room not found"}));
	room.game.movePaddle(request.body);
};

export const    addSpectatorToRoom = async (socket: WebSocket, req: FastifyRequest<{ Querystring: { id: number } }>) => {
	const	id = Number(req.query.id);
	const	room = getRoomById(id);
	if (!room || room.isSolo) {
		socket.send(JSON.stringify({type: "INFO", message: "You cannot spectate this room"}));
		socket.send(JSON.stringify({type: "LEAVE", data: "PONG"}));
	}
	room.spectators.push(socket);
	room.game?.addSpectator(socket);
}
