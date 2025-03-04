"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants = require("../../back/pong_app/server/constants");
var canvas = document.getElementById("gameCanvas");
canvas.width = Constants.WIDTH;
canvas.height = Constants.HEIGHT;
var c = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
var socket = new WebSocket("ws://localhost:3000/api/pong/joinRoom");
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
    fetch('http://localhost:3000/api/pong/movePaddle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: 'Test Value', socket: socket })
    });
};
socket.onclose = function () {
};
// Listen for messages
socket.addEventListener("message", function (event) {
    console.log("Message from server : " + event.data);
    alert("Message from server : " + event.data);
});
// function drawGame() {
// 	if (!c)
// 		return;
// 	c.clearRect(0, 0, canvas.width, canvas.height);
//
// 	// Draw ball
// 	c.fillStyle = "white";
// 	c.beginPath();
// 	c.arc(gameState.ball.x, gameState.ball.y, 10, 0, Math.PI * 2);
// 	c.fill();
//
// 	// Draw paddles
// 	c.fillRect(30, gameState.paddles.left, 10, 80); // Left Paddle
// 	c.fillRect(760, gameState.paddles.right, 10, 80); // Right Paddle
// }
//
// function gameLoop() {
// 	drawGame();
// 	requestAnimationFrame(gameLoop);
// }
//
// gameLoop();
