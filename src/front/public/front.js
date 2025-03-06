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
var roomNumber = 0;
var game = null;
var player = null;
var content = document.getElementById("content");
var socket = null;
function loadPage(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (page === "no-room") {
                noRoom(content);
            }
            else if (page === "room-found") {
                room_found(content);
            }
            return [2 /*return*/];
        });
    });
}
function room_found(content) {
    content.innerHTML = "\n\t\t<p>Room found!</p>\n\t\t<button id=\"quit-room\">Quit Room</button>\n\t";
    document.getElementById("quit-room").addEventListener("click", quitRoom);
}
// canvas.width = Constants.WIDTH;
// canvas.height = Constants.HEIGHT;
function quitRoom() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("quit room");
            if (socket)
                socket.close();
            socket = null;
            loadPage("no-room");
            return [2 /*return*/];
        });
    });
}
function noRoom(content) {
    content.innerHTML = "\n\t\t<button id=\"join-game\">Join the Game</button>\n\t";
    document.getElementById("join-game").addEventListener("click", joinRoom);
}
function confirmGame() {
    console.log("Trying to confirm");
    content.innerHTML = "\n\t\t<p>Game Found, Confirm?</p>\n\t\t<button id=\"confirm-game\">Confirm Game</button>\n\t";
    document.getElementById("confirm-game").addEventListener("click", function () {
        fetch('http://localhost:3000/api/pong/startConfirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: "Up", roomId: roomNumber, side: (player === "P1") ? "left" : "right" })
        });
    });
}
function joinRoom(ev) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            loadPage("room-found");
            if (!socket)
                socket = new WebSocket("ws://localhost:3000/api/pong/joinRoom");
            socket.addEventListener("error", function (error) {
                console.error(error);
            });
            // Connection opened
            socket.onopen = function () {
                console.log("Connected to the server");
                // fetch('http://localhost:3000/api/pong/finishGame')
                // 	.then(response => response.json())
                // 	.then(data => console.log(data))
                // 	.catch(error => console.error('Error:', error));
                // fetch('http://localhost:3000/api/pong/movePaddle', {
                // 	method: 'POST',
                // 	headers: {
                // 		'Content-Type': 'application/json'
                // 	},
                // 	body: JSON.stringify({ key: "Up", roomId: roomNumber, side: "left" })
                // })
            };
            // socket.onclose = () => {
            // 	fetch('http://localhost:3000/api/pong/quitRoom').then();
            // }
            // Listen for messages
            socket.addEventListener("message", function (event) {
                // console.log("Message from server: ", event);
                // console.log("Message from server: ", event.data);
                var res = JSON.parse(event.data);
                // console.log(res);
                if (!res)
                    return;
                if (res.type === 'INFO') {
                    roomNumber = res.roomID;
                    player = res.player;
                    console.log("Joined room: ".concat(roomNumber, " as player: ").concat(player));
                }
                else if (res.type === "ALERT" || res.type === "ERROR" || res.type === "WARNING") {
                    console.log("%c[" + res.type + "]%c : " + res.message, "color: red", "color: reset");
                    alert(res.message);
                }
                else if (res.type === "CONFIRM") {
                    confirmGame();
                }
                else if (res.type === "GAME") {
                    // console.log(res.data);
                    game = res.data;
                    console.log(res.message);
                    console.log(game);
                    // if (res.message === "FINISH")
                    // 	fetch();
                    drawGame();
                }
            });
            return [2 /*return*/];
        });
    });
}
loadPage("no-room");
var canvas = document.getElementById("gameCanvas");
// canvas.width = Constants.WIDTH;
// canvas.height = Constants.HEIGHT;
var c = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
// function gameLoop() {
// 	if (!game)
// 		return;
// 	while (!game.Over) {
// 		drawGame();
// 	}
// }
function drawGame() {
    if (!c || !game)
        return;
    c.clearRect(0, 0, canvas.width, canvas.height);
    // Draw ball
    c.fillStyle = "white";
    c.beginPath();
    c.arc(game.Ball.x, game.Ball.y, game.Ball.size, 0, Math.PI * 2);
    c.fill();
    // Draw paddles
    c.fillRect(game.Paddle1.x, game.Paddle1.y, game.Paddle1.x_size, game.Paddle1.y_size); // Left Paddle
    c.fillRect(game.Paddle2.x, game.Paddle2.y, game.Paddle2.x_size, game.Paddle2.y_size); // Right Paddle
}
