
const canvas = document.getElementById("gameCanvas")  as HTMLCanvasElement;

const c = canvas?.getContext("2d");

let gameState = {
	ball: { x: 400, y: 200 },
	paddles: { left: 150, right: 150 }
};

const socket = new WebSocket("ws://localhost:8080");

console.log("Is server ready : " + socket.readyState);

// Connection opened
socket.addEventListener("open", (event) => {
	alert("Socket opened!!!!!!!!!!!!!!!");
	socket.send("Hello Server!");
});

socket.onerror = function (error) {
	// an error occurred when sending/receiving data
	alert('Error');
};

// Listen for messages
socket.addEventListener("message", (event) => {
	alert("Message from server + " +  event.data);
});

// socket.onmessage = (event) => {
//     gameState = JSON.parse(event.data);
// };

console.log("Page loaded");

//
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