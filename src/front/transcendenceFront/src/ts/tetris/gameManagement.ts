import { loadTetrisHtml } from "./htmlPage.ts";
import { roomInfo, tetrisRes, TimeoutKey} from "./utils.ts";
import { loadTetrisPage, tetrisGameInfo, userKeys } from "./tetris.ts";
import { address } from "../main.ts";
import { postToApi } from "../utils.ts";
// @ts-ignore
import page from "page";

let socket: WebSocket | null = null;
export const username = localStorage.getItem("username");

const socketInit = (socket: WebSocket) => {
	tetrisGameInfo.setSocket(socket);
	socket.onmessage = messageHandler;
	socket.onerror = err => { console.error("Error:", err) };
	socket.onopen = () => { console.log("Connected to server") };
	socket.onclose = (event) => {
		if (event.wasClean)
			console.log('WebSocket connection closed cleanly.');
		else
			console.error('WebSocket connection died. Code:', event.code, 'Reason:', event.reason);
		postToApi(`http://${address}/api/tetris/quitRoom`, { argument: "quit", gameId: tetrisGameInfo.getGameId(),
			username: username, roomCode: tetrisGameInfo.getRoomCode() });
		tetrisGameInfo.setGameId(-1);
		tetrisGameInfo.setGame(null);
		tetrisGameInfo.setSocket(null);
		tetrisGameInfo.setRoomOwner(false);
		console.log("Leaving room : " + tetrisGameInfo.getRoomCode());
		tetrisGameInfo.setRoomCode("");
	};
}

export const resetSocket = () => {

	tetrisGameInfo.getSocket()?.close();
	tetrisGameInfo.setSocket(null);
	tetrisGameInfo.setGameId(-1);
	tetrisGameInfo.setGame(null);
	tetrisGameInfo.getKeyTimeout("moveLeft")?.clear();
	tetrisGameInfo.getKeyTimeout("moveRight")?.clear();
	tetrisGameInfo.setKeyTimeout("moveLeft", null);
	tetrisGameInfo.setKeyTimeout("moveRight", null);
	tetrisGameInfo.setKeyFirstMove("moveLeft", true);
	tetrisGameInfo.setKeyFirstMove("moveRight", true);
	gameControllers(true);
}

export const    searchGame = () => {
}

export const    arcadeGame = () => {
	// console.log("arcadeGame");
	socket = new WebSocket(`ws://${address}/api/tetris/arcade`);

	socketInit(socket);
	tetrisGameInfo.setSocket(socket);
	loadTetrisHtml("board");
	window.addEventListener("beforeunload", () => {
		postToApi(`http://${address}/api/tetris/forfeit`, { argument: "forfeit", gameId: tetrisGameInfo.getGameId() });
		if (tetrisGameInfo.getSocket()) {
			tetrisGameInfo.getSocket()?.close();
		}
	})
	// gameControllers();
}

export const createRoom = () => {
	console.log("createRoom");

	socket = new WebSocket(`ws://${address}/api/tetris/createRoom?username=${username}`);
	socketInit(socket);
	tetrisGameInfo.setRoomOwner(true);
}

