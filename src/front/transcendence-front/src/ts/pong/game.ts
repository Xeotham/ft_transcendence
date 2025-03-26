import  { Game, score, buttons, intervals, responseFormat } from "../utils.ts";
import  { address, content } from "../main.ts";
import  { loadPongHtml, drawGame, idlePage, matchFound, gameInfo } from "./pong.ts";
import  { tourMessageHandler } from "./tournament.ts";

export class PongRoom {
	private roomNumber: number;
	private game: Game | null;
	private player: string | "P1" | "P2" | "SPEC" | null;
	private socket: WebSocket | null;
	private score: score;
	private isSolo: boolean;
	private isButtonPressed: buttons;
	private intervals: intervals;
	private queueInterval: number | null;
	private specPlacement: number;


	constructor(socket: WebSocket, isSolo: boolean = false) {
		this.roomNumber = -1;
		this.game = null;
		this.player = null;
		this.socket = socket;
		this.score = { player1: 0, player2: 0 };
		this.isSolo = isSolo;
		this.isButtonPressed = { "ArrowUp": false, "ArrowDown": false, "KeyS": false, "KeyX": false };
		this.intervals = { "ArrowUp": null, "ArrowDown": null, "KeyS": null, "KeyX": null };
		this.queueInterval = null;
		this.specPlacement = -1;
	}
	// Getters
	getRoomNumber(): number { return this.roomNumber; }
	getGame(): Game | null { return this.game; }
	getPlayer(): string | null { return this.player; }
	getSocket(): WebSocket | null { return this.socket; }
	getScore(): score { return this.score; }
	getIsSolo(): boolean { return this.isSolo; }
	getQueueInterval(): number | null { return this.queueInterval; }
	getMatchType(): string { return "PONG"; }
	getSpecPlacement(): number { return this.specPlacement; }
	getIsButtonPressed(idx: string): boolean | undefined {
		switch (idx) {
			case "ArrowUp":
				return this.isButtonPressed.ArrowUp;
			case "ArrowDown":
				return this.isButtonPressed.ArrowDown;
			case "KeyS":
				return this.isButtonPressed.KeyS;
			case "KeyX":
				return this.isButtonPressed.KeyX;
			default:
				return undefined;
		}
	}
	getIntervals(idx: string): number | null | undefined {
		switch (idx) {
			case "ArrowUp":
				return this.intervals.ArrowUp;
			case "ArrowDown":
				return this.intervals.ArrowDown;
			case "KeyS":
				return this.intervals.KeyS;
			case "KeyX":
				return this.intervals.KeyX;
			default:
				return undefined;
		}
	}

	// Setters
	setRoomNumber(roomNumber: number): void { this.roomNumber = roomNumber; }
	setGame(game: Game | null): void { this.game = game; }
	setPlayer(player: string | "P1" | "P2" | "SPEC" | null): void { this.player = player; }
	setSocket(socket: WebSocket | null): void { this.socket = socket; }
	setScore(score: score): void { this.score = score; }
	setIsSolo(isSolo: boolean): void { this.isSolo = isSolo; }
	setQueueInterval(queueInterval: number | null): void { this.queueInterval = queueInterval; }
	setSpecPlacement(specPlacement: number): void { this.specPlacement = specPlacement; }
	setButtonPressed(idx: string, value: boolean): void {
		switch (idx) {
			case "ArrowUp":
				this.isButtonPressed.ArrowUp = value;
				return ;
			case "ArrowDown":
				this.isButtonPressed.ArrowDown = value;
				return ;
			case "KeyS":
				this.isButtonPressed.KeyS = value;
				return ;
			case "KeyX":
				this.isButtonPressed.KeyX = value;
				return ;
		}
	}
	setIntervals(idx: string, value: number | null): void {
		switch (idx) {
			case "ArrowUp":
				this.intervals.ArrowUp = value;
				return ;
			case "ArrowDown":
				this.intervals.ArrowDown = value;
				return ;
			case "KeyS":
				this.intervals.KeyS = value;
				return ;
			case "KeyX":
				this.intervals.KeyX = value;
				return ;
		}
	}
	clearIntervals() {
		clearInterval(this.queueInterval as number);
		this.queueInterval = null;
		clearInterval(this.intervals["ArrowUp"] as number);
		this.intervals["ArrowUp"] = null;
		clearInterval(this.intervals["ArrowDown"] as number);
		this.intervals["ArrowDown"] = null;
		clearInterval(this.intervals["KeyS"] as number);
		this.intervals["KeyS"] = null;
		clearInterval(this.intervals["KeyX"] as number);
		this.intervals["KeyX"] = null;
	}

