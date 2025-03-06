import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import {fastifyStatic} from "@fastify/static";
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { WebSocket } from 'ws';
import * as path from 'path';

const fastify = Fastify();
fastify.register(fastifyWebsocket);

// Register the CORS plugin
// fastify.register(fastifyCors, {
// 	origin: `http://localhost:${PORT}`, // Allow all origins, or specify your frontend's origin
// 	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// });

// Register fastify-static to serve static files
fastify.register(fastifyStatic, {
	root: path.join(__dirname, 'public'), // Path to the directory containing your static files
	prefix: '/', // Serve files under the root URL
});

fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
	return reply.sendFile('index.html');
});


fastify.register(async function (fastify) {
	fastify.get('/ws', { websocket: true }, (socket: WebSocket, req: FastifyRequest) => {
		socket.on('message', message => {
		})
	})
})

fastify.listen({ port: 3000 }, (err: Error | null, address: string) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	console.log(`🚀 Server listening at ${address}`);
});
