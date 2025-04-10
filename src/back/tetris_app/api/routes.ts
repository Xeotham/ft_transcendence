import {FastifyInstance} from "fastify";
import {
	createPrivateRoom,
	dropPiece,
	forfeitGame, holdPiece,
	joinMatchmaking,
	joinPrivateRoom, joinSolo,
	movePiece,
	rotatePiece, startGame
} from "./controllers";

export default async function tetrisRoutes(fastify: FastifyInstance) {
	fastify.get('/joinMatchmaking', {websocket: true}, joinMatchmaking); // TODO: Join a Random Room
	fastify.get('/joinSolo', {websocket: true}, joinSolo); //TODO: Join a Solo Game
	fastify.get('/createPrivateRoom', {websocket: true}, createPrivateRoom); //TODO: Create a Private Room
	fastify.get('/joinPrivRoom', {websocket: true}, joinPrivateRoom); //TODO: Join a Private Room
	fastify.post('/startGame', startGame); //TODO: Start the game
	fastify.post('/forfeit', forfeitGame); //TODO: Forfeit a Game
	fastify.post('/movePiece', movePiece); //TODO: Move tetriminos left or right
	fastify.post('/rotatePiece', rotatePiece); // TODO: Rotate tetriminos clockwise or counter-clockwise
	fastify.post('/dropPiece', dropPiece); // TODO: Soft or Hard drop tetriminos
	fastify.post('/holdPiece', holdPiece); // TODO: Hold tetriminos
}