	// Methods
	initSocket() {
		if (!this.socket)
			return ;
		this.socket.addEventListener("error", (error) => {
			console.error(error);
		});
		this.socket.onopen = () => {
			console.log("Connected to the server");
		};
		this.socket.onclose = () => {
			console.log("Connection closed");
			if (this.roomNumber >= 0)
				quitRoom();
		};
		this.socket.addEventListener("message", messageHandler);
	}

	prepareGame(roomId: number, player: string | null) {
		this.setRoomNumber(roomId);
		this.setPlayer(player);
		console.log("Joined room: " + roomId + " as player: " + player);
	}
}

export const   joinMatchmaking = async () => {
	const   socket = new WebSocket(`ws://${address}:3000/api/pong/joinMatchmaking`);

	gameInfo.setRoom(new PongRoom(socket));
	gameInfo.getRoom()?.initSocket();
	matchFound();
}

export const   joinSolo = async () => {
	const   socket = new WebSocket(`ws://${address}:3000/api/pong/joinSolo`);

	gameInfo.setRoom(new PongRoom(socket, true));
	gameInfo.getRoom()?.initSocket();
}

export const   quitRoom = (msg: string = "Leaving room") => {
	const   matchType = gameInfo?.getMatchType();
	const   roomId = gameInfo.getRoom()?.getRoomNumber();
	const   player = gameInfo.getRoom()?.getPlayer();

	if (gameInfo.getRoom()?.getIsSolo())
		msg = "Leaving room";
	if (msg === "QUEUE_TIMEOUT")
		console.log("You took too long to confirm the game. Back to the lobby");
	fetch(`http://${address}:3000/api/pong/quitRoom`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ matchType: matchType, message: msg, tourId: -1, roomId: roomId, P: player, tourPlacement: -1, specPlacement: -1 })
	});
	gameInfo.getRoom()?.clearIntervals();
	if (gameInfo?.getRoom()?.getSocket())
		gameInfo?.getRoom()?.getSocket()?.close();
	gameInfo.resetRoom();
	idlePage();
}


export const   messageHandler = (event: MessageEvent)=> {
	let res: responseFormat = JSON.parse(event.data);

	if (!res)
		return;
	switch (res.type) {
		case 'INFO':
			console.log("%c[INFO]%c : " + res.message, "color: green", "color: reset");
			if (res.data)
				console.log("data: " + res.data);
			return ;
		case "ALERT":
			alert(res.message);
			return console.log("%c[" + res.type + "]%c : " + res.message, "color: red", "color: reset");
		case "ERROR":
			//fallthrough
		case "WARNING":
			return console.log("%c[" + res.type + "]%c : " + res.message, "color: red", "color: reset");
		case "CONFIRM":
			return confirmGame();
		case "LEAVE":
			quitRoom();
			if (res.message === "QUEUE_AGAIN" || gameInfo?.getRoom()?.getQueueInterval()) {
				console.log("The opponent took too long to confirm the game. Restarting the search");
				if (res.data === "PONG")
					joinMatchmaking();
			}
			clearInterval(gameInfo?.getRoom()?.getQueueInterval() as number);
			return gameInfo?.getRoom()?.setQueueInterval(null);
		case "GAME":
			return gameMessageHandler(res);
		case "TOURNAMENT":
			return tourMessageHandler(res);
		default:
			console.log("Unknown message type: " + res.type);
	}
}

