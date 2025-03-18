import { FastifyInstance, FastifyRequest } from "fastify";
import { joinMatchmaking, joinSolo, quitRoom, startGame, movePaddle, startConfirm, createTournament,
		joinTournament, shuffleTree } from "./controllers";

export default async function pongRoutes(fastify: FastifyInstance) {

	fastify.get('/joinMatchmaking', {websocket: true}, joinMatchmaking);
	fastify.get('/joinSolo', {websocket: true}, joinSolo);
	fastify.get('/createTournament', {websocket: true}, createTournament);
	fastify.get('/joinTournament', {websocket: true}, joinTournament);
	fastify.post('/shuffleTree', shuffleTree);
	fastify.post('/quitRoom', quitRoom);
	fastify.post('/startConfirm', startConfirm);
	fastify.post('/startGame', startGame);
	fastify.post('/movePaddle', movePaddle);
}

