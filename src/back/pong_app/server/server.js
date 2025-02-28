"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = require("fastify");
var websocket_1 = require("@fastify/websocket");
var fastify = (0, fastify_1.default)({ logger: true });
fastify.register(websocket_1.default);
fastify.get('/ws', { websocket: true }, function (connection, req) {
    try {
        fastify.log.info('Client connected');
        connection.send('Welcome to the WebSocket server!');
        connection.on('message', function (message) {
            fastify.log.info("Received: ".concat(message.toString()));
            connection.send("Echo: ".concat(message.toString()));
        });
        connection.on('close', function () {
            fastify.log.info('Client disconnected');
        });
        connection.on('error', function (error) {
            fastify.log.error('WebSocket error:', error);
        });
    }
    catch (error) {
        fastify.log.error('Unexpected error:', error);
    }
});
fastify.listen({ port: 8080 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info("\uD83D\uDE80 Server listening at ".concat(address));
});
// import Fastify from "fastify";
//
// const fastify = Fastify();
// const url = require('url');
// const websocket = require('@fastify/websocket');
//
// fastify.register(websocket); // Make sure WebSocket plugin is registered FIRST
//
// fastify.get('/ws', { websocket: true }, (connection, req) => {
// 	const queryObj = url.parse(req.url, true).query;
// 	console.log(`Client ${queryObj.user_id} connected`);
//
// 	connection.socket.send(JSON.stringify({ msg: "You are connected to the server" }));
//
// 	connection.socket.on('message', (msg) => {
// 		const data = JSON.parse(msg);
// 		console.log(`Received from ${queryObj.user_id}:`, data);
// 	});
//
// 	connection.socket.on('close', () => {
// 		console.log(`Client ${queryObj.user_id} disconnected`);
// 	});
// });
//
// // Use a proper error handler
// fastify.setErrorHandler((error, req, reply) => {
// 	console.error("Fastify Error:", error);
// 	reply.status(500).send({ error: "Internal Server Error", message: error.message });
// });
//
// // Start server
// fastify.listen({ port: 8080 }, (err, address) => {
// 	if (err) {
// 		console.error("Server start error:", err);
// 		process.exit(1);
// 	}
// 	console.log(`Server running on ${address}`);
// });
//
//
// import path from "node:path";
// import Fastify from "fastify";
// import dotenv from "dotenv";
// import fastifyStatic from "@fastify/static";
//
//
// console.log("\x1B[1m\x1B[4m\x1B[32mOK let's do this\x1b[0m");
//
// dotenv.config();
//
//
// const fastify = Fastify();
//
//
// fastify.listen({ port: 8080 }, (err, address) => {
// 	if(err) {
// 		console.error(err);
// 		process.exit(1);
// 	}
// 	console.log(`Server listening at: ${address}`);
// });
//
//
// fastify.get('/hello', (request, reply) => {
// 	reply.send({
// 		message: 'Hello Fastify'
// 	});
// });
//
// fastify.get('/hello-ws', { websocket: true }, (connection, req) => {
// 	// Client connect
// 	console.log('Client connected');
// 	// Client message
// 	connection.on('message', message => {
// 		console.log(`Client message: ${message}`);
// 	});
// 	// Client disconnect
// 	connection.on('close', () => {
// 		console.log('Client disconnected');
// 	});
// 	connection.socket.onmessage = (event) => {
// 		console.log(`Client message: ${event.data}`);
// 	}
// 	// connection.socket.addEventListener('open', () => {
// 	// 	console.log('Client connected');
// 	// 	connection.send('Hello Fastify WebSockets');
// 	// });
// });
// // Register fastify-static to serve static files
// fastify.register(fastifyStatic, {
// 	root: path.join(__dirname, 'public'), // Path to the directory containing your static files
// 	prefix: '/', // Serve files under the root URL
// });
//
// fastify.get('/', async (request, reply) => {
// 	return reply.sendFile('index.html');
// });
