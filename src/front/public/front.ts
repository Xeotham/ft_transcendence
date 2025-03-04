import * as Constants from "../../back/pong_app/server/constants";
import { responseFormat } from "../../back/api/pong/controllers";

let roomNumber = 0;

const canvas = document.getElementById("gameCanvas")  as HTMLCanvasElement;

canvas.width = Constants.WIDTH;
canvas.height = Constants.HEIGHT;

const c = canvas?.getContext("2d") as CanvasRenderingContext2D;

const socket = new WebSocket("ws://localhost:3000/api/pong/joinRoom");

socket.addEventListener("error", (error) => {
	console.error(error);
})

// Connection opened
socket.onopen = () => {
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
		body: JSON.stringify(
			{ key: 'Test Value', socket: socket })
	})

}

socket.onclose = () => {

}

// Listen for messages
socket.addEventListener("message", (event: MessageEvent<{ res: responseFormat }>) => {
	let res = event.data.res;

	if (res.type === "INFO")
		console.log("[INFO] : " +  res.message);
	else if (res.type === "ALERT" || res.type === "ERROR" || res.type === "WARNING")
		alert(res.message);


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
