import	{ FastifyInstance, FastifyRequest } from "fastify";
import	{ joinMatchmaking, joinSolo, quitRoom, movePaddle, startConfirm, getRooms, getRoomInfo } from "./game-controllers";
import	{ startTournament, createTournament, joinTournament, shuffleTree, getTournaments, getTournamentInfo } from "./tournament-controllers";
import	{ addSpectatorToRoom } from "./spectator-controllers";
import {requestBody} from "../utils";

// const	{ FastifyRequest, FastifyReply } = require('fastify');
// const	FastifyInstance = require('fastify');
// const	{ joinMatchmaking, joinSolo, quitRoom, movePaddle, startConfirm, getRooms, getRoomInfo } = require('./game-controllers');
// const	{ startTournament, createTournament, joinTournament, shuffleTree, getTournaments, getTournamentInfo } = require('./tournament-controllers');
// const	{ addSpectatorToRoom } = require('./spectator-controllers');
//
// type	FastifyInstanceType = typeof FastifyInstance;
// type	FastifyRequestType = typeof FastifyRequest;


export default async function pongRoutes(fastify: FastifyInstance) {

	fastify.get('/joinMatchmaking', {websocket: true}, joinMatchmaking);
	fastify.get('/joinSolo', {websocket: true}, joinSolo);
	fastify.get('/createTournament', {websocket: true}, createTournament);
	fastify.get('/joinTournament', {websocket: true}, joinTournament);
	fastify.get('/addSpectatorToRoom', {websocket: true}, addSpectatorToRoom);
	fastify.post('/shuffleTree', shuffleTree);
	fastify.post('/quitRoom', quitRoom);
	fastify.post('/startConfirm', startConfirm);
	fastify.post('/startTournament', startTournament);
	fastify.post('/movePaddle', movePaddle);
	fastify.get("/get_tournaments", getTournaments);
	fastify.get("/get_tournament_info", getTournamentInfo);
	fastify.get("/get_rooms", getRooms);
	fastify.get("/get_room_info", getRoomInfo);
}
