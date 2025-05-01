import { FastifyRequest, FastifyReply } from "fastify";
import { WebSocket } from "ws";
import {getTetrisGame, tetrisReq} from "../utils";
import { TetrisGame } from "../server/Game/TetrisGame";
import { MultiplayerRoom } from "../server/MultiplayerRoom";
import { userSockets } from "../../server/server";


// fastify.get('/joinMatchmaking', {websocket: true}, joinMatchmaking); TODO: Join a Random Room
// fastify.get('/createPrivateRoom', {websocket: true}, createPrivateRoom); //TODO: Create a Private Room
// fastify.get('/joinPrivRoom', {websocket: true}, joinPrivateRoom); //TODO: Join a Private Room

export let   arcadeGamesLst: TetrisGame[] = [];
export let   multiplayerRoomLst: MultiplayerRoom[] = [];

export const    tetrisMatchmaking = async (socket: WebSocket, req: FastifyRequest) => {
}

export const tetrisArcade = async (socket: WebSocket, req: FastifyRequest) => {
	try {
		console.log("New Tetris Arcade connection");
		const tetrisGame = new TetrisGame(socket);
		arcadeGamesLst.push(tetrisGame);

		// console.log(tetrisGame.toJSON());
		socket.send(JSON.stringify({ type: "SOLO", game: tetrisGame.toJSON() }));
		tetrisGame.gameLoop();
	}
	catch (error) {
		console.error("Error in tetrisArcade handler:", error);
	}
};

export const    tetrisCreateRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string}}>) => {
	console.log("Creating a new room");
	const room = new MultiplayerRoom([socket], req!.query!.username, false);

	multiplayerRoomLst.push(room);
	socket.send(JSON.stringify({ type: "MULTIPLAYER_JOIN", argument: "OWNER" }));
}

export const    tetrisJoinRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: {code: string}}>) => {
	console.log("Joining a room");
	const room = multiplayerRoomLst.find((room) => room.getCode() === req.query?.code);
	if (!room)
		return ;

	console.log("Room found");
	room.addPlayer(socket);
}

export const    tetrisRoomCommand = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	try {
		console.log("Tetris Room Command");
		const request = req.body;
		if (!request)
			return reply.status(400).send({error: "No body"});

		const room = multiplayerRoomLst.find((room) => room.getCode() === request.roomCode);
		if (!room)
			return reply.status(400).send({error: "Room not found"});

		switch (request.argument) {
			case "start":
				room.startGames();
				return;
			case "settings":
				console.log("Settings: ", JSON.stringify(request.prefix));
				room.setSettings(request.prefix);
				return;
		}
	}
	catch (error) {
		console.error("Error in tetrisRoomCommand handler:", error);
		return reply.status(500).send({error: "Internal server error"});
	}
}

export const    tetrisQuitRoom = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request: tetrisReq = req.body;

	if (!request || !request.username)
		return reply.status(400).send({error: "No body"});

	const   room = multiplayerRoomLst.find((room) => room.getCode() === request.roomCode);
	if (!room)
		return reply.status(400).send({error: "Room not found"});

	room.removePlayer(userSockets[request.username]);
	if (room.isEmpty())
		multiplayerRoomLst.splice(multiplayerRoomLst.indexOf(room), 1);
}

export const    forfeitGame = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;

	reply.status(200).send({message: "Forfeiting the game"});

	if (!request)
		return reply.status(400).send({error: "No body"});

	const   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({error: "Game not found"});

	game.forfeit();
}

export const    movePiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;

	if (!request)
		return reply.status(400).send({error: "No body"});

	const   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({error: "Game not found"});

	switch (request.argument) {
		case "left":
		case "right":
			game.move(request.argument);
			reply.status(200).send({message: "Moving Piece " + request.argument})
			// return console.log("Moving " + request.argument);
			return ;
		default:
			return reply.status(400).send({error: "Invalid argument"});
	}
}

export const    rotatePiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;

	if (!request)
		return reply.status(400).send({error: "No body"});

	const   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({error: "Game not found"});

	switch (request.argument) {
		case "clockwise":
		case "counter-clockwise":
		case "180":
			// console.log("Rotating piece " + request.argument);
			reply.status(200).send({message: "Rotating piece " + request.argument});
			return game?.rotate(request.argument);
		default:
			return reply.status(400).send({error: "Invalid argument"});
	}
}

export const    dropPiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;
	if (!request)
		return reply.status(400).send({error: "No body"});

	const   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({error: "Game not found"});

	switch (request.argument) {
		case "Hard":
		case "Soft":
		case "Normal":
			game.changeFallSpeed(request.argument);
			reply.status(200).send({message: request.argument + " Dropping the piece"});
			// return console.log(request.argument + " Dropping the piece");
			return ;
		default:
			return reply.status(400).send({error: "Invalid argument"});
	}
}

export const    holdPiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	// reply.status(200).send({message: "Holding the piece"});
	const   request = req.body;
	if (!request)
		return reply.status(400).send({error: "No body"});

	const   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({error: "Game not found"});

	game.swap();
}
