import { FastifyRequest, FastifyReply } from "fastify";
import { WebSocket } from "ws";
import {deleteTetrisGame, getTetrisGame, getTetrisRoom, tetrisReq} from "../utils";
import { TetrisGame } from "../server/Game/TetrisGame";
import { MultiplayerRoom } from "../server/MultiplayerRoom";
import { delay } from "../server/Game/utils";


// fastify.get('/joinMatchmaking', {websocket: true}, joinMatchmaking); TODO: Join a Random Room

export let   arcadeGamesLst: TetrisGame[] = [];
export let   multiplayerRoomLst: MultiplayerRoom[] = [];

export const tetrisMatchmaking = async (socket: WebSocket, req: FastifyRequest) => {
}

export const tetrisArcade = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string}}>) => {
	try {
		const tetrisGame = new TetrisGame(socket, req.query.username);
		arcadeGamesLst.push(tetrisGame);

		tetrisGame.gameLoop();
	}
	catch (error) {
		console.error("Error in tetrisArcade handler:", error);
	}
};

export const    tetrisCreateRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string, code?: string | undefined}}>) => {
	const request = req.query;
	if (!request)
		return;

	console.log("Creating a new room");
	const room = new MultiplayerRoom(socket, request.username, false, request.code);
	multiplayerRoomLst.push(room);
}

export const	getMultiplayerRooms = async (request: FastifyRequest, reply: FastifyReply) => {
	let rooms: {roomCode: string}[] = [];

	for (const room of multiplayerRoomLst) {
		if (room.isPrivate())
			continue ;
		rooms.push({roomCode: room.getCode()});
	}
	return reply.send(rooms);
}

export const    tetrisJoinRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string, code: string}}>) => {
	// console.log("Joining a room");
	const request = req.query;
	if (!request)
		return ;
	const room = getTetrisRoom(request.code);
	// console.log("Room found: " + JSON.stringify(room));
	if (!room)
		return tetrisCreateRoom(socket, req);

	// console.log("Room found");
	// userSockets[request.username] = socket;
	room.addPlayer(socket, request.username);
}

export const    tetrisRoomCommand = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	console.log("Tetris Room Command");
	const request: tetrisReq = req.body;
	if (!request)
		return reply.status(400).send({message: "No body"});

	const room = getTetrisRoom(request.roomCode);
	if (!room)
		return reply.status(400).send({message: "Room not found"});

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

export const    tetrisQuitRoom = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	try {
		const   request: tetrisReq = req.body;
		console.log("Request: " + request + ", username: " + request?.username);
		if (!request)
			return reply.status(400).send({message: "No body"});
		if (!request.username)
			return reply.status(400).send({message: "No username"});

		deleteTetrisGame(request.gameId);
		const room = getTetrisRoom(request.roomCode);
		if (room) {
			console.log("Tetris QuitRoom with code : " + request?.roomCode);
			room.removePlayer(request.username);
			if (room.isEmpty())
				multiplayerRoomLst.splice(multiplayerRoomLst.indexOf(room), 1);
		}
		reply.status(200).send({message: "Quitting the room"});
	}
	catch (error) {
		console.error("Error in tetrisQuitRoom:", error);
		return reply.status(500).send({message: "Error in tetrisQuitRoom"});
	}
}

export const    retryGame = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;
	// console.log("Retrying the game");

	reply.status(200).send({message: "Forfeiting the game"});

	if (!request)
		return reply.status(400).send({message: "No body"});

	let   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({message: "Game not found"});
	// console.log("Game found: " + game.getGameId());

	game.retry();
}

export const    forfeitGame = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;

	reply.status(200).send({message: "Forfeiting the game"});

	if (!request)
		return reply.status(400).send({message: "No body"});

	const   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({message: "Game not found"});

	game.forfeit();
}

export const    movePiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;

	if (!request)
		return reply.status(400).send({message: "No body"});

	const   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({message: "Game not found"});

	switch (request.argument) {
		case "left":
		case "right":
			game.move(request.argument);
			reply.status(200).send({message: "Moving Piece " + request.argument})
			// return console.log("Moving " + request.argument);
			return ;
		default:
			return reply.status(400).send({message: "Invalid argument"});
	}
}

export const    rotatePiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;

	if (!request)
		return reply.status(400).send({message: "No body"});

	const   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({message: "Game not found"});

	switch (request.argument) {
		case "clockwise":
		case "counter-clockwise":
		case "180":
			// console.log("Rotating piece " + request.argument);
			reply.status(200).send({message: "Rotating piece " + request.argument});
			return game?.rotate(request.argument);
		default:
			return reply.status(400).send({message: "Invalid argument"});
	}
}

export const    dropPiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;
	if (!request)
		return reply.status(400).send({message: "No body"});

	const   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({message: "Game not found"});

	switch (request.argument) {
		case "Hard":
		case "Soft":
		case "Normal":
			game.changeFallSpeed(request.argument);
			reply.status(200).send({message: request.argument + " Dropping the piece"});
			// return console.log(request.argument + " Dropping the piece");
			return ;
		default:
			return reply.status(400).send({message: "Invalid argument"});
	}
}

export const    holdPiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	// reply.status(200).send({message:message"Holding the piece"});
	const   request = req.body;
	if (!request)
		return reply.status(400).send({message: "No body"});

	const   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({message: "Game not found"});
	// console.log("Holding the piece");

	game.swap();
	reply.status(200).send({message: "Holding the piece"});
}
