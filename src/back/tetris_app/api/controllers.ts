import { FastifyRequest, FastifyReply } from "fastify";
import { WebSocket } from "ws";
import {tetrisReq} from "../utils";
import {TetrisGame} from "../server/TetrisGame";


// fastify.get('/joinMatchmaking', {websocket: true}, joinMatchmaking); TODO: Join a Random Room
// fastify.get('/joinSolo', {websocket: true}, joinSolo); TODO: Join a Solo Game
// fastify.get('/createPrivateRoom', {websocket: true}, createPrivateRoom); //TODO: Create a Private Room
// fastify.get('/joinPrivRoom', {websocket: true}, joinPrivateRoom); //TODO: Join a Private Room
// fastify.post('/forfeit', quitRoom); //TODO: Forfeit a Game
// TODO: Start the game
// TODO: Move tetriminos left or right
// TODO: Rotate tetriminos clockwise or counter-clockwise
// TODO: Soft or Hard drop tetriminos
// TODO: Hold tetriminos

let   tetrisGamesLst: TetrisGame[] = [];

export const    tetrisMatchmaking = async (socket: WebSocket, req: FastifyRequest) => {
}

export const tetrisArcade = async (socket: WebSocket, req: FastifyRequest) => {
	try {
		console.log("New Tetris Arcade connection");
		const tetrisGame = new TetrisGame(socket);
		tetrisGamesLst.push(tetrisGame);

		// console.log(tetrisGame.toJSON());
		socket.send(JSON.stringify({ type: "SOLO", game: tetrisGame.toJSON() }));
		tetrisGame.gameLoop();
	} catch (error) {
		console.error("Error in tetrisArcade handler:", error);
	}
};

export const    tetrisCreatePrivateRoom = async (socket: WebSocket, req: FastifyRequest) => {
}

export const    tetrisJoinPrivateRoom = async (socket: WebSocket, req: FastifyRequest) => {
}

export const    forfeitGame = async (req: FastifyRequest, reply: FastifyReply) => {
	reply.status(200).send({message: "Forfeiting the game"});
}

export const    startGame = async (req: FastifyRequest, reply: FastifyReply) => {
}

export const    movePiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;

	if (!request) {
		return reply.status(400).send({error: "No body"});
	}

	const   room = tetrisGamesLst.find((game) => game.getRoomId() === req.body.roomId);
	if (!room) {
		return reply.status(400).send({error: "Room not found"});
	}

	switch (request.argument) {
		case "left":
		case "right":
			room.move(request.argument);
			reply.status(200).send({message: "Moving Piece " + request.argument})
			// return console.log("Moving " + request.argument);
			return ;
		default:
			return reply.status(400).send({error: "Invalid argument"});
	}
}

export const    rotatePiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;

	if (!request) {
		return reply.status(400).send({error: "No body"});
	}

	const   room = tetrisGamesLst.find((game) => game.getRoomId() === request.roomId);
	if (!room) {
		return reply.status(400).send({error: "Room not found"});
	}

	// console.log("Rotate for Room ID: " + request.roomId + " - Found: " + room);
	console.log(request);

	switch (request.argument) {
		case "clockwise":
		case "counter-clockwise":
		case "180":
			// console.log("Rotating piece " + request.argument);
			reply.status(200).send({message: "Rotating piece " + request.argument});
			return room?.rotate(request.argument);
		default:
			return reply.status(400).send({error: "Invalid argument"});
	}
}

export const    dropPiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;
	if (!request) {
		return reply.status(400).send({error: "No body"});
	}

	const   room = tetrisGamesLst.find((game) => game.getRoomId() === req.body.roomId);
	if (!room) {
		return reply.status(400).send({error: "Room not found"});
	}

	switch (request.argument) {
		case "hard":
		case "soft":
		case "normal":
			room.changeFallSpeed(request.argument);
			reply.status(200).send({message: request.argument + " Dropping the piece"});
			return console.log(request.argument + " Dropping the piece");
		default:
			return reply.status(400).send({error: "Invalid argument"});
	}
}

export const    holdPiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	reply.status(200).send({message: "Holding the piece"});

	const   room = tetrisGamesLst.find((game) => game.getRoomId() === req.body.roomId);

	if (!room) {
		return reply.status(400).send({error: "Room not found"});
	}

	room.swap();
}
