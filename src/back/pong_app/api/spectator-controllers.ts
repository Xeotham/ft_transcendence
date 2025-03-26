import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from "ws";
import {getRoomById, RoomInfo} from "../utils";

// const Fastify = require('fastify');
// const { FastifyRequest, FastifyReply } = require('fastify');
// const { WebSocket } = require("ws");
// const { getRoomById } = require("../utils");
//
// type FastifyRequestType = typeof FastifyRequest;
// type FastifyReplyType = typeof FastifyReply;

export const    addSpectatorToRoom = async (socket: WebSocket, req: FastifyRequest< { Querystring: RoomInfo } >) => {
	const	room = getRoomById(Number(req.query.id));
	if (!room || room.getIsSolo()) {
		socket.send(JSON.stringify({type: "INFO", message: "You cannot spectate this room"}));
		socket.send(JSON.stringify({type: "LEAVE", data: "PONG"}));
	}
	room?.addSpectator(socket);
}
