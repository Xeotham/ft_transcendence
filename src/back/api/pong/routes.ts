import { FastifyInstance, FastifyRequest } from "fastify";
import { joinMatchmaking, joinSolo, quitRoom, startGame, movePaddle, finishGame, startConfirm } from "./controllers";

export default async function pongRoutes(fastify: FastifyInstance) {

	fastify.get('/joinMatchmaking', {websocket: true}, joinMatchmaking);
	fastify.get('/joinSolo', {websocket: true}, joinSolo);
	fastify.post('/quitRoom', quitRoom);
	fastify.post('/startConfirm', startConfirm);
	fastify.post('/startGame', startGame);
	fastify.post('/movePaddle', movePaddle);
	fastify.post('/finishGame', finishGame);
}

