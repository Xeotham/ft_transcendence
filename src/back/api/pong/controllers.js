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
    return __generator(this, function (_a) {
        console.log("Joining room");
        exports.Rooms.forEach(function (room) {
            if (socket === room.P1 || socket === room.P2)
                return socket.send(JSON.stringify({ type: "INFO", message: "You are already in a room" }));
            if (room.P1 && !room.full) {
                room.P2 = socket;
                room.full = true;
                room.game = new pong_game_1.Game(room.id, room.P1, room.P2);
                room.P1.send(JSON.stringify({ type: "ALERT", message: "Room found, ready to start, awaiting confirmation" }));
                room.P2.send(JSON.stringify({ type: "ALERT", message: "Room found, ready to start, awaiting confirmation" }));
                room.P1.send(JSON.stringify({ type: "CONFIRM" }));
                room.P2.send(JSON.stringify({ type: "CONFIRM" }));
                return;
            }
        });
        exports.Rooms.push({ id: idGen.next().value, P1: socket, P2: null, isP1Ready: false, isP2Ready: false, full: false, game: null });
        return [2 /*return*/, socket.send(JSON.stringify({ type: "INFO", message: "Room created, awaiting player 2" }))];
    });
}); };
exports.joinRoom = joinRoom;
function waitingPlayers(room) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            while (!room.isP1Ready || !room.isP2Ready) {
                console.log("Waiting for players");
            }
            return [2 /*return*/, true];
        });
    });
}
var startConfirm = function (socket, req) { return __awaiter(void 0, void 0, void 0, function () {
    var room;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                room = exports.Rooms.find(function (room) { return (room.P1 === socket || room.P2 === socket); });
                if (!room)
                    return [2 /*return*/, socket.send(JSON.stringify({ type: "ERROR", message: "Room not found" }))];
                if (room.P1 === socket)
                    room.isP1Ready = true;
                if (room.P2 === socket)
                    room.isP2Ready = true;
                return [4 /*yield*/, waitingPlayers(room)];
            case 1:
                _a.sent();
                console.log("Starting game");
                if (room.P1 === socket)
                    room.game.GameLoop();
                return [2 /*return*/, socket.send(JSON.stringify({ type: "GAME", message: "FINISH" }))];
        }
    });
}); };
exports.startConfirm = startConfirm;
var quitRoom = function (socket, req) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("Quitting room");
        exports.Rooms.forEach(function (room) {
            var _a;
            if (socket === room.P1 && room.P2 !== null) {
                room.P1 = room.P2;
                room.P2 = null;
                room.full = false;
                room.game.Forfeit("P1");
                room.P1.send("Your opponent has left the room");
                return socket.send("You have left the room");
            }
            else if (socket === room.P2) {
                room.P2 = null;
                room.full = false;
                room.game.Forfeit("P2");
                (_a = room.P1) === null || _a === void 0 ? void 0 : _a.send("Your opponent has left the room");
                return socket.send("You have left the room");
            }
            else if (socket === room.P1) {
                exports.Rooms.splice(exports.Rooms.indexOf(room), 1);
                return socket.send("You have left the room");
            }
        });
        return [2 /*return*/, socket.send("You are not in a room")];
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
