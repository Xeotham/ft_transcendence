import { FastifyInstance, FastifyRequest } from "fastify";
import { joinRoom, quitRoom, startGame, movePaddle, finishGame, startConfirm } from "./controllers";

export default async function pongRoutes(fastify: FastifyInstance) {

	fastify.get('/joinRoom', {websocket: true}, joinRoom);
	fastify.get('/quitRoom', {websocket: true}, quitRoom);
	fastify.get('/startConfirm', {websocket: true}, startConfirm);
	fastify.post('/startGame', startGame);
	fastify.post('/movePaddle', movePaddle);
	fastify.post('/finishGame', finishGame);
}

