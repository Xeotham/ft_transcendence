
const canvas = document.getElementById("gameCanvas")  as HTMLCanvasElement;

const c = canvas?.getContext("2d");

<<<<<<< HEAD
const socket = new WebSocket("ws://localhost:3000/ws");

socket.addEventListener("error", (error) => {
	console.error(error);
})
=======
let gameState = {
	ball: { x: 400, y: 200 },
	paddles: { left: 150, right: 150 }
};

const socket = new WebSocket("ws://localhost:3000/ws");

// socket.addEventListener("error", (error) => {
// 	console.error(error);
// })

// console.log("Is server ready : " + socket.readyState);
>>>>>>> 08a430e055753f8a5213868ff0909c461ed89687

// Connection opened
socket.addEventListener("open", (event) => {
	alert("Socket opened!!!!!!!!!!!!!!!");
<<<<<<< HEAD
	console.log("Is server ready : " + socket.readyState);
	socket.send("Hello Server!");
});

=======
	socket.send("Hello Server!");
});

// socket.onerror = function (error) {
// 	// an error occurred when sending/receiving data
// 	alert('Error');
// };

>>>>>>> 08a430e055753f8a5213868ff0909c461ed89687
// Listen for messages
socket.addEventListener("message", (event) => {
	alert("Message from server + " +  event.data);
});

<<<<<<< HEAD


=======
// socket.onmessage = (event) => {
//     gameState = JSON.parse(event.data);
// };

console.log("Page loaded");

//
>>>>>>> 08a430e055753f8a5213868ff0909c461ed89687
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
<<<<<<< HEAD
// gameLoop();
=======
// gameLoop();
>>>>>>> 08a430e055753f8a5213868ff0909c461ed89687
