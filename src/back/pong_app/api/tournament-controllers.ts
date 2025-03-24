import { Tournament } from "../server/tournament";
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from "ws";
import { isPlayerInRoom } from "./game-controllers";
import { idGenerator, TournamentInfo, requestBody, getTournamentById, isPlayerInTournament } from "../utils";

export const Tournaments: Tournament[] = [];

const idGenTour = idGenerator();

export const createTournament = async (socket: WebSocket, req: FastifyRequest<{ Querystring: { name: string } }>) => {

	const	tournamentName = req.query.name;
	// console.log("is Player in tournament : " + isPlayerInTournament(socket) + " is Player in room : " + isPlayerInRoom(socket));

	console.log(tournamentName);

	if (isPlayerInTournament(socket) || isPlayerInRoom(socket))
		return socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }));

	console.log("New Player creating tournament");
	const newTour = new Tournament(idGenTour.next().value, socket);
	Tournaments.push(newTour);

	socket.send(JSON.stringify({ type: "INFO", message: "Tournament created, awaiting players" }));
	socket.send(JSON.stringify({ type: "TOURNAMENT", message: "PREP", tourId: newTour.getId(), tourPlacement: 0 }));
}

export const joinTournament = async (socket: WebSocket, req: FastifyRequest<{ Querystring: { id: number | null } }>) => {
	const	id: number = req.query.id === null ? -1 : Number(req.query.id);
	let 	tournament: Tournament | null = null;

	// Check if player is already in a room
	if (isPlayerInRoom(socket) || isPlayerInTournament(socket))
		return socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }));

	console.log("New Player looking to join tournament");
	if (id === -1) {
		for (const tour of Tournaments) {
			if (tour.hasStarted())
				continue;
			tournament = tour;
		}
	}
	else if (Tournaments.find((tour) => { return tour.getId() === id; }) !== undefined)
		tournament = Tournaments.find((tour) => { return tour.getId() === id; }) as Tournament;
	else
		return socket.send(JSON.stringify({ type: "INFO", message: "Tournament not found" }));
	console.log(tournament);
	if (!tournament?.hasStarted()) {
		tournament?.addPlayer(socket);
		return;
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

export const startTournament = async (request: FastifyRequest<{ Body: requestBody }>, reply: FastifyReply) => {
	console.log("Starting game");
	const tour = getTournamentById(request.body.tourId);

	if (!tour)
		return console.log("Tournament not found");
	tour.startTournament();
};


export const	getTournaments = async (request: FastifyRequest, reply: FastifyReply) => {
	const TournamentLst: TournamentInfo[] = [];
	Tournaments.forEach((tournament) => {TournamentLst.push({ id: tournament.getId(), started: tournament.hasStarted() });})
	return reply.send(TournamentLst);
}

export const	getTournamentInfo = async (request: FastifyRequest<{ Querystring: { id: number } }>, reply: FastifyReply) => {
	const	id = Number(request.query.id);
	if (Tournaments.find((tournament) => { return tournament.getId() === id}) === undefined)
		return reply.send(JSON.stringify({type: "ERROR", message: "Tournament not found"}));
	const Tournament: Tournament = Tournaments.find((tournament) => { return tournament.getId() === id}) as Tournament;

	if (!Tournament)
		return reply.send(JSON.stringify({type: "ERROR", message: "Tournament not found"}));
	const TournamentInfo: TournamentInfo = { id: Tournament.getId(), started: Tournament.hasStarted() };
	return reply.send(TournamentInfo);
}
