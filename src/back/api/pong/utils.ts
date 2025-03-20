import { Room } from "../../pong_app/server/Room";
import { Tournament } from "../../pong_app/server/tournament";
import { FastifyReply, FastifyRequest } from "fastify";
import { WebSocket } from "ws";
import { Tournaments } from "./tournament-controllers";
import { Rooms } from "./game-controllers";

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

export interface	RoomInfo {
	id:		number;
	full:	boolean;
	isSolo:	boolean;
}

export interface	TournamentInfo {
	id:			number;
	started:	boolean;
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

	// TODO : Look at that when game already started
	if (tour.removePlayer(request.body.tourPlacement)) {
		console.log("Tournament : " + tour.getId() + " has been deleted");
		Tournaments.splice(Tournaments.indexOf(this), 1);
	}
}

export function quitPong(request: FastifyRequest<{ Body: requestBody }>) {

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


export function getRoomById(id: number): Room | undefined {

	if (Rooms.find((room) => { return room.getId() === id; }))
		return Rooms.find((room) => { return room.getId() === id; }); // Find the room in the list of rooms

	// Find the room in the list of rooms in the tournaments
	Tournaments.forEach((tour) => {
		if (tour.getRoomById(id) !== null)
			return tour.getRoomById(id);
	});
}


export function getTournamentById(id: number): Tournament | undefined {
	return Tournaments.find((tour) => { return tour.getId() === id; });
}

export function isPlayerInTournament(socket: WebSocket): boolean {
	return Tournaments.find((tour) => { return tour.getPlayers().find((player) => { return player === socket }) }) !== undefined;
}
