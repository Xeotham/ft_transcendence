// import { loadTetrisPage } from "./tetris.ts";
import {loadTetrisHtml} from "./htmlPage.ts";
import {postToApi, tetrisRes, TimeoutKey} from "./utils.ts";
import {loadTetrisPage, tetrisGameInfo, userKeys} from "./tetris.ts";
import {address} from "../main.ts";
// @ts-ignore
import page from "page";

let socket: WebSocket | null = null;

export const    searchGame = () => {
}

export const    arcadeGame = () => {
	socket = new WebSocket(`ws://${address}:3000/api/tetris/tetrisArcade`);

	socket.onmessage = messageHandler;
	socket.onerror = err => {console.error("Error:", err);}
	socket.onopen = () => {console.log("Connected to server")};
	socket.onclose = (event) => {  if (event.wasClean) {
		console.log('WebSocket connection closed cleanly.');
	} else {
		console.error('WebSocket connection died. Code:', event.code, 'Reason:', event.reason);
	}};
	tetrisGameInfo.setSocket(socket);
	loadTetrisHtml("board");
	gameControllers();
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
			console.log("B2B: " + res.argument);
			return;
		case "STATS":
			console.log("Stats: " + JSON.stringify(res.argument));
			return;
		case "FINISH":
			console.log("Game Over");
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

		// console.log("Moving piece " + arg);
		postToApi(`http://${address}:3000/api/tetris/movePiece`, { argument: arg, roomId: tetrisGameInfo.getGameId() });
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
				postToApi(`http://${address}:3000/api/tetris/rotatePiece`, { argument: "clockwise", roomId: tetrisGameInfo.getGameId() });
				return ;
			case userKeys.getCounterclockwise():
			case userKeys.getCounterclockwise().toLowerCase():
			case userKeys.getCounterclockwise().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}:3000/api/tetris/rotatePiece`, { argument: "counter-clockwise", roomId: tetrisGameInfo.getGameId() });
				return ;
			case userKeys.getRotate180():
			case userKeys.getRotate180().toLowerCase():
			case userKeys.getRotate180().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}:3000/api/tetris/rotatePiece`, { argument: "180", roomId: tetrisGameInfo.getGameId() });
				return ;
			case userKeys.getHardDrop():
			case userKeys.getHardDrop().toLowerCase():
			case userKeys.getHardDrop().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}:3000/api/tetris/dropPiece`, { argument: "Hard", roomId: tetrisGameInfo.getGameId() });
				return ;
			case userKeys.getSoftDrop():
			case userKeys.getSoftDrop().toLowerCase():
			case userKeys.getSoftDrop().toUpperCase():
				if (event.repeat || keyStates.softDrop)
					return ;
				keyStates.softDrop = true;
				postToApi(`http://${address}:3000/api/tetris/dropPiece`, { argument: "Soft", roomId: tetrisGameInfo.getGameId() });
				return ;
			case userKeys.getHold():
			case userKeys.getHold().toLowerCase():
			case userKeys.getHold().toUpperCase():
				// console.log("holding Piece.");
				if (event.repeat)
					return ;
				postToApi(`http://${address}:3000/api/tetris/holdPiece`, { argument: "hold", roomId: tetrisGameInfo.getGameId() });
				loadTetrisPage("board");
				return ;
			case userKeys.getForfeit():
			case userKeys.getForfeit().toLowerCase():
			case userKeys.getForfeit().toUpperCase():
				postToApi(`http://${address}:3000/api/tetris/forfeit`, { argument: "forfeit", roomId: tetrisGameInfo.getGameId() });
				document.removeEventListener('keydown', keydownHandler);
				document.removeEventListener('keyup', keyupHandler);
				page.show("/tetris")
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
				return postToApi(`http://${address}:3000/api/tetris/dropPiece`, { argument: "Normal", roomId: tetrisGameInfo.getGameId() });
		}
	}

	if (finish)
		return page.show("/tetris");

	document.addEventListener("keydown", keydownHandler);
	document.addEventListener("keyup", keyupHandler);
}