import Fastify, { FastifyRequest } from 'fastify';
import { WebSocket } from "ws";
import {getRoomById, RoomInfo} from "../utils";

export const    addSpectatorToRoom = async (socket: WebSocket, req: FastifyRequest< { Querystring: RoomInfo } >) => {
	const	room = getRoomById(Number(req.query.id));
	if (!room || room.getIsSolo()) {
		socket.send(JSON.stringify({type: "INFO", message: "You cannot spectate this room"}));
		socket.send(JSON.stringify({type: "LEAVE", data: "PONG"}));
	}
	room?.addSpectator(socket);
}