const	gameMessageHandler = (res: responseFormat) => {
	if (!content)
		return ;

	switch (res.message) {
		case "PREP":
			const   roomNumber: number = typeof res.roomId === "number" ? res.roomId : -1;
			const   player: string | null = res.player;

			return  gameInfo?.getRoom()?.prepareGame(roomNumber, player);
		case "START":
			loadPongHtml("board");
			if (gameInfo?.getRoom()?.getPlayer() === "SPEC")
				return ;
			document.getElementById("quit")?.addEventListener("click", () => quitRoom());
			document.addEventListener("keydown", keyHandler);
			document.addEventListener("keyup", keyHandler);
			return ;
		case "FINISH":
			if (gameInfo?.getRoom()?.getPlayer() === "SPEC")
				return quitRoom();
			if (gameInfo?.getRoom()?.getIsSolo())
				alert(res.data + " won!");
			else
				res.data === gameInfo?.getRoom()?.getPlayer() ? alert("You won!") : alert("You lost!");
			document.removeEventListener("keydown", keyHandler);
			document.removeEventListener("keyup", keyHandler);
			return quitRoom();
		case "SCORE":
			const   score: score = res.data;
			gameInfo?.getRoom()?.setScore(score);
			console.log("%c[Score]%c : " + score.player1 + " - " + score.player2, "color: purple", "color: reset");
			//  TODO : display score on screen
			return ;
		case "SPEC":
			console.log("Starting Spectator mode");
			loadPongHtml("board");
			return document.getElementById("quit")?.addEventListener("click", () => quitRoom());
		default:
			gameInfo?.getRoom()?.setGame(res.data);
			drawGame(res.data);
	}
}


export const keyHandler = (event: KeyboardEvent) => {
	const   game = gameInfo?.getRoom()?.getGame();
	const   roomNumber = gameInfo?.getRoom()?.getRoomNumber() as number;
	const   player = gameInfo?.getRoom()?.getPlayer();
	const   isSolo = gameInfo?.getRoom()?.getIsSolo();

	if (!game || roomNumber < 0 || !player || event.repeat)
		return ;
	// console.log("event type:" + event.type + ", Key pressed: " + event.code);

	async function sendPaddleMovement(key: string, p: string) {
		if (!game)
			return ;
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
		})
			// .then(response => response.json())
			// .then(data => console.log(data))
			// .catch(error => console.error('Error:', error));
	}

	let p = player;
	if (isSolo)
		p = event.code === "KeyS" || event.code === "KeyX" ? "P1" : "P2";
	if (event.type === "keydown" && gameInfo?.getRoom()?.getIsButtonPressed(event.code) === false) {
		gameInfo.getRoom()?.setButtonPressed(event.code, true);
		gameInfo.getRoom()?.setIntervals(event.code, setInterval(sendPaddleMovement, 1000 / 60, event.code, p));
	}
	if (event.type === "keyup" && gameInfo.getRoom()?.getIsButtonPressed(event.code) === true) {
		gameInfo.getRoom()?.setButtonPressed(event.code, false);
		clearInterval(gameInfo.getRoom()?.getIntervals(event.code) as number);
		gameInfo.getRoom()?.setIntervals(event.code, null);
	}
}

const   confirmGame = () => {
	loadPongHtml("confirm")

	let remainingTime = 10;
	gameInfo.getRoom()?.setQueueInterval(setInterval(() => {
		remainingTime--;
		if (document.getElementById("timer"))
			document.getElementById("timer")!.innerText = `Time remaining: ${remainingTime}s`;
		if (remainingTime <= 0) {
			clearInterval(gameInfo.getRoom()?.getQueueInterval() as number);
			quitRoom("QUEUE_TIMEOUT");
		}
	}, 1000));
	document.getElementById("confirm-game")?.addEventListener("click", () => {
		clearInterval(gameInfo.getRoom()?.getQueueInterval() as number);
		document.getElementById("timer")!.innerText = "Confirmed! Awaiting opponent";
		fetch(`http://${address}:3000/api/pong/startConfirm`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ roomId: gameInfo.getRoom()?.getRoomNumber(), P: gameInfo.getRoom()?.getPlayer() })
		})
			// .then(response => response.json())
			// .then(data => console.log(data))
			// .catch(error => console.error('Error:', error));
	});
}