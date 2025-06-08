import { FastifyRequest, FastifyReply } from "fastify";
import { WebSocket } from "ws";
import { deleteTetrisGame, getTetrisGame, getTetrisRoom, tetrisReq } from "../utils";
import { TetrisGame } from "../server/Game/TetrisGame";
import { MultiplayerRoom } from "../server/MultiplayerRoom";

export let   arcadeGamesLst: TetrisGame[] = [];
export let   multiplayerRoomLst: MultiplayerRoom[] = [];

export const    tetrisMatchmaking = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string}}>) => {
	if (!req.query.username)
		return console.log("No username");

	for (const room of multiplayerRoomLst) {
		if (room.getIsInGame() || room.isPrivate() || !room.getIsVersus() || room.getPlayers().length >= 2)
			continue ;
		console.log("Joining existing room with code: " + room.getCode());
		room.addPlayer(socket, req.query.username);
		return ;
	}

	console.log("No room found, creating a new room");

	const room = new MultiplayerRoom(socket, req.query.username, false);
	room.addSettings( {"isVersus": true, "isPrivate": false} );
	multiplayerRoomLst.push(room);
}

export const tetrisArcade = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string}}>) => {
	const tetrisGame = new TetrisGame(socket, req.query.username);
	arcadeGamesLst.push(tetrisGame);
	tetrisGame.gameLoop();
};

export const    tetrisCreateRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string, code?: string | undefined}}>) => {
	const request = req.query;
	if (!request)
		return;

	const room = new MultiplayerRoom(socket, request.username, false, request.code);
	multiplayerRoomLst.push(room);
}

export const	getMultiplayerRooms = async (request: FastifyRequest, reply: FastifyReply) => {
	let rooms: {roomCode: string, nbPlayers: number}[] = [];

	for (const room of multiplayerRoomLst) {
		if (room.isPrivate())
			continue ;
		rooms.push({roomCode: room.getCode(), nbPlayers: room.getPlayers().length});
	}
	return reply.send(rooms);
}

export const    tetrisJoinRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string, code: string}}>) => {
	const request = req.query;
	if (!request)
		return ;
	const room = getTetrisRoom(request.code);
	if (!room)
		return tetrisCreateRoom(socket, req);

	room.addPlayer(socket, request.username);
}

export const    tetrisRoomCommand = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const request: tetrisReq = req.body;
	if (!request)
		return reply.status(400).send({message: "No body"});

	const room = getTetrisRoom(request.roomCode);
	if (!room)
		return reply.status(400).send({message: "Room not found"});

	switch (request.argument) {
		case "start":
			room.startGames();
			break ;
		case "settings":
			room.setSettings(request.prefix);
			break ;
	}
	reply.status(200).send({message: "Command received"});
}

export const    tetrisQuitRoom = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	try {
		const   request: tetrisReq = req.body;
		if (!request)
			return reply.status(400).send({message: "No body"});
		if (!request.username)
			return reply.status(400).send({message: "No username"});

		deleteTetrisGame(request.gameId);
		const room = getTetrisRoom(request.roomCode);
		if (room) {
			console.log("Tetris QuitRoom with code : " + request?.roomCode + " for " + request?.username);
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

	reply.status(200).send({message: "Forfeiting the game"});

	if (!request)
		return reply.status(400).send({message: "No body"});

	let   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({message: "Game not found"});

	game.retry();
	reply.status(200).send({message: "Retrying the game"});
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
	reply.status(200).send({message: "Forfeiting the game"});
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

	try {
		switch (request.argument) {
			case "clockwise":
			case "counter-clockwise":
			case "180":
				reply.status(200).send({message: "Rotating piece " + request.argument});
				return game?.rotate(request.argument);
			default:
				return reply.status(400).send({message: "Invalid argument"});
		}
	}
	catch (error) {
		console.error("Error in rotatePiece:", error);
		return reply.status(500).send({message: "Error in rotatePiece"});
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
			return ;
		default:
			return reply.status(400).send({message: "Invalid argument"});
	}
}

export const    holdPiece = async (req: FastifyRequest<{Body: tetrisReq}>, reply: FastifyReply) => {
	const   request = req.body;
	if (!request)
		return reply.status(400).send({message: "No body"});

	const   game = getTetrisGame(request.gameId);
	if (!game)
		return reply.status(400).send({message: "Game not found"});

	game.swap();
	reply.status(200).send({message: "Holding the piece"});
}
