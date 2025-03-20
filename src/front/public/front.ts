// import * as Constants from "../../back/pong_app/server/constants";
import { responseFormat } from "../../back/api/pong/utils";
import { Game } from "../../back/pong_app/server/pong_game";

const	address = "10.12.6.3";

let		roomNumber = -1;
let		game : Game | null = null;
let		player : string | "P1" | "P2" | "SPEC" | null = null;
const	content = document.getElementById("content");
let		socket: WebSocket | null = null;
let		score = { player1: 0, player2: 0 };
let 	isSolo = false;
let		isButtonPressed = { "ArrowUp": false, "ArrowDown": false, "KeyS": false, "KeyX": false };
let		intervals = { "ArrowUp": null, "ArrowDown": null, "KeyS": null, "KeyX": null };
let		queueInterval: NodeJS.Timeout | null = null;

let		matchType: string = "";
let		isTournamentOwner: boolean = false;
let		tournamentId: number = -1;
let		tourPlacement: number = -1;
let		specPlacement: number = -1;

// canvas.width = Constants.WIDTH;
// canvas.height = Constants.HEIGHT;

async function loadPage(page: string) {
	switch (page) {
		case "no-room":
			noRoom(content);
			break ;
		case "room-found":
			room_found(content);
			break ;
	}
}

function	noRoom(content: HTMLElement) {
	content.innerHTML = `
		<button id="join-game">Join a Game</button>		
		<button id="join-solo-game">Create a solo Game</button>
		<button id="create-tournament">Create a tournament</button>
		<button id="join-tournament">Join a tournament</button>
		<button id="spectate">spectate</button>
	`;
	document.getElementById("join-game").addEventListener("click", joinMatchmaking);
	document.getElementById("join-solo-game").addEventListener("click", joinSolo);
	document.getElementById("create-tournament").addEventListener("click", getTournamentName);
	document.getElementById("join-tournament").addEventListener("click", listTournaments);
	document.getElementById("spectate").addEventListener("click", listRooms);
}

function	room_found(content: HTMLElement) {
	content.innerHTML= `
		<p>Room found!</p>
		<button id="quit-room">Quit Room</button>
	`;
	if (isTournamentOwner) {
		content.innerHTML += `
			<button id="start-tournament">Start Tournament</button>
			<button id="shuffle-tree">Shuffle Tree</button>
		`;
		document.getElementById("start-tournament").addEventListener("click", () => {
			fetch(`http://${address}:3000/api/pong/startTournament`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ tourId: tournamentId })
			}) });
		document.getElementById("shuffle-tree").addEventListener("click", shuffleTree);
	}
	document.getElementById("quit-room").addEventListener("click", (ev) => quitRoom("Leaving room"));
}

async function getRoomInfo(event) {
	const	roomId = (event.target as HTMLButtonElement).getAttribute('id');
	content.innerHTML = `
		<button id="roomLst">Return to Tournament List</button>
	`;

	fetch(`http://${address}:3000/api/pong/get_room_info?id=${roomId}`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText);
			}
			return response.json();
		})
		.then(data => {
			// const started = data.started;
			content.innerHTML += `
			<h1>Room Info:</h1>
			<h2>Room Number: ${roomId}</h2>
			<button id="spectate">Spectate Room</button>
			`
			// content.innerHTML += data.started === true?
			// 	`<p>The tournament as already started.</p>`:
			// 	`<p>The tournament hasn't started yet </p>
			// <p>Do you want to join ?</p>
			// <button id="joinTournament">Join the tournament</button>`
			// document.getElementById('tournamentLst').addEventListener("click", listTournaments);
			// if (!started) {
			// 	document.getElementById('joinTournament').addEventListener("click", () => {
			// 		joinTournament(Number(tournamentId))
			// 	});
			// }
			document.getElementById('roomLst').addEventListener("click", listTournaments);
			document.getElementById('spectate').addEventListener("click", () => {
				joinSpectate(Number(roomId))
			});
		});
}

async function listRooms() {
	fetch(`http://${address}:3000/api/pong/get_rooms`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText);
			}
			return response.json();
		})
		.then(data => {
			let listHTML = '<ul>';
			data.forEach(room => {
				listHTML += `
		  <li>
			<button class="room-button" id="${room.id}">
			  Room ID: ${room.id}, full: ${room.full}, solo: ${room.solo}
			</button>
		  </li>
		`;
			});
			listHTML += '</ul>';
			content.innerHTML = listHTML;

			// Add event listeners to the buttons
			document.querySelectorAll('.room-button').forEach(button => {
				button.addEventListener('click', getRoomInfo);
			});
		})
		.catch(error => {
			console.error('There was a problem with the fetch operation:', error);
		});
}

