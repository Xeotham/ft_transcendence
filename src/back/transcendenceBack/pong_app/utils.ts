import { Room } from "./server/Room";
import { Tournament } from "./server/tournament";
import { FastifyReply, FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { Tournaments, deleteTournament } from "./api/tournament-controllers";
import { Rooms } from "./api/game-controllers";

// const { Room } = require('./server/Room');
// const { Tournament } = require('./server/tournament');
// const { FastifyReply, FastifyRequest } = require('fastify');
// const { WebSocket } = require('ws');
// const { Tournaments } = require('./api/tournament-controllers');
// const { Rooms } = require('./api/game-controllers');
//
// type RoomType = typeof Room;
// type TournamentType = typeof Tournament;
// type FastifyRequestType = typeof FastifyRequest;
// type FastifyReplyType = typeof FastifyReply;

export interface   player {
	username: string;
	socket: WebSocket;
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
	data?: any;
	message?: string;
	player?: string | null;
	tourPlacement?: number | null;
	tourId?: number | null;
	roomId?: number | null;
}

export interface	RoomInfo {
	id:		number;
	full:	boolean;
	isSolo:	boolean;
	privRoom:	boolean;
}

export interface	TournamentInfo {
	id:			number;
	name:		string;
	started:	boolean;
	username?:	string;
	roomId?:     number;
}

export function* idGenerator() {
	let i = 0;
	while (1)
		yield i++;
	return i;
}

export function quitTournament(request: FastifyRequest<{ Body: requestBody }>) {

	console.log("Player : " + request.body.tourPlacement + " is quitting tournament : " + request.body.tourId);

	const tour = getTournamentById(request.body.tourId);
	if (!tour)
		return console.log("Tournament not found");

	tour.removePlayer(request.body.tourPlacement)
}

export function quitPong(request: FastifyRequest<{ Body: requestBody }>) {
	console.log("Player : " + request.body.P + " is quitting room : " + request.body.roomId);

	const room = getRoomById(request.body.roomId);
	if (!room)
		return console.log("Room not found");

	const player: string | "P1" | "P2" = request.body.P;
	const playerSocket: player | null = player === "P1" ? room.getP1() : room.getP2();
	const opponentSocket: player | null = player === "P1" ? room.getP2() : room.getP1();

	if (!playerSocket)
		return console.log("Player not found");
	if (player === "SPEC")
		return room.removeSpectator(request.body.specPlacement);
	if (room.hasStarted() && !room.isOver())
		room.getGame()?.forfeit(player);
	playerSocket?.socket.send(JSON.stringify({ type: "INFO", message: "You have left the room" }));
	opponentSocket?.socket.send(JSON.stringify({ type: "WARNING", message: "Your opponent has left the room" }));
	if (!room.hasStarted() && !room.getIsInTournament())
		opponentSocket?.socket.send(JSON.stringify({ type: "LEAVE", data: "PONG", message: request.body.message === "QUEUE_TIMEOUT" ? "QUEUE_AGAIN" : "LEAVE" }));
	if (room.getIsInTournament())
		return ;
	console.log("Room : " + room.getId() + " has been deleted");
	Rooms.splice(Rooms.indexOf(room), 1);
}

export const    getRoomByInviteCode = (inviteCode: string): Room | undefined => {
	const room = Rooms.find((room: Room) => { return room.getInviteCode() === inviteCode; });
	if (!room)
		return undefined;
	return room;
}

export function getRoomById(id: number): Room | undefined {

	if (Rooms.find((room: Room) => { return room.getId() === id; }))
		return Rooms.find((room: Room) => { return room.getId() === id; }); // Find the room in the list of rooms

	// Find the room in the list of rooms in the tournaments
	for(const tour of Tournaments) {
		if (tour.getRoomById(id) !== undefined)
			return tour.getRoomById(id);
	}
	// console.log("Room with id " + id + " not found");
}

export function getTournamentById(id: number): Tournament | undefined {
	return Tournaments.find((tour: Tournament) => { return tour.getId() === id; });
}

export function isPlayerInTournament(socket: WebSocket): boolean {
	return Tournaments.find((tour: Tournament) => { return tour.getPlayers().find((player: player) => { return player.socket === socket }) }) !== undefined;
}

export const delay = async (ms: number) => {
	return new Promise(res => setTimeout(res, ms));
}