// import { loadTetrisPage } from "./tetris.ts";
import {loadTetrisHtml} from "./htmlPage.ts";
import {postToApi, tetrisRes} from "./utils.ts";
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
			tetrisGameInfo.setGameId(res.game.gameId);
			loadTetrisPage("board");
			return ;
		case 'INFO':
			console.log("INFO: " + res.argument);
			return ;
		case "GAME":
			console.log("GAME: " + res.argument);
			tetrisGameInfo.setGame(res.game);
			loadTetrisPage("board");
			return ;
		default:
			console.log("Unknown message type: " + res.type);
	}
}

const gameControllers = () => {

	const getNewKey = (event: KeyboardEvent) => {
		const key = event.key;
		switch (key) {
			case userKeys.getMoveLeft():
				return postToApi(`http://${address}:3000/api/tetris/movePiece`, { argument: "left" });
			case userKeys.getMoveRight():
				return postToApi(`http://${address}:3000/api/tetris/movePiece`, { argument: "right" });
			case userKeys.getClockwizeRotate():
				return postToApi(`http://${address}:3000/api/tetris/rotatePiece`, { argument: "clockwise" });
			case userKeys.getCountClockwizeRotate():
				return postToApi(`http://${address}:3000/api/tetris/rotatePiece`, { argument: "counter-clockwise" });
			case userKeys.getHardDrop():
				return postToApi(`http://${address}:3000/api/tetris/dropPiece`, { argument: "hard" });
			case userKeys.getSoftDrop():
				return postToApi(`http://${address}:3000/api/tetris/dropPiece`, { argument: "soft" });
			case userKeys.getHold():
				return postToApi(`http://${address}:3000/api/tetris/holdPiece`, { argument: "hold" });
			case userKeys.getForfeit():
				postToApi(`http://${address}:3000/api/tetris/forfeit`, { argument: "forfeit" });
				document.removeEventListener('keydown', getNewKey);
				page.show("/tetris");
				return ;
		}
	}

	document.addEventListener("keydown", getNewKey);
}