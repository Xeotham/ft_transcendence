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

export const userSockets: {[key: string]: WebSocket} = {};

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