async function	joinSpectate(roomId: Number) {
	loadPage("room-found");
	isSolo = false;
	matchType = "PONG";
	player = "SPEC";
	if (!socket)
		socket = new WebSocket(`ws://${address}:3000/api/pong/addSpectatorToRoom?id=${roomId}`); // TODO : add room id

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

async function	joinMatchmaking() {
	loadPage("room-found");
	isSolo = false;
	matchType = "PONG";
	if (!socket)
		socket = new WebSocket(`ws://${address}:3000/api/pong/joinMatchmaking`);

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
	isSolo = true;
	matchType = "PONG";
	if (!socket)
		socket = new WebSocket(`ws://${address}:3000/api/pong/joinSolo`);

	socket.addEventListener("error", (error) => {
		console.error(error);
	})
	// Connection opened
	socket.onopen = () => {
		console.log("Connected to the server for solo game");
	};

	socket.onclose = () => {
		console.log("Connection closed");
		if (roomNumber >= 0)
			quitRoom();
	};
	// Listen for messages
	socket.addEventListener("message", messageHandler);
}

async function	getTournamentName() {
	content.innerHTML = `
		<p>Enter the name of the tournament</p>
		<form>
			<input type="text" id="tournamentName" placeholder="Tournament Name">
			<button id="submitTournamentName">Submit</button>
		</form>
	`
	document.getElementById("submitTournamentName").addEventListener("click", () => {
		const name = (document.getElementById("tournamentName") as HTMLInputElement).value;
		createTournament(name);
	});
}

async function	createTournament(name: string) {
	isSolo = false;
	isTournamentOwner = true;
	matchType = "TOURNAMENT";
	loadPage("room-found");
	if (!socket)
		socket = new WebSocket(`ws://${address}:3000/api/pong/createTournament?name=${name}`);

	socket.addEventListener("error", (error) => {
		console.error(error);
	})
	// Connection opened
	socket.onopen = () => {
		console.log("Created a tournament");
	}
	socket.onclose = () => {
		console.log("Connection closed");
		if (tournamentId >= 0)
			quitRoom();
	}
	// Listen for messages
	socket.addEventListener("message", messageHandler);
}

function getTournamentInfo(event){
	const	tournamentId = (event.target as HTMLButtonElement).getAttribute('id');
	content.innerHTML = `
		<button id="tournamentLst">Return to Tournament List</button>
	`;

	fetch(`http://${address}:3000/api/pong/get_tournament_info?id=${tournamentId}`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText);
			}
			return response.json();
		})
		.then(data => {
			const started = data.started;
			content.innerHTML += `
			<h1>Tournament Info:</h1>
			<h2>Tournament Number: ${tournamentId}</h2>
		`
			content.innerHTML += data.started === true?
				`<p>The tournament as already started.</p>`:
				`<p>The tournament hasn't started yet </p>
			<p>Do you want to join ?</p>
			<button id="joinTournament">Join the tournament</button>`
			document.getElementById('tournamentLst').addEventListener("click", listTournaments);
			if (!started) {
				document.getElementById('joinTournament').addEventListener("click", () => {
					joinTournament(Number(tournamentId))
				});
			}
		});
}

async function	listTournaments() {
	fetch(`http://${address}:3000/api/pong/get_tournaments`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText);
			}
			return response.json();
		})
		.then(data => {
			let listHTML = '<ul>';
			data.forEach(tournament => {
				listHTML += `
		  <li>
			<button class="tournament-button" id="${tournament.id}">
			  Tournament ID: ${tournament.id}, Started: ${tournament.started}
			</button>
		  </li>
		`;
			});
			listHTML += '</ul>';
			content.innerHTML = listHTML;

			// Add event listeners to the buttons
			document.querySelectorAll('.tournament-button').forEach(button => {
				button.addEventListener('click', getTournamentInfo);
			});
		})
		.catch(error => {
			console.error('There was a problem with the fetch operation:', error);
		});
}

