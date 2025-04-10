// import { loadTetrisPage } from "./tetris.ts";
import {loadTetrisHtml} from "./htmlPage.ts";
import {postToApi} from "./utils.ts";
import {userKeys} from "./tetris.ts";
import {address} from "../main.ts";
// @ts-ignore
import page from "page";

export const    searchGame = () => {
}

export const    arcadeGame = () => {
	loadTetrisHtml("board");
	gameControllers();
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
		}
	}

	document.addEventListener("keydown", getNewKey);
}