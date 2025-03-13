// import * as Constants from "../../back/pong_app/server/constants";
import { responseFormat } from "../../back/api/pong/controllers";
import { Game } from "../../back/pong_app/server/pong_game";

let		roomNumber = -1;
let		game : Game | null = null;
let		player : string | "P1" | "P2" | null = null;
const	content = document.getElementById("content");
let		socket: WebSocket | null = null;
let		score = { player1: 0, player2: 0 };
let		isButtonPressed = { up: false, down: false };
let		intervalIdUp: NodeJS.Timeout | null = null;
let		intervalIdDown: NodeJS.Timeout | null = null;

// canvas.width = Constants.WIDTH;
// canvas.height = Constants.HEIGHT;

async function loadPage(page: string) {
	if (page === "no-room") {
		noRoom(content)
	}
	else if (page === "room-found") {
		room_found(content)
	}
}

function	noRoom(content: HTMLElement) {
	content.innerHTML = `
		<button id="join-game">Join the Game</button>
	`
	document.getElementById("join-game").addEventListener("click", joinRoom);
}

function	room_found(content: HTMLElement) {
	content.innerHTML= `
		<p>Room found!</p>
		<button id="quit-room">Quit Room</button>
	`
	document.getElementById("quit-room").addEventListener("click", quitRoom)
}

async function quitRoom() {
	console.log("quit room");
	fetch('http://localhost:3000/api/pong/quitRoom').then();
	if (socket)
		socket.close();
	socket = null;
	loadPage("no-room");
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
	}

	socket.onclose = () => {
		console.log("Connection closed");
	}

	// Listen for messages
	socket.addEventListener("message", messageHandler);
}

function messageHandler(event: MessageEvent) {
	let res: responseFormat = JSON.parse(event.data);

	if (!res)
		return;
	if (res.type === 'INFO') {
		console.log("%c[INFO]%c : " + res.message, "color: green", "color: reset");
		if (res.data)
			console.log("data: " + res.data);
 	}
	else if (res.type === "ALERT" || res.type === "ERROR" || res.type === "WARNING") {
		console.log("%c[" + res.type + "]%c : " + res.message, "color: red", "color: reset");
		if (res.type === "ALERT")
		alert(res.message);
	}
	else if (res.type === "CONFIRM") {
		confirmGame();
	}
	else if (res.type === "GAME") {
		if (res.message === "PREP") {
			roomNumber = res.roomID === null ? roomNumber : res.roomID;
			player = res.player === null ? player : res.player;
			console.log("Joined room: " + roomNumber + " as player: " + player);
			return ;
		}
		if (res.message === "START") {
			document.addEventListener("keydown", keyHandler);
			document.addEventListener("keyup", keyHandler);
			return ;
		}
		if (res.message === "FINISH")  {
			document.removeEventListener("keydown", keyHandler);
			document.removeEventListener("keyup", keyHandler);
			return ;
		}
		if (res.message === "SCORE") {
			score = res.data;
			console.log("Score: " + score.player1 + " - " + score.player2);
			return ;
		}
		game = res.data;
		drawGame();
	}
}

function keyHandler(event: KeyboardEvent) {
	if (!game || roomNumber < 0 || !player || event.repeat)
		return ;
	// console.log("event type:" + event.type + ", Key pressed: " + event.code);

	async function sendPaddleMovement(key: string) {
		const paddle = player === "P1" ? game.Paddle1 : game.Paddle2;
		// TODO : replace with Constants
		if ((key === "ArrowUp" &&  paddle.y <= 0) || (key === "ArrowDown" && paddle.y >= 400 - 80))
			return;

		fetch('http://localhost:3000/api/pong/movePaddle', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({roomId: roomNumber, P: player, key: key})
		});
	}

	if (event.code === "ArrowUp") {
		// console.log("isButtonPressed.up : " + isButtonPressed.up);
		if (event.type === "keydown" && isButtonPressed.up === false) {
			isButtonPressed.up = true;
			// console.log("Before setInterval");
			intervalIdUp = setInterval(sendPaddleMovement, 1000 / 60, "ArrowUp");
		}
		else if (event.type === "keyup" && isButtonPressed.up === true) {
			isButtonPressed.up = false;
			// console.log("Before clearInterval");
			if (intervalIdUp)
				clearInterval(intervalIdUp);
			intervalIdUp = null;
		}
	}
	if (event.code === "ArrowDown") {
		// console.log("isButtonPressed.up : " + isButtonPressed.up);
		if (event.type === "keydown" && isButtonPressed.down === false) {
			isButtonPressed.down = true;
			// console.log("Before setInterval");
			intervalIdDown = setInterval(sendPaddleMovement, 1000 / 60, "ArrowDown");
		}
		else if (event.type === "keyup" && isButtonPressed.down === true) {
			isButtonPressed.down = false;
			// console.log("Before clearInterval");
			if (intervalIdDown)
				clearInterval(intervalIdDown);
			intervalIdDown = null;
		}
	}
}

function confirmGame() {

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
			body: JSON.stringify({ roomId: roomNumber, P: player })
		})
	});
}

loadPage("no-room");

const canvas = document.getElementById("gameCanvas")  as HTMLCanvasElement;

const c = canvas?.getContext("2d") as CanvasRenderingContext2D;

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
