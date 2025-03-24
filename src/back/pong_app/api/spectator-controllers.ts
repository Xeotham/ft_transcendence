import { Tournament } from "../server/tournament";
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from "ws";
import { getRoomById } from "../utils";

export const    addSpectatorToRoom = async (socket: WebSocket, req: FastifyRequest<{ Querystring: { id: number } }>) => {
	const	id = Number(req.query.id);
	const	room = getRoomById(id);
	if (!room || room.getIsSolo()) {
		socket.send(JSON.stringify({type: "INFO", message: "You cannot spectate this room"}));
		socket.send(JSON.stringify({type: "LEAVE", data: "PONG"}));
	}
	room?.addSpectator(socket);
	socket.send(JSON.stringify({type: "GAME", message: "SPEC"}));
}
