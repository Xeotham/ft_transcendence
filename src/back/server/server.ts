import Fastify from 'fastify';
import userRoutes from '../api/user_management/routes';
import pongRoutes from '../api/pong/routes';
import fastifyCors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import { fastifyStatic } from "@fastify/static";
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from 'ws';
import formbody from "@fastify/formbody"
// import path from 'path';
import * as path from "path";
import * as dotenv from "dotenv";
// import tetrisRoutes from '../../api/tetris/routes';

dotenv.config();

const fastify = Fastify(/*{ logger: true }*/);
fastify.register(fastifyWebsocket);

fastify.register(formbody);

// Register the CORS plugin
fastify.register(fastifyCors, {
	origin: `*`, // Allow all origins, or specify your frontend's origin
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Register routes
// TODO: Create the others API
fastify.register(userRoutes, { prefix: '/api/user' });
fastify.register(pongRoutes, { prefix: '/api/pong' });
// fastify.register(tetrisRoutes, { prefix: '/api/tetris' });


// Register fastify-static to serve static files
fastify.register(fastifyStatic, {
	root: path.join(__dirname, '../../front/public'), // Path to the directory containing your static files
	prefix: '/', // Serve files under the root URL
});

// TODO: Make it the rout to the SPA
fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
	return reply.sendFile('index.html');
});

// Start the server
fastify.listen({ port: parseInt(process.env.PORT!) }, (err: Error | null, address: string) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	// fastify.websocketServer.on('connection', (ws: WebSocket) => {
	// 	ws.send("Connected");
	// });
	console.log(`🚀 Server listening at ${address}`);
});

