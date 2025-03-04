import { FastifyInstance, FastifyRequest } from "fastify";
import { joinRoom, quitRoom, startGame, movePaddle, finishGame } from "./controllers";

export default async function pongRoutes(fastify: FastifyInstance) {

	fastify.get('/joinRoom', {websocket: true}, joinRoom);
	fastify.get('/quitRoom', {websocket: true}, quitRoom);
	fastify.get('/startGame', {websocket: true}, startGame);
	fastify.post('/movePaddle', movePaddle);
	fastify.post('/finishGame', finishGame);
}

