// import * as Constants from "../../back/pong_app/server/constants";
import { responseFormat } from "../../back/api/pong/controllers";
import { Game } from "../../back/pong_app/server/pong_game";

let		roomNumber = 0;
let		game : Game | null = null;
let		player : string | null = null;
const	content = document.getElementById("content")!;
let		socket: WebSocket | null = null;

async function loadPage(page: string) {
	if (page === "no-room") {
		noRoom(content)
	}
	else if (page === "room-found") {
		room_found(content)
	}
}

function	room_found(content: HTMLElement) {
	content.innerHTML= `
		<p>Room found!</p>
		<button id="quit-room">Quit Room</button>
	`
	document.getElementById("quit-room").addEventListener("click", quitRoom)
}

// canvas.width = Constants.WIDTH;
// canvas.height = Constants.HEIGHT;
async function quitRoom() {
	console.log("quit room");
	if (socket)
		socket.close();
	socket = null;
	loadPage("no-room");
}

function	noRoom(content: HTMLElement) {
	content.innerHTML = `
		<button id="join-game">Join the Game</button>
	`
	document.getElementById("join-game").addEventListener("click", joinRoom);
}

function confirmGame() {
	console.log("Trying to confirm");

	content.innerHTML = `
		<p>Game Found, Confirm?</p>
		<button id="confirm-game">Confirm Game</button>
	`
	document.getElementById("confirm-game").addEventListener("click", () => {
		fetch('http://localhost:3000/api/pong/startConfirm', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ key: "Up", roomId: roomNumber, side: (player === "P1")? "left":"right" })
		})
	});
}

async function	joinRoom(this: HTMLElement, ev: MouseEvent): Promise<void> {
	loadPage("room-found");
	if (!socket)
		socket = new WebSocket("ws://localhost:3000/api/pong/joinRoom");

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

		// fetch('http://localhost:3000/api/pong/movePaddle', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({ key: "Up", roomId: roomNumber, side: "left" })
		// })
	}

	// socket.onclose = () => {
	// 	fetch('http://localhost:3000/api/pong/quitRoom').then();
	// }

// Listen for messages
	socket.addEventListener("message", (event: MessageEvent) => {

		// console.log("Message from server: ", event);
		// console.log("Message from server: ", event.data);

		let res: responseFormat = JSON.parse(event.data);

		// console.log(res);

		if (!res)
			return;
		if (res.type === 'INFO') {
			roomNumber = res.roomID;
			player = res.player;
			console.log(`Joined room: ${roomNumber} as player: ${player}`);
		} else if (res.type === "ALERT" || res.type === "ERROR" || res.type === "WARNING") {
			console.log("%c[" + res.type + "]%c : " + res.message, "color: red", "color: reset");
			alert(res.message);
		} else if (res.type === "CONFIRM") {
			confirmGame();
		} else if (res.type === "GAME") {
			// console.log(res.data);
			game = res.data;
			console.log(res.message)
			console.log(game);
			// if (res.message === "FINISH")
			// 	fetch();
			drawGame();
		}
	});
}

loadPage("no-room");

const canvas = document.getElementById("gameCanvas")  as HTMLCanvasElement;

// canvas.width = Constants.WIDTH;
// canvas.height = Constants.HEIGHT;

const c = canvas?.getContext("2d") as CanvasRenderingContext2D;


function gameLoop() {
	if (!game)
		return;
	while (!game.Over) {
		// socket.send(JSON.stringify({ key: "Up", roomId: roomNumber, side: (player === "P1")? "left":"right" }));
		// drawGame();
	}
}

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
