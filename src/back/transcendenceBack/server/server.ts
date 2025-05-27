import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from 'ws';
import { join } from "path";
import { config } from "dotenv";
import tetrisRoutes from "../tetris_app/api/routes";
import pongRoutes from '../pong_app/api/routes';
import userRoutes from '../user_management/api/routes';
import {tokenBlacklist} from "../user_management/api/controllers";
import jwt from "jsonwebtoken";
import {createObject} from "rxjs/internal/util/createObject";

config();

export const fastify = Fastify(/*{ logger: true }*/);
fastify.register(fastifyWebsocket);

// Register the CORS plugin
fastify.register(fastifyCors, {
	origin: `*`, // Allow all origins, or specify your frontend's origin
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	// allowedHeaders: ['Content-Type', 'Authorization'],
});

// Register routes
// TODO: Create the others API
fastify.register(userRoutes, { prefix: '/api/user' });
fastify.register(tetrisRoutes, { prefix: '/api/tetris' });
fastify.register(pongRoutes, { prefix: '/api/pong' });

fastify.addHook('onRequest', (request, reply, done) => {
	const token = request.headers.authorization?.split(' ')[1];

	// console.log(process.env.AUTH_KEY);

	if (token && tokenBlacklist.has(token)) {
		console.log("Token is Blacklisted: ", token);
		reply.status(401).send({ message: 'Token is invalid' });
	} else {
		if (token)
			jwt.verify(token, process.env.AUTH_KEY!, (err, decoded) => {
				if (err) {
					console.log(err);
					reply.status(401).send({ message: 'Token is invalid' });
				} else {
					// request.user = decoded; // Attach user info to request
					done();
				}
			});
		done();
	}
});

// TODO: Make it the rout to the SPA
// fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
// 	return reply.sendFile('index.html');
// });

// Start the server
fastify.listen({ port: parseInt(process.env.BACK_PORT!), host: "0.0.0.0" }, (err: Error | null, address: string) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	// fastify.websocketServer.on('connection', (ws: WebSocket) => {
	// 	ws.send("Connected");
	// });
	console.log(`🚀 Server listening at ${address}`);
});