async function	joinTournament(tournamentId: number) {
	isSolo = false;
	isTournamentOwner = false;
	matchType = "TOURNAMENT";

	if (!socket)
		socket = new WebSocket(`ws://${address}:3000/api/pong/joinTournament?id=${tournamentId}`);

	socket.addEventListener("error", (error) => {
		console.error(error);
	})
	// Connection opened
	socket.onopen = () => {
		console.log("Trying to join a tournament");
	}
	socket.onclose = () => {
		console.log("Connection closed");
		if (tournamentId >= 0)
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
	fetch(`http://${address}:3000/api/pong/quitRoom`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ matchType: matchType, message: msg, tourId: tournamentId, roomId: roomNumber, P: player, tourPlacement: tourPlacement, specPlacement: specPlacement })
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
			return ;
		case "LEAVE":
			quitRoom();
			if (res.message === "QUEUE_AGAIN" || queueInterval) {
				console.log("The opponent took too long to confirm the game. Restarting the search");
				if (res.data === "PONG")
					joinMatchmaking();
			}
			clearInterval(queueInterval);
			queueInterval = null;
			break ;
		case "TOURNAMENT":
			tournamentMessageHandler(res);
			break ;
		case "GAME":
			gameMessageHandler(res);
			break ;
		default:
			console.log("Unknown message type: " + res.type);
	}
}

function tournamentMessageHandler(res: responseFormat) {
	switch (res.message) {
		case "OWNER":
			isTournamentOwner = true;
			console.log("You are the owner of the tournament");
			loadPage("room-found");
			break ;
		case "PREP":
			tournamentId = res.tourId;
			tourPlacement = res.tourPlacement;
			console.log("Joined tournament: " + tournamentId + " as player: " + tourPlacement);
			loadPage("room-found");
			break ;
		case "LEAVE":
			quitRoom();
			break ;
	}
}

function gameMessageHandler(res: responseFormat) {
	switch (res.message) {
		case "PREP":
			roomNumber = res.roomId;
			player = res.player;
			console.log("Joined room: " + roomNumber + " as player: " + player);
			break ;
		case "START":
			content.innerHTML = `
				<canvas id="gameCanvas" width="800" height="400"></canvas>
			`;
			document.addEventListener("keydown", keyHandler);
			document.addEventListener("keyup", keyHandler);
			break ;
		case "FINISH":
			if (player === "SPEC")
				return ;
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
		case "SPEC":
			console.log("Starting Spectator mode");
			content.innerHTML = `
				<canvas id="gameCanvas" width="800" height="400"></canvas>
			`;
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
		const paddle = p === "P1" ? game.paddle1 : game.paddle2;
		if (key !== "ArrowUp" && key !== "ArrowDown" && key !== "KeyS" && key !== "KeyX")
			return ;
		let direction = "";
		if (key === "ArrowUp" || key === "ArrowDown")
			direction = key === "ArrowUp" ? "up" : "down";
		if (isSolo && (key === "KeyS" || key === "KeyX"))
			direction = key === "KeyS" ? "up" : "down";

		// TODO : replace with Constants
		if (direction === "" || (direction === "up" &&  paddle.y <= 0) || (direction === "down" && paddle.y >= 400 - 80))
			return;
		fetch(`http://${address}:3000/api/pong/movePaddle`, {
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

function shuffleTree() {
	fetch(`http://${address}:3000/api/pong/shuffleTree`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ tourId: tournamentId })
	});
}

function confirmGame() {

	content.innerHTML = `
    <p>Game Found, Confirm?</p>
    <button id="confirm-game">Confirm Game</button>
    <p id="timer">Time remaining: 10s</p>
	`;

	let remainingTime = 10;
	queueInterval = setInterval(() => {
		remainingTime--;
		if (document.getElementById("timer"))
			document.getElementById("timer").innerText = `Time remaining: ${remainingTime}s`;
		if (remainingTime <= 0) {
			clearInterval(queueInterval);
			quitRoom("QUEUE_TIMEOUT");
		}
	}, 1000);
	document.getElementById("confirm-game").addEventListener("click", () => {
		clearInterval(queueInterval);
		document.getElementById("timer").innerText = "Confirmed! Awaiting opponent";
		fetch(`http://${address}:3000/api/pong/startConfirm`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ roomId: roomNumber, P: player })
		})
	});
}

loadPage("no-room");

function drawGame() {
	const canvas = document.getElementById("gameCanvas")  as HTMLCanvasElement;
	const c = canvas?.getContext("2d") as CanvasRenderingContext2D;

	if (!c || !game)
		return;
	c.clearRect(0, 0, canvas.width, canvas.height);

	// Draw ball
	c.fillStyle = "white";
	c.beginPath();
	c.arc(game.ball.x, game.ball.y, game.ball.size, 0, Math.PI * 2);
	c.fill();

	// Draw paddles
	c.fillRect(game.paddle1.x, game.paddle1.y, game.paddle1.x_size, game.paddle1.y_size); // Left Paddle
	c.fillRect(game.paddle2.x, game.paddle2.y, game.paddle2.x_size, game.paddle2.y_size); // Right Paddle
}
