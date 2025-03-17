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
var roomNumber = -1;
var game = null;
var player = null;
var content = document.getElementById("content");
var socket = null;
var score = { player1: 0, player2: 0 };
var isSolo = false;
var isButtonPressed = { "ArrowUp": false, "ArrowDown": false, "KeyS": false, "KeyX": false };
var intervals = { "ArrowUp": null, "ArrowDown": null, "KeyS": null, "KeyX": null };
var queueInterval = null;
var matchType = "";
var isTournamentOwner = false;
var tournamentId = -1;
var tourPlacement = -1;
// canvas.width = Constants.WIDTH;
// canvas.height = Constants.HEIGHT;
function loadPage(page) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (page) {
                case "no-room":
                    noRoom(content);
                    break;
                case "room-found":
                    room_found(content);
                    break;
            }
            return [2 /*return*/];
        });
    });
}
function noRoom(content) {
    content.innerHTML = "\n\t\t<button id=\"join-game\">Join a Game</button>\t\t\n\t\t<button id=\"join-solo-game\">Create a solo Game</button>\n\t\t<button id=\"create-tournament\">Create a tournament</button>\n\t\t<button id=\"join-tournament\">Join a tournament</button>\n\t";
    document.getElementById("join-game").addEventListener("click", joinMatchmaking);
    document.getElementById("join-solo-game").addEventListener("click", joinSolo);
    document.getElementById("create-tournament").addEventListener("click", createTournament);
    document.getElementById("join-tournament").addEventListener("click", joinTournament);
    c === null || c === void 0 ? void 0 : c.clearRect(0, 0, canvas.width, canvas.height);
}
function room_found(content) {
    content.innerHTML = "\n\t\t<p>Room found!</p>\n\t\t<button id=\"quit-room\">Quit Room</button>\n\t";
    if (isTournamentOwner)
        content.innerHTML += "<button id=\"start-tournament\">Start Tournament</button>";
    document.getElementById("quit-room").addEventListener("click", function (ev) { return quitRoom("Leaving room"); });
}
function joinMatchmaking() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            loadPage("room-found");
            isSolo = false;
            matchType = "PONG";
            if (!socket)
                socket = new WebSocket("ws://localhost:3000/api/pong/joinMatchmaking");
            socket.addEventListener("error", function (error) {
                console.error(error);
            });
            // Connection opened
            socket.onopen = function () {
                console.log("Connected to the server");
            };
            socket.onclose = function () {
                console.log("Connection closed");
                if (roomNumber >= 0)
                    quitRoom();
            };
            // Listen for messages
            socket.addEventListener("message", messageHandler);
            return [2 /*return*/];
        });
    });
}
function joinSolo() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            isSolo = true;
            matchType = "PONG";
            if (!socket)
                socket = new WebSocket("ws://localhost:3000/api/pong/joinSolo");
            socket.addEventListener("error", function (error) {
                console.error(error);
            });
            // Connection opened
            socket.onopen = function () {
                console.log("Connected to the server for solo game");
            };
            socket.onclose = function () {
                console.log("Connection closed");
                if (roomNumber >= 0)
                    quitRoom();
                reattachEventListeners();
            };
            // Listen for messages
            socket.addEventListener("message", messageHandler);
            return [2 /*return*/];
        });
    });
}
function createTournament() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            isSolo = false;
            isTournamentOwner = true;
            matchType = "TOURNAMENT";
            loadPage("room-found");
            if (!socket)
                socket = new WebSocket("ws://localhost:3000/api/pong/createTournament");
            socket.addEventListener("error", function (error) {
                console.error(error);
            });
            // Connection opened
            socket.onopen = function () {
                console.log("Created a tournament");
            };
            socket.onclose = function () {
                console.log("Connection closed");
                if (tournamentId >= 0)
                    quitRoom();
            };
            // Listen for messages
            socket.addEventListener("message", messageHandler);
            return [2 /*return*/];
        });
    });
}
function joinTournament() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            isSolo = false;
            isTournamentOwner = false;
            matchType = "TOURNAMENT";
            if (!socket)
                socket = new WebSocket("ws://localhost:3000/api/pong/joinTournament");
            socket.addEventListener("error", function (error) {
                console.error(error);
            });
            // Connection opened
            socket.onopen = function () {
                console.log("Trying to join a tournament");
            };
            socket.onclose = function () {
                console.log("Connection closed");
                if (tournamentId >= 0)
                    quitRoom();
                reattachEventListeners();
            };
            // Listen for messages
            socket.addEventListener("message", messageHandler);
            return [2 /*return*/];
        });
    });
}
function reattachEventListeners() {
    document.getElementById("join-game").addEventListener("click", joinMatchmaking);
    document.getElementById("join-solo-game").addEventListener("click", joinSolo);
    document.getElementById("create-tournament").addEventListener("click", createTournament);
    document.getElementById("join-tournament").addEventListener("click", joinTournament);
}
function quitRoom(msg) {
    if (msg === void 0) { msg = "Leaving room"; }
    if (isSolo)
        msg = "Leaving room";
    if (msg === "QUEUE_TIMEOUT")
        console.log("You took too long to confirm the game. Back to the lobby");
    fetch('http://localhost:3000/api/pong/quitRoom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matchType: matchType, message: msg, tourId: tournamentId, roomId: roomNumber, P: player, tourPlacement: tourPlacement })
    });
    if (socket)
        socket.close();
    socket = null;
    roomNumber = -1;
    tournamentId = -1;
    tourPlacement = -1;
    isTournamentOwner = false;
    player = null;
    matchType = "";
    loadPage("no-room");
}
function messageHandler(event) {
    var res = JSON.parse(event.data);
    if (!res)
        return;
    switch (res.type) {
        case 'INFO':
            console.log("%c[INFO]%c : " + res.message, "color: green", "color: reset");
            if (res.data)
                console.log("data: " + res.data);
            break;
        case "ALERT":
            alert(res.message);
        // fallthrough
        case "ERROR":
        // fallthrough
        case "WARNING":
            console.log("%c[" + res.type + "]%c : " + res.message, "color: red", "color: reset");
            break;
        case "CONFIRM":
            confirmGame();
            break;
        case "LEAVE":
            quitRoom();
            if (res.message === "QUEUE_AGAIN" || queueInterval) {
                console.log("The opponent took too long to confirm the game. Restarting the search");
                joinMatchmaking();
            }
            clearInterval(queueInterval);
            queueInterval = null;
            break;
        case "TOURNAMENT":
            tournamentMessageHandler(res);
            break;
        case "GAME":
            gameMessageHandler(res);
            break;
        default:
            console.log("Unknown message type: " + res.type);
    }
}
function tournamentMessageHandler(res) {
    switch (res.message) {
        case "OWNER":
            isTournamentOwner = true;
            console.log("You are the owner of the tournament");
            loadPage("room-found");
            break;
        case "PREP":
            tournamentId = res.tourId === null ? tournamentId : res.tourId;
            tourPlacement = res.tourPlacement === null ? tourPlacement : res.tourPlacement;
            console.log("Joined tournament: " + tournamentId + " as player: " + tourPlacement);
            break;
    }
}
function gameMessageHandler(res) {
    switch (res.message) {
        case "PREP":
            roomNumber = res.roomId === null ? roomNumber : res.roomId;
            player = res.player === null ? player : res.player;
            console.log("Joined room: " + roomNumber + " as player: " + player);
            break;
        case "START":
            document.getElementById("content").innerHTML = "";
            document.addEventListener("keydown", keyHandler);
            document.addEventListener("keyup", keyHandler);
            break;
        case "FINISH":
            if (isSolo)
                alert(res.data + " won!");
            else
                res.data === player ? alert("You won!") : alert("You lost!");
            document.removeEventListener("keydown", keyHandler);
            document.removeEventListener("keyup", keyHandler);
            quitRoom();
            break;
        case "SCORE":
            score = res.data;
            console.log("%c[Score]%c : " + score.player1 + " - " + score.player2, "color: purple", "color: reset");
            //  TODO : display score on screen
            break;
        default:
            game = res.data;
            drawGame();
    }
}
function keyHandler(event) {
    if (!game || roomNumber < 0 || !player || event.repeat)
        return;
    // console.log("event type:" + event.type + ", Key pressed: " + event.code);
    function sendPaddleMovement(key, p) {
        return __awaiter(this, void 0, void 0, function () {
            var paddle, direction;
            return __generator(this, function (_a) {
                paddle = p === "P1" ? game.Paddle1 : game.Paddle2;
                if (key !== "ArrowUp" && key !== "ArrowDown" && key !== "KeyS" && key !== "KeyX")
                    return [2 /*return*/];
                direction = "";
                if (key === "ArrowUp" || key === "ArrowDown")
                    direction = key === "ArrowUp" ? "up" : "down";
                if (isSolo && (key === "KeyS" || key === "KeyX"))
                    direction = key === "KeyS" ? "up" : "down";
                // TODO : replace with Constants
                if (direction === "" || (direction === "up" && paddle.y <= 0) || (direction === "down" && paddle.y >= 400 - 80))
                    return [2 /*return*/];
                fetch('http://localhost:3000/api/pong/movePaddle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ roomId: roomNumber, P: p, key: direction })
                });
                return [2 /*return*/];
            });
        });
    }
    var p = player;
    if (isSolo)
        p = event.code === "KeyS" || event.code === "KeyX" ? "P1" : "P2";
    if (event.type === "keydown" && isButtonPressed[event.code] === false) {
        isButtonPressed[event.code] = true;
        intervals[event.code] = setInterval(sendPaddleMovement, 1000 / 60, event.code, p);
    }
    if (event.type === "keyup" && isButtonPressed[event.code] === true) {
        isButtonPressed[event.code] = false;
        clearInterval(intervals[event.code]);
        intervals[event.code] = null;
    }
}
function confirmGame() {
    content.innerHTML = "\n    <p>Game Found, Confirm?</p>\n    <button id=\"confirm-game\">Confirm Game</button>\n    <p id=\"timer\">Time remaining: 10s</p>\n\t";
    var remainingTime = 10;
    queueInterval = setInterval(function () {
        remainingTime--;
        if (document.getElementById("timer"))
            document.getElementById("timer").innerText = "Time remaining: ".concat(remainingTime, "s");
        if (remainingTime <= 0) {
            clearInterval(queueInterval);
            quitRoom("QUEUE_TIMEOUT");
        }
    }, 1000);
    document.getElementById("confirm-game").addEventListener("click", function () {
        clearInterval(queueInterval);
        document.getElementById("timer").innerText = "Confirmed! Awaiting opponent";
        fetch('http://localhost:3000/api/pong/startConfirm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId: roomNumber, P: player })
        });
    });
}
loadPage("no-room");
var canvas = document.getElementById("gameCanvas");
var c = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
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
