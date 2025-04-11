import {FastifyInstance} from "fastify";
import {
	dropPiece,
	forfeitGame, holdPiece,
	tetrisMatchmaking,
	tetrisJoinPrivateRoom, tetrisArcade,
	movePiece,
	rotatePiece, startGame, tetrisCreatePrivateRoom
} from "./controllers";

export default async function tetrisRoutes(fastify: FastifyInstance) {
	fastify.get('/tetrisMatchmaking', {websocket: true}, tetrisMatchmaking); // TODO: Join a Random Room
	fastify.get('/tetrisArcade', {websocket: true}, tetrisArcade); //TODO: Join a Solo Game
	fastify.get('/tetrisCreatePrivRoom', {websocket: true}, tetrisCreatePrivateRoom); //TODO: Create a Private Room
	fastify.get('/tetrisJoinPrivRoom', {websocket: true}, tetrisJoinPrivateRoom); //TODO: Join a Private Room
	fastify.post('/tetrisStart', startGame); //TODO: Start the game
	fastify.post('/forfeit', forfeitGame); //TODO: Forfeit a Game
	fastify.post('/movePiece', movePiece); //TODO: Move tetriminos left or right
	fastify.post('/rotatePiece', rotatePiece); // TODO: Rotate tetriminos clockwise or counter-clockwise
	fastify.post('/dropPiece', dropPiece); // TODO: Soft or Hard drop tetriminos
	fastify.post('/holdPiece', holdPiece); // TODO: Hold tetriminos
}
