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
import {getUserByUsername} from "../database/models/Users";

config();

export const fastify = Fastify(/*{ logger: true }*/);
fastify.register(fastifyWebsocket);

// Register the CORS plugin
fastify.register(fastifyCors, {
	origin: `*`, // Allow all origins, or specify your frontend's origin
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', "PATCH"],
	// allowedHeaders: ['Content-Type', 'Authorization'],
});

// Register routes
fastify.register(userRoutes, { prefix: '/api/user' });
fastify.register(tetrisRoutes, { prefix: '/api/tetris' });
fastify.register(pongRoutes, { prefix: '/api/pong' });
fastify.register((fastify)=>{
	fastify.get('/health', async (request, reply) => {
		// You can add more complex health checks here if needed
		return { status: 'ok' };
	});
})

fastify.addHook('onRequest', (request, reply, done) => {
	const   username = request.headers.username;
	const   token = request.headers.authorization?.split(' ')[1];


	if (token && tokenBlacklist.has(token)) {
		reply.status(401).send({ message: 'Token is invalid', disconnect: true });
	} else {
		if (token) {
			jwt.verify(token, process.env.AUTH_KEY!, (err, decoded) => {
				if (err) {
					reply.status(401).send({message: 'Token is invalid', disconnect: true});
				}
				else if (!getUserByUsername(username as string)) {
					reply.status(401).send({message: 'User does not exist', disconnect: true});
				}
				else {
					if (getUserByUsername(username as string))
					// request.user = decoded; // Attach user info to request
					done();
				}
			});
		}
		done();
	}
});

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
