import { FastifyRequest, FastifyReply } from "fastify";
import { WebSocket } from "ws";
import {deleteTetrisGame, getTetrisGame, tetrisReq} from "../utils";
import { TetrisGame } from "../server/Game/TetrisGame";
import { MultiplayerRoom } from "../server/MultiplayerRoom";
import { userSockets } from "../../server/server";
import {TournamentInfo} from "../../pong_app/utils";
import {Tournaments} from "../../pong_app/api/tournament-controllers";


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

export const    tetrisCreateRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string, code?: string | undefined}}>) => {
	const request = req.query;
	if (!request)
		return;

	console.log("Creating a new room");
	// if (request.code)
	// 	console.log("code: " + request.code);
	const room = new MultiplayerRoom(socket, false, request.code);

	userSockets[request.username] = socket;
	multiplayerRoomLst.push(room);
}

export const	getMultiplayerRooms = async (request: FastifyRequest, reply: FastifyReply) => {
	let rooms: {roomCode: string}[] = [];

	for (const room of multiplayerRoomLst) {
		if (room.isPrivate())
			continue ;
		rooms.push({roomCode: room.getCode()});
	}
	// console.log("Sending Rooms for room list: ", rooms);
	return reply.send(rooms);
}

export const    tetrisJoinRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string, code: string}}>) => {
	// console.log("Joining a room");
	const request = req.query;
	if (!request)
		return ;
	const room = multiplayerRoomLst.find((room) => room.getCode() === request.code);
	// console.log("Room found: " + JSON.stringify(room));
	if (!room)
		return tetrisCreateRoom(socket, req);

	// console.log("Room found");
	userSockets[request.username] = socket;
	room.addPlayer(socket);
}

export const    tetrisRoomCommand = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
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

export const    tetrisQuitRoom = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request: tetrisReq = req.body;

	if (!request || !request.username)
		return reply.status(400).send({error: "No body"});

	deleteTetrisGame(request.gameId);
	const   room = multiplayerRoomLst.find((room) => room.getCode() === request.roomCode);
	if (room) {
		console.log("Tetris QuitRoom with code : " + request?.roomCode);
		room.removePlayer(userSockets[request.username]);
		if (room.isEmpty())
			multiplayerRoomLst.splice(multiplayerRoomLst.indexOf(room), 1);
	}
	if (userSockets[request.username])
		delete userSockets[request.username];
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
