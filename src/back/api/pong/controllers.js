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
exports.finishGame = exports.movePaddle = exports.startGame = exports.quitRoom = exports.startConfirm = exports.joinRoom = exports.Rooms = void 0;
var pong_game_1 = require("../../pong_app/server/pong_game");
exports.Rooms = [];
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
var idGen = idGenerator();
var joinRoom = function (socket, req) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, Rooms_1, room, id, newRoom;
    return __generator(this, function (_a) {
        console.log("New Player looking to join room");
        if (exports.Rooms.find(function (room) { return (room.P1 === socket || room.P2 === socket); }))
            return [2 /*return*/, socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }))];
        // Check existing rooms for an available spot
        for (_i = 0, Rooms_1 = exports.Rooms; _i < Rooms_1.length; _i++) {
            room = Rooms_1[_i];
            if (room.P1 && !room.P2) {
                room.P2 = socket;
                room.full = true;
                room.game = new pong_game_1.Game(room.id, room.P1, room.P2);
                room.P1.send(JSON.stringify({ type: "INFO", message: "Room found, ready to start, awaiting confirmation" }));
                room.P2.send(JSON.stringify({ type: "INFO", message: "Room found, ready to start, awaiting confirmation" }));
                room.P1.send(JSON.stringify({ type: "CONFIRM" }));
                room.P2.send(JSON.stringify({ type: "CONFIRM" }));
                socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: "P2", roomID: room.id }));
                return [2 /*return*/];
            }
        }
        id = idGen.next().value;
        newRoom = { id: id, P1: socket, P2: null, isP1Ready: false, isP2Ready: false, full: false, game: null };
        exports.Rooms.push(newRoom);
        socket.send(JSON.stringify({ type: "INFO", message: "Room created, awaiting player 2" }));
        socket.send(JSON.stringify({ type: "GAME", message: "PREP", player: "P1", roomID: id }));
        return [2 /*return*/];
    });
}); };
exports.joinRoom = joinRoom;
var startConfirm = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var room, player, playerSocket;
    return __generator(this, function (_a) {
        room = exports.Rooms.find(function (room) { return (room.id === request.body.roomId); });
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
        room.game.GameLoop();
        return [2 /*return*/];
    });
}); };
exports.startConfirm = startConfirm;
var quitRoom = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var room, player, playerSocket, opponentSocket;
    return __generator(this, function (_a) {
        console.log("Player : " + request.body.P + " is quitting room : " + request.body.roomId);
        room = exports.Rooms.find(function (room) { return room.id === request.body.roomId; });
        if (!room)
            return [2 /*return*/, console.log("Room not found")];
        player = request.body.P;
        playerSocket = player === "P1" ? room.P1 : room.P2;
        opponentSocket = player === "P1" ? room.P2 : room.P1;
        if (!playerSocket)
            return [2 /*return*/, console.log("Player not found")];
        exports.Rooms.forEach(function (room) {
            if (room.P1 !== playerSocket && room.P2 !== playerSocket)
                return;
            if (room.game)
                room.game.Forfeit(player);
            playerSocket === null || playerSocket === void 0 ? void 0 : playerSocket.send(JSON.stringify({ type: "INFO", message: "You have left the room" }));
            opponentSocket === null || opponentSocket === void 0 ? void 0 : opponentSocket.send(JSON.stringify({ type: "ALERT", message: "Your opponent has left the room" }));
            if (!room.isP1Ready || !room.isP2Ready)
                opponentSocket === null || opponentSocket === void 0 ? void 0 : opponentSocket.send(JSON.stringify({ type: "LEAVE" }));
            console.log("Room : " + room.id + " has been deleted");
            exports.Rooms.splice(exports.Rooms.indexOf(room), 1);
        });
        return [2 /*return*/];
    });
}); };
exports.quitRoom = quitRoom;
var startGame = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var room;
    return __generator(this, function (_a) {
        console.log("Starting game");
        room = exports.Rooms.find(function (room) { return room.id === request.body.roomId; });
        if (!room || !room.game)
            return [2 /*return*/, reply.send(JSON.stringify({ type: "ERROR", message: "Room not found" }))];
        room.game.GameLoop();
        return [2 /*return*/];
    });
}); };
exports.startGame = startGame;
var movePaddle = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    var room;
    return __generator(this, function (_a) {
        room = exports.Rooms.find(function (room) { return room.id === request.body.roomId; });
        if (!room || !room.game)
            return [2 /*return*/, reply.send(JSON.stringify({ type: "ERROR", message: "Room not found" }))];
        room.game.MovePaddle(request.body);
        return [2 /*return*/];
    });
}); };
exports.movePaddle = movePaddle;
var finishGame = function (request, reply) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("Game Finished");
        return [2 /*return*/, reply.send(JSON.stringify("Game Finished????"))];
    });
}); };
exports.finishGame = finishGame;
