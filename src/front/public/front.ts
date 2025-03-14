// import * as Constants from "../../back/pong_app/server/constants";
import { responseFormat } from "../../back/api/pong/controllers";
import { Game } from "../../back/pong_app/server/pong_game";

let		roomNumber = -1;
let		game : Game | null = null;
let		player : string | "P1" | "P2" | null = null;
const	content = document.getElementById("content");
let		socket: WebSocket | null = null;
let		score = { player1: 0, player2: 0 };
let 	isSolo = false;
let		isButtonPressed = { "ArrowUp": false, "ArrowDown": false, "KeyS": false, "KeyX": false };
let		intervals = { "ArrowUp": null, "ArrowDown": null, "KeyS": null, "KeyX": null };

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
		<button id="join-game">Join a Game</button>		
		<button id="join-solo-game">Create a solo Game</button>
	`
	document.getElementById("join-game").addEventListener("click", joinMatchmaking);
	document.getElementById("join-solo-game").addEventListener("click", joinSolo);
	c?.clearRect(0, 0, canvas.width, canvas.height);
}

function	room_found(content: HTMLElement) {
	content.innerHTML= `
		<p>Room found!</p>
		<button id="quit-room">Quit Room</button>
	`
	document.getElementById("quit-room").addEventListener("click", (ev) => quitRoom("Leaving room"));
}

async function	joinMatchmaking() {
	loadPage("room-found");
	if (!socket)
		socket = new WebSocket("ws://localhost:3000/api/pong/joinMatchmaking");

	socket.addEventListener("error", (error) => {
		console.error(error);
	})
	// Connection opened
	socket.onopen = () => {
		console.log("Connected to the server");
	}
	socket.onclose = () => {
		console.log("Connection closed");
		if (roomNumber >= 0)
			quitRoom();
	}
	// Listen for messages
	socket.addEventListener("message", messageHandler);
}

async function	joinSolo() {
	// loadPage("room-found");
	isSolo = true;
	if (!socket)
		socket = new WebSocket("ws://localhost:3000/api/pong/joinSolo");

	socket.addEventListener("error", (error) => {
		console.error(error);
	})
	// Connection opened
	socket.onopen = () => {
		console.log("Connected to the server for solo game");
	}
	socket.onclose = () => {
		console.log("Connection closed");
		if (roomNumber >= 0)
			quitRoom();
	}
	// Listen for messages
	socket.addEventListener("message", messageHandler);
}

function quitRoom(msg: string = "Leaving room") {
	if (isSolo)
		msg = "Leaving room";
	if (msg === "QUEUE_TIMEOUT")
		console.log("You took too long to confirm the game. Back to the lobby");
	fetch('http://localhost:3000/api/pong/quitRoom', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ message: msg, roomId: roomNumber, P: player })
	});
	if (socket)
		socket.close();
	socket = null;
	roomNumber = -1;
	player = null;
	loadPage("no-room");
}

function messageHandler(event: MessageEvent) {
	let res: responseFormat = JSON.parse(event.data);

	if (!res)
		return;
	switch (res.type) {
		case 'INFO':
			console.log("%c[INFO]%c : " + res.message, "color: green", "color: reset");
			if (res.data)
				console.log("data: " + res.data);
			break ;
		case "ALERT":
			alert(res.message);
			// fallthrough
		case "ERROR":
			// fallthrough
		case "WARNING":
			console.log("%c[" + res.type + "]%c : " + res.message, "color: red", "color: reset");
			break ;
		case "CONFIRM":
			confirmGame();
			break ;
		case "LEAVE":
			quitRoom();
			if (res.message === "QUEUE_AGAIN") {
				console.log("The opponent took too long to confirm the game. Restarting the search");
				joinMatchmaking();
			}
			break ;
		case "GAME":
			gameMessageHandler(res);
			break ;
		default:
			console.log("Unknown message type: " + res.type);
	}
}

function gameMessageHandler(res: responseFormat) {
	switch (res.message) {
		case "PREP":
			roomNumber = res.roomID === null ? roomNumber : res.roomID;
			player = res.player === null ? player : res.player;
			console.log("Joined room: " + roomNumber + " as player: " + player);
			break ;
		case "START":
			document.getElementById("content").innerHTML = "";
			document.addEventListener("keydown", keyHandler);
			document.addEventListener("keyup", keyHandler);
			break ;
		case "FINISH":
			if (isSolo)
				alert(res.data + " won!");
			else
				res.data === player ? alert("You won!") : alert("You lost!");
			document.removeEventListener("keydown", keyHandler);
			document.removeEventListener("keyup", keyHandler);
			quitRoom();
			break ;
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

function keyHandler(event: KeyboardEvent) {
	if (!game || roomNumber < 0 || !player || event.repeat)
		return ;
	// console.log("event type:" + event.type + ", Key pressed: " + event.code);

	async function sendPaddleMovement(key: string, p: string) {
		const paddle = p === "P1" ? game.Paddle1 : game.Paddle2;
		let direction = key === "ArrowUp" ? "up" : "down";
		if (isSolo && (key === "KeyS" || key === "KeyX"))
			direction = key === "KeyS" ? "up" : "down";

		// TODO : replace with Constants
		if ((direction === "up" &&  paddle.y <= 0) || (direction === "down" && paddle.y >= 400 - 80))
			return;
		fetch('http://localhost:3000/api/pong/movePaddle', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({roomId: roomNumber, P: p, key: direction})
		});
	}
	let p = player;
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

	content.innerHTML = `
    <p>Game Found, Confirm?</p>
    <button id="confirm-game">Confirm Game</button>
    <p id="timer">Time remaining: 10s</p>
	`;

	let remainingTime = 10;
	const timerInterval = setInterval(() => {
		remainingTime--;
		if (document.getElementById("timer"))
			document.getElementById("timer").innerText = `Time remaining: ${remainingTime}s`;
		if (remainingTime <= 0) {
			clearInterval(timerInterval);
			quitRoom("QUEUE_TIMEOUT");
		}
	}, 1000);
	document.getElementById("confirm-game").addEventListener("click", () => {
		clearInterval(timerInterval);
		document.getElementById("timer").innerText = "Confirmed! Awaiting opponent";
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
