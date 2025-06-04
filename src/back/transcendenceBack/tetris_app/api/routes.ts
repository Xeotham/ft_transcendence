import { FastifyInstance } from "fastify";
import {
	dropPiece,
	forfeitGame, holdPiece,
	tetrisMatchmaking, tetrisCreateRoom,
	tetrisJoinRoom, tetrisRoomCommand,
	tetrisQuitRoom, tetrisArcade,
	movePiece, rotatePiece, getMultiplayerRooms, retryGame,
} from "./controllers";

export default async function tetrisRoutes(fastify: FastifyInstance) {
	fastify.get('/matchmaking', {websocket: true}, tetrisMatchmaking);
	fastify.get('/arcade', {websocket: true}, tetrisArcade);
	fastify.get('/createRoom', {websocket: true}, tetrisCreateRoom);
	fastify.get('/getMultiplayerRooms', getMultiplayerRooms);
	fastify.get('/joinRoom', {websocket: true}, tetrisJoinRoom);
	fastify.post('/roomCommand', tetrisRoomCommand);
	fastify.post('/quitRoom', tetrisQuitRoom);
	fastify.post('/retry', retryGame);
	fastify.post('/forfeit', forfeitGame);
	fastify.post('/movePiece', movePiece);
	fastify.post('/rotatePiece', rotatePiece);
	fastify.post('/dropPiece', dropPiece);
	fastify.post('/holdPiece', holdPiece);
}
