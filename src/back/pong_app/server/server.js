"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = require("fastify");
var static_1 = require("@fastify/static");
var path_1 = require("path");
var fastify = (0, fastify_1.default)({ logger: true });
// Register fastify-static to serve static files
fastify.register(static_1.fastifyStatic, {
    root: path_1.default.join(__dirname, 'public'), // Path to the directory containing your static files
    prefix: '/', // Serve files under the root URL
});
fastify.register(require('@fastify/websocket'), {
    options: { maxPayload: 1048576 }
});
fastify.register(function (fastify) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            fastify.get('/ws', { websocket: true }, function (socket, req) {
                socket.on('message', function (message) {
                    // message.toString() === 'hi from client'
                    socket.send('hi from ws route');
                });
            });
            return [2 /*return*/];
        });
    });
});
fastify.get('/', function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, reply.sendFile('index.html')];
    });
}); });
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.websocketServer.on("connection", function (socket) {
        socket.send('test');
    });
    fastify.log.info("\uD83D\uDE80 Server listening at ".concat(address));
});
// fastify.get('/ws', { websocket: true }, (connection, req) => {
// 	try {
// 		fastify.log.info('Client connected');
// 		connection.send('Welcome to the WebSocket server!');
//
// 		connection.on('message', (message) => {
// 			fastify.log.info(`Received: ${message.toString()}`);
// 			connection.send(`Echo: ${message.toString()}`);
// 		});
//
// 		connection.on('close', () => {
// 			fastify.log.info('Client disconnected');
// 		});
//
// 		connection.on('error', (error) => {
// 			fastify.log.error('WebSocket error:', error);
// 		});
// 	} catch (error) {
// 		fastify.log.error('Unexpected error:', error);
// 	}
// });
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