export const getMultiplayerRooms = () => {
	fetch(`http://${address}/api/tetris/getMultiplayerRooms`, {
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
		.then((data: roomInfo[]) => {
			loadTetrisPage("display-multiplayer-room", {rooms: data});
		})
		.catch(error => { alert(error); });
}

export const joinRoom = (roomCode: string) => {
	console.log("Joining room: " + roomCode);
	socket = new WebSocket(`ws://${address}/api/tetris/joinRoom?code=${roomCode}&username=${username}`);
	socketInit(socket);
}

export const startRoom = () => {
	if (!tetrisGameInfo.getRoomOwner())
		return console.log("You are not the owner of the room");
	if (tetrisGameInfo.getNeedSave())
		return console.log("Need to save the game before starting the room");
	postToApi(`http://${address}/api/tetris/roomCommand`, { argument: "start", gameId: 0, roomCode: tetrisGameInfo.getRoomCode() });
}

const   messageHandler = (event: MessageEvent)=> {
	let res: tetrisRes = JSON.parse(event.data);

	if (!res)
		return;
	switch (res.type) {
		case 'SOLO':
			console.log("SOLO");
			tetrisGameInfo.setGame(res.game);
			console.log("Game: ", res.game);
			tetrisGameInfo.setGameId(res.game.gameId);
			loadTetrisHtml("board");
			loadTetrisPage("board");
			gameControllers();
			return ;
		case 'MULTIPLAYER_JOIN':
			if (res.argument === "OWNER") {
				console.log("MULTIPLAYER_OWNER");
				tetrisGameInfo.setRoomOwner(true);
			}
			else {
				console.log("MULTIPLAYER_JOIN");
				tetrisGameInfo.setRoomCode(res.argument);
				page.show(`/tetris/room:${res.argument}`);
			}
			loadTetrisPage("multiplayer-room", {rooms:[{roomCode: tetrisGameInfo.getRoomCode()}]});
			// loadTetrisPage("multiplayer-room");
			return ;
		case 'INFO':
			console.log("INFO: " + res.argument);
			return ;
		case "GAME":
			tetrisGameInfo.setGame(res.game);
			loadTetrisPage("board");
			return ;
		case "SPECIAL_LOCK":
			console.log("Special Lock: " + res.argument);
			return ;
		case "SPIN":
			console.log("Spin: " + res.argument);
			return;
		case "B2B":
			if (res.argument === "break")
				console.log("B2B Break");
			else
				console.log("B2B: " + res.argument);
			return;
		case "COMBO":
			if (res.argument === "break")
				console.log("Combo Break");
			else
				console.log("Combo: " + res.argument);
			return;
		case "STATS":
			console.log("Stats: " + JSON.stringify(res.argument));
			return;
		case "MULTIPLAYER_FINISH":
			console.log("The multiplayer game has finished. You ended up at place " + res.argument);
			return ;
		case "FINISH":
			console.log("Game Over");
			resetSocket();
			gameControllers(true);
			return ;
		default:
			console.log("Unknown message type: " + res.type);
	}
}

// TODO: Need to make the timeout pause when the opposite key is pressed ( https://stackoverflow.com/questions/3969475/javascript-pause-settimeout )

const   movePiece = (direction: string) => {
	const   arg = direction === "moveLeft" ? "left" : "right";
	const   opposite = direction === "moveLeft" ? "moveRight" : "moveLeft";

	if (tetrisGameInfo.getKeyTimeout(opposite) != null && !tetrisGameInfo.getKeyFirstMove(opposite)) {
		tetrisGameInfo.getKeyTimeout(opposite)?.pause();
	}

	const   repeat = async () => {

		postToApi(`http://${address}/api/tetris/movePiece`, { argument: arg, gameId: tetrisGameInfo.getGameId() });
		if (tetrisGameInfo.getKeyFirstMove(direction)) {
			tetrisGameInfo.setKeyFirstMove(direction, false);
			// console.log("First move")
			tetrisGameInfo.setKeyTimeout(direction, new TimeoutKey(repeat, 150));
			// console.log("First move done");
		}
		else {
			tetrisGameInfo.getKeyTimeout(direction)?.clear();
			tetrisGameInfo.setKeyTimeout(direction, new TimeoutKey(repeat, 40));
		}
	}
	repeat();
}

const gameControllers = async (finish: boolean = false) => {
	const keyStates = {
		moveLeft: false,
		moveRight: false,
		softDrop: false,
	};

	const   keydownHandler = async (event: KeyboardEvent) => {
		const key = event.key;

		if (tetrisGameInfo.getGameId() === -1) {
			tetrisGameInfo.getKeyTimeout("moveLeft")?.clear();
			tetrisGameInfo.getKeyTimeout("moveRight")?.clear();
			document.removeEventListener('keydown', keydownHandler);
			document.removeEventListener('keyup', keyupHandler);
			return ;
		}

		// TODO: Check to make the key spammable but with an interval

		switch (key) {
			case userKeys.getMoveLeft().toUpperCase():
			case userKeys.getMoveLeft().toLowerCase():
			case userKeys.getMoveLeft():
				if (event.repeat || keyStates.moveLeft)
					return ;
				keyStates.moveLeft = true;
				// console.log("moving piece left");
				movePiece("moveLeft");
				return ;
			case userKeys.getMoveRight():
			case userKeys.getMoveRight().toLowerCase():
			case userKeys.getMoveRight().toUpperCase():
				if (event.repeat || keyStates.moveRight)
					return ;
				keyStates.moveRight = true;
				// console.log("moving piece right");
				movePiece("moveRight");
				return ;
			case userKeys.getClockwiseRotate():
			case userKeys.getClockwiseRotate().toLowerCase():
			case userKeys.getClockwiseRotate().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/rotatePiece`, { argument: "clockwise", gameId: tetrisGameInfo.getGameId() });
				return ;
			case userKeys.getCounterclockwise():
			case userKeys.getCounterclockwise().toLowerCase():
			case userKeys.getCounterclockwise().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/rotatePiece`, { argument: "counter-clockwise", gameId: tetrisGameInfo.getGameId() });
				return ;
			case userKeys.getRotate180():
			case userKeys.getRotate180().toLowerCase():
			case userKeys.getRotate180().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/rotatePiece`, { argument: "180", gameId: tetrisGameInfo.getGameId() });
				return ;
			case userKeys.getHardDrop():
			case userKeys.getHardDrop().toLowerCase():
			case userKeys.getHardDrop().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/dropPiece`, { argument: "Hard", gameId: tetrisGameInfo.getGameId() });
				return ;
			case userKeys.getSoftDrop():
			case userKeys.getSoftDrop().toLowerCase():
			case userKeys.getSoftDrop().toUpperCase():
				if (event.repeat || keyStates.softDrop)
					return ;
				keyStates.softDrop = true;
				postToApi(`http://${address}/api/tetris/dropPiece`, { argument: "Soft", gameId: tetrisGameInfo.getGameId() });
				return ;
			case userKeys.getHold():
			case userKeys.getHold().toLowerCase():
			case userKeys.getHold().toUpperCase():
				// console.log("holding Piece.");
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/holdPiece`, { argument: "hold", gameId: tetrisGameInfo.getGameId() });
				loadTetrisPage("board");
				return ;
			case userKeys.getForfeit():
			case userKeys.getForfeit().toLowerCase():
			case userKeys.getForfeit().toUpperCase():
				postToApi(`http://${address}/api/tetris/forfeit`, { argument: "forfeit", gameId: tetrisGameInfo.getGameId() });
				tetrisGameInfo.getKeyTimeout("moveLeft")?.clear();
				tetrisGameInfo.getKeyTimeout("moveRight")?.clear();
				document.removeEventListener('keydown', keydownHandler);
				document.removeEventListener('keyup', keyupHandler);
				page.show("/tetris")
				return;
			case userKeys.getRetry():
			case userKeys.getRetry().toLowerCase():
			case userKeys.getRetry().toUpperCase():
				postToApi(`http://${address}/api/tetris/retry`, { argument: "retry", gameId: tetrisGameInfo.getGameId() });
				return;

		}
	}

	const keyupHandler = async (event: KeyboardEvent) => {
		const key = event.key;

		switch (key) {
			case userKeys.getMoveLeft():
			case userKeys.getMoveLeft().toLowerCase():
			case userKeys.getMoveLeft().toUpperCase():
				// console.log("Not moving piece left");
				tetrisGameInfo.getKeyTimeout("moveLeft")?.clear();
				tetrisGameInfo.setKeyTimeout("moveLeft", null);
				tetrisGameInfo.setKeyFirstMove("moveLeft", true);
				keyStates.moveLeft = false;
				if (!!tetrisGameInfo.getKeyTimeout("moveRight")) {
					// console.log("Move Right: ", tetrisGameInfo.getKeyTimeout("moveRight"));
					tetrisGameInfo.getKeyTimeout("moveRight")?.resume();
				}
				return ;
			case userKeys.getMoveRight():
			case userKeys.getMoveRight().toLowerCase():
			case userKeys.getMoveRight().toUpperCase():
				// console.log("Not moving piece right");
				tetrisGameInfo.getKeyTimeout("moveRight")?.clear();
				tetrisGameInfo.setKeyTimeout("moveRight", null);
				tetrisGameInfo.setKeyFirstMove("moveRight", true);
				keyStates.moveRight = false;
				if (!!tetrisGameInfo.getKeyTimeout("moveLeft")) {
					tetrisGameInfo.getKeyTimeout("moveLeft")?.resume();
				}
				return ;
			case userKeys.getSoftDrop():
			case userKeys.getSoftDrop().toLowerCase():
			case userKeys.getSoftDrop().toUpperCase():
				keyStates.softDrop = false;
				return postToApi(`http://${address}/api/tetris/dropPiece`, { argument: "Normal", gameId: tetrisGameInfo.getGameId() });
		}
	}

	if (finish) {
		tetrisGameInfo.getKeyTimeout("moveLeft")?.clear();
		tetrisGameInfo.getKeyTimeout("moveRight")?.clear();
		document.removeEventListener('keydown', keydownHandler);
		document.removeEventListener('keyup', keyupHandler);
		return loadTetrisPage("idle");
	}

	document.addEventListener("keydown", keydownHandler);
	document.addEventListener("keyup", keyupHandler);
}
