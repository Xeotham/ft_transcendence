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
exports.addSpectatorToRoom = exports.movePaddle = exports.startTournament = exports.quitRoom = exports.startConfirm = exports.shuffleTree = exports.joinTournament = exports.createTournament = exports.joinSolo = exports.joinMatchmaking = exports.idGenRoom = exports.Tournaments = exports.Rooms = void 0;
exports.idGenerator = idGenerator;
var pong_game_1 = require("../../pong_app/server/pong_game");
var tournament_1 = require("../../pong_app/server/tournament");
exports.Rooms = [];
exports.Tournaments = [];
function idGenerator() {
    var i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!1) return [3 /*break*/, 3];
                return [4 /*yield*/, i++];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/, i];
        }
    });
}
exports.idGenRoom = idGenerator();
var idGenTour = idGenerator();
function getRoomById(id) {
    if (exports.Rooms.find(function (room) { return room.id === id; }))
        return exports.Rooms.find(function (room) { return room.id === id; }); // Find the room in the list of rooms
    // Find the room in the list of rooms in the tournaments
    exports.Tournaments.forEach(function (tour) {
        if (tour.getRoomById(id) !== null)
            return tour.getRoomById(id);
    });
}
function getTournamentById(id) {
    return exports.Tournaments.find(function (tour) { return tour.getId() === id; });
}
function isPlayerInRoom(socket) {
    return exports.Rooms.find(function (room) { return room.P1 === socket || room.P2 === socket; }) !== undefined;
}
function isPlayerInTournament(socket) {
    return exports.Tournaments.find(function (tour) { return tour.getPlayers().find(function (player) { return player === socket; }); }) !== undefined;
}
var joinMatchmaking = function (socket, req) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, Rooms_1, room, id, newRoom;
    return __generator(this, function (_a) {
        if (isPlayerInRoom(socket) || isPlayerInTournament(socket))
            return [2 /*return*/, socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }))];
        console.log("New Player looking to join room");
        // Check existing rooms for an available spot
        for (_i = 0, Rooms_1 = exports.Rooms; _i < Rooms_1.length; _i++) {
            room = Rooms_1[_i];
            if (room.P1 && !room.P2) {
                room.P2 = socket;
                room.full = true;
                room.game = new pong_game_1.Game(room.id, room.P1, room.P2, false, room.spectators);
                room.P1.send(JSON.stringify({ type: "INFO", message: "Room found, ready to start, awaiting confirmation" }));
                room.P2.send(JSON.stringify({ type: "INFO", message: "Room found, ready to start, awaiting confirmation" }));
                room.P1.send(JSON.stringify({ type: "CONFIRM" }));
                room.P2.send(JSON.stringify({ type: "CONFIRM" }));
                socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: "P2", roomId: room.id }));
                return [2 /*return*/];
            }
        }
        id = exports.idGenRoom.next().value;
        newRoom = { id: id, P1: socket, P2: null, isP1Ready: false, isP2Ready: false, full: false, game: null, isSolo: false, spectators: [] };
        exports.Rooms.push(newRoom);
        socket.send(JSON.stringify({ type: "INFO", message: "Room created, awaiting player 2" }));
        socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: "P1", roomId: id }));
        return [2 /*return*/];
    });
}); };
exports.joinMatchmaking = joinMatchmaking;
var joinSolo = function (socket, req) { return __awaiter(void 0, void 0, void 0, function () {
    var newRoom;
    return __generator(this, function (_a) {
        if (isPlayerInRoom(socket) || isPlayerInTournament(socket))
            return [2 /*return*/, socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }))];
        console.log("New Player creating solo room");
        newRoom = { id: exports.idGenRoom.next().value, P1: socket, P2: socket, isP1Ready: true, isP2Ready: true, full: true, game: null, isSolo: true, spectators: [] };
        newRoom.game = new pong_game_1.Game(newRoom.id, socket, socket, true);
        exports.Rooms.push(newRoom);
        socket.send(JSON.stringify({ type: "INFO", message: "Solo room created, starting game" }));
        socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: "P1", roomId: newRoom.id }));
        socket.send(JSON.stringify({ type: "GAME", message: "START" }));
        newRoom.game.GameLoop();
        return [2 /*return*/];
    });
}); };
exports.joinSolo = joinSolo;
var createTournament = function (socket, req) { return __awaiter(void 0, void 0, void 0, function () {
    var newTour;
    return __generator(this, function (_a) {
        // console.log("is Player in tournament : " + isPlayerInTournament(socket) + " is Player in room : " + isPlayerInRoom(socket));
        if (isPlayerInTournament(socket) || isPlayerInRoom(socket))
            return [2 /*return*/, socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }))];
        console.log("New Player creating tournament");
        newTour = new tournament_1.Tournament(idGenTour.next().value, socket);
        exports.Tournaments.push(newTour);
        socket.send(JSON.stringify({ type: "INFO", message: "Tournament created, awaiting players" }));
        socket.send(JSON.stringify({ type: "TOURNAMENT", message: "PREP", tourId: newTour.getId(), tourPlacement: 0 }));
        return [2 /*return*/];
    });
}); };
exports.createTournament = createTournament;
var joinTournament = function (socket, req) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, Tournaments_1, tour;
    return __generator(this, function (_a) {
        // Check if player is already in a room
        if (isPlayerInRoom(socket) || isPlayerInTournament(socket))
            return [2 /*return*/, socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }))];
        console.log("New Player looking to join tournament");
        for (_i = 0, Tournaments_1 = exports.Tournaments; _i < Tournaments_1.length; _i++) {
            tour = Tournaments_1[_i];
            if (tour.hasStarted())
                continue;
            tour.addPlayer(socket);
            socket.send(JSON.stringify({ type: "INFO", message: "You have joined the tournament" }));
            socket.send(JSON.stringify({ type: "TOURNAMENT", message: "PREP", tourId: tour.getId(), tourPlacement: tour.getPlayers().length - 1 }));
            return [2 /*return*/];
        }
        socket.send(JSON.stringify({ type: "ALERT", message: "No tournament found. Disconnecting" }));
        socket.send(JSON.stringify({ type: "LEAVE" }));
        return [2 /*return*/];
    });
}); };
exports.joinTournament = joinTournament;
var shuffleTree = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var tour;
    return __generator(this, function (_a) {
        tour = getTournamentById(request.body.tourId);
        if (!tour)
            return [2 /*return*/, console.log("Tournament not found")];
        tour.shuffleTree();
        return [2 /*return*/];
    });
}); };
exports.shuffleTree = shuffleTree;
var startConfirm = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var room, player, playerSocket;
    return __generator(this, function (_a) {
        room = getRoomById(request.body.roomId);
        player = request.body.P;
        // TODO: look at that again later
        if (!room)
            return [2 /*return*/];
        playerSocket = player === "P1" ? room.P1 : room.P2;
        if (player === "P1")
            room.isP1Ready = true;
        else
            room.isP2Ready = true;
        playerSocket.send(JSON.stringify({ type: "INFO", message: "You are ready, waiting for your opponent" }));
        if (!room.isP1Ready || !room.isP2Ready)
            return [2 /*return*/, playerSocket.send(JSON.stringify({ type: "INFO", message: "Players not ready" }))];
        room.P1.send(JSON.stringify({ type: "INFO", message: "Both players are ready, the game is starting." }));
        room.P2.send(JSON.stringify({ type: "INFO", message: "Both players are ready, the game is starting." }));
        room.P1.send(JSON.stringify({ type: "GAME", message: "START" }));
        room.P2.send(JSON.stringify({ type: "GAME", message: "START" }));
        console.log("Starting game");
        room.game.gameLoop();
        return [2 /*return*/];
    });
}); };
exports.startConfirm = startConfirm;
var quitRoom = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (request.body.matchType === "PONG")
            quitPong(request);
        else if (request.body.matchType === "TOURNAMENT")
            quitTournament(request);
        return [2 /*return*/];
    });
}); };
exports.quitRoom = quitRoom;
function quitPong(request) {
    var room = getRoomById(request.body.roomId);
    if (!room)
        return console.log("Room not found");
    console.log("Player : " + request.body.P + " is quitting room : " + request.body.roomId);
    var player = request.body.P;
    var playerSocket = player === "P1" ? room.P1 : room.P2;
    var opponentSocket = player === "P1" ? room.P2 : room.P1;
    if (!playerSocket)
        return console.log("Player not found");
    // Rooms.forEach((room) => {
    // 	if (room.P1 !== playerSocket && room.P2 !== playerSocket)
    // 		return ;
    if (player === "SPEC") {
        var socket = room.spectators.at(request.body.specPlacement);
        if (!socket)
            return;
        room.spectators.splice(room.spectators.indexOf(socket), 1);
        socket.send(JSON.stringify({ type: "INFO", message: "You stopped spectating the room" }));
        socket.send(JSON.stringify({ type: "LEAVE", data: "PONG" }));
        return;
    }
    if (room.game)
        room.game.forfeit(player);
    playerSocket === null || playerSocket === void 0 ? void 0 : playerSocket.send(JSON.stringify({ type: "INFO", message: "You have left the room" }));
    opponentSocket === null || opponentSocket === void 0 ? void 0 : opponentSocket.send(JSON.stringify({ type: "WARNING", message: "Your opponent has left the room" }));
    if (!room.isP1Ready || !room.isP2Ready)
        opponentSocket === null || opponentSocket === void 0 ? void 0 : opponentSocket.send(JSON.stringify({ type: "LEAVE", data: "PONG", message: request.body.message === "QUEUE_TIMEOUT" ? "QUEUE_AGAIN" : "QUIT" }));
    console.log("Room : " + room.id + " has been deleted");
    exports.Rooms.splice(exports.Rooms.indexOf(room), 1);
    // });
}
function quitTournament(request) {
    console.log("Player : " + request.body.tourPlacement + " is quitting tournament : " + request.body.tourId);
    var tour = getTournamentById(request.body.tourId);
    if (!tour)
        return console.log("Tournament not found");
    // TODO : Look at that when game already started
    if (tour.removePlayer(request.body.tourPlacement)) {
        console.log("Tournament : " + tour.getId() + " has been deleted");
        exports.Tournaments.splice(exports.Tournaments.indexOf(this), 1);
    }
}
var startTournament = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var tour;
    return __generator(this, function (_a) {
        console.log("Starting game");
        tour = getTournamentById(request.body.tourId);
        if (!tour)
            return [2 /*return*/, console.log("Tournament not found")];
        tour.startTournament();
        return [2 /*return*/];
    });
}); };
exports.startTournament = startTournament;
var movePaddle = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var room;
    return __generator(this, function (_a) {
        room = getRoomById(request.body.roomId);
        if (!room || !room.game)
            return [2 /*return*/, reply.send(JSON.stringify({ type: "ERROR", message: "Room not found" }))];
        room.game.movePaddle(request.body);
        return [2 /*return*/];
    });
}); };
exports.movePaddle = movePaddle;
var addSpectatorToRoom = function (socket, req) { return __awaiter(void 0, void 0, void 0, function () {
    var id, room;
    var _a;
    return __generator(this, function (_b) {
        id = Number(req.query.id);
        room = getRoomById(id);
        if (!room || room.isSolo) {
            socket.send(JSON.stringify({ type: "INFO", message: "You cannot spectate this room" }));
            socket.send(JSON.stringify({ type: "LEAVE", data: "PONG" }));
        }
        room.spectators.push(socket);
        (_a = room.game) === null || _a === void 0 ? void 0 : _a.addSpectator(socket);
        return [2 /*return*/];
    });
}); };
exports.addSpectatorToRoom = addSpectatorToRoom;
