import { FastifyInstance, FastifyRequest } from "fastify";
import {
	joinMatchmaking, joinSolo, quitRoom, startTournament, movePaddle, startConfirm, createTournament,
	joinTournament, shuffleTree, addSpectatorToRoom
} from "./controllers";

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
}

