import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from "ws";
import { Room } from "../server/Room";
import {
	requestBody,
	RoomInfo,
	idGenerator,
	quitPong,
	quitTournament,
	getRoomById,
	isPlayerInTournament,
	getRoomByInviteCode
} from "../utils";

export const	Rooms: Room[] = [];

const idGenRoom = idGenerator();

export function isPlayerInRoom(socket: WebSocket): boolean {
	return Rooms.find((room) => { return room.getP1()?.socket === socket || room.getP2()?.socket === socket; }) !== undefined;
}

export const    createPrivateRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string}}>) => {
	const   username = req.query.username;

	if (isPlayerInRoom(socket) || isPlayerInTournament(socket)) {
		socket.send(JSON.stringify({type: "INFO", message: "You are already in a room"}));
		return socket.send(JSON.stringify({type: "LEAVE"}));
	}

	const newRoom = new Room(idGenRoom.next().value, false, false, -1, true);

	newRoom.addPlayer(socket, username);
	Rooms.push(newRoom);
	socket.send(JSON.stringify( { type: "GAME", message: "PRIVOWNER", inviteCode: newRoom.getInviteCode() }));
}

export const    joinPrivateRoom = async (socket: WebSocket, req: FastifyRequest<{Querystring: { inviteCode: string, username: string }}>) => {
	const   inviteCode = req.query.inviteCode;
	const   username = req.query.username;

	console.log("joinPrivateRoom : ", req.query);

	if (isPlayerInRoom(socket) || isPlayerInTournament(socket)) {
		socket.send(JSON.stringify({type: "INFO", message: "You are already in a room"}));
		return socket.send(JSON.stringify({type: "LEAVE"}));
	}
	const   room = getRoomByInviteCode(inviteCode);

	if (!room) {
		socket.send(JSON.stringify({type: "INFO", message: "Room not found"}));
		return socket.send(JSON.stringify({type: "LEAVE"}));
	}
	if (room.isFull()) {
		socket.send(JSON.stringify({type: "INFO", message: "Room is full"}));
		return socket.send(JSON.stringify({type: "LEAVE"}));
	}
	room.addPlayer(socket, username);
}

export const joinMatchmaking = async (socket: WebSocket, req: FastifyRequest<{ Querystring: { username: string } }>) => {

	const username = req.query.username;

	if (isPlayerInRoom(socket) || isPlayerInTournament(socket)) {
		socket.send(JSON.stringify({type: "INFO", message: "You are already in a room"}));
		return socket.send(JSON.stringify({type: "LEAVE"}));
	}

	console.log("New Player looking to join room");
	// Check existing rooms for an available spot
	for (const room of Rooms) {
		if (!room.isFull() && !room.getIsPrivate()) {
			room.addPlayer(socket, username);
			return ;
		}
	}

	// If no available room is found, create a new one
	const newRoom = new Room(idGenRoom.next().value);

	newRoom.addPlayer(socket, username);
	Rooms.push(newRoom);
	return ;
};

export const joinSolo = async (socket: WebSocket, req: FastifyRequest) => {
	if (isPlayerInRoom(socket) || isPlayerInTournament(socket)) {
		socket.send(JSON.stringify({type: "INFO", message: "You are already in a room"}));
		return socket.send(JSON.stringify({type: "LEAVE"}));
	}

	console.log("New Player creating solo room");
	const newRoom = new Room(idGenRoom.next().value, true);
	Rooms.push(newRoom);
	newRoom.soloSetup(socket);
	newRoom.startGame();
}

export const joinBot = async (socket: WebSocket, req: FastifyRequest<{Querystring: {username: string}}>) => {
	const   username = req.query.username;

	if (isPlayerInRoom(socket)) {
		socket.send(JSON.stringify({type: "INFO", message: "You are already in a room"}));
		return socket.send(JSON.stringify({type: "LEAVE"}));
	}

	console.log("New Player creating bot room");
	const newRoom = new Room(idGenRoom.next().value, true);
	Rooms.push(newRoom);
	newRoom.botSetup(socket, username);
	newRoom.startGame();
}

export const startConfirm = async (request: FastifyRequest<{ Body: requestBody }>, reply: FastifyReply) => {
	let room = getRoomById(request.body.roomId);
	const	player: string | "P1" | "P2" = request.body.P;

	if (!room)
		return;
	const	playerSocket: WebSocket = player === "P1" ? room.getP1()?.socket! : room.getP2()?.socket!;
	if (player === "P1")
		room.setP1Ready(true);
	else
		room.setP2Ready(true);
	playerSocket?.send(JSON.stringify({ type: "INFO", message: "You are ready, waiting for your opponent" }))

	if (!room.getP1Ready() || !room.getP2Ready())
		return ;
	room.startGame();
}

export const quitRoom = async (request: FastifyRequest<{ Body: requestBody }>, reply: FastifyReply) => {
	if (request.body.matchType === "PONG")
		quitPong(request);
	else if (request.body.matchType === "TOURNAMENT")
		quitTournament(request);
}

export const movePaddle = async (request: FastifyRequest<{ Body: requestBody }>, reply: FastifyReply) => {
	let room = getRoomById(request.body.roomId);

	if (!room || !room.getGame())
		return reply.send(JSON.stringify({type: "ERROR", message: "Room not found"}));
	room.getGame()?.movePaddle(request.body.P, request.body.key);
};

export const	getRooms = async (request: FastifyRequest, reply: FastifyReply) => {
	const	RoomsLst: RoomInfo[] = [];
	Rooms.forEach((room) => {RoomsLst.push({ id: room.getId(), full: room.isFull(), isSolo: room.getIsSolo(), privRoom: room.getIsPrivate() });});
	return reply.send(RoomsLst);
}

export const	getRoomInfo = async (request: FastifyRequest<{ Querystring: RoomInfo }>, reply: FastifyReply) => {
	const	id = Number(request.query.id);
	const Room: Room | undefined = Rooms.find((room) => { return room.getId() === id});
	if (!Room)
		return reply.send(JSON.stringify({type: "ERROR", message: "Room not found"}));
	const RoomInfo: RoomInfo = { id: Room.getId(), full: Room.isFull(), isSolo: Room.getIsSolo(), privRoom: Room.getIsPrivate() };
	return reply.send(RoomInfo);
}
