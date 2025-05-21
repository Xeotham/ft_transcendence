import { loadTetrisHtml } from "./tetrisHTML.ts";
import {bgmPlayer, roomInfo, sfxPlayer, tetrisRes, TimeoutKey} from "./utils.ts";
import { loadTetrisPage, tetrisGameInformation, userKeys } from "./tetris.ts";
import { address } from "../immanence.ts";
import { postToApi } from "../utils.ts";
// @ts-ignore
import page from "page";

let socket: WebSocket | null = null;
const generateUserName = () => {
	const   characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const   length = 8;
	let     result: string = "";

	for (let i = 0; i < length; i++)
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	console.log("Generated username: " + result);
	return result;
}


export const username = /*localStorage.getItem("username");*/ generateUserName(); // TODO: Change this to use the username from the local storage

const socketInit = (socket: WebSocket) => {
	tetrisGameInformation.setSocket(socket);
	socket.onmessage = messageHandler;
	socket.onerror = err => { console.error("Error:", err) };
	socket.onopen = () => { console.log("Connected to server") };
	socket.onclose = (event) => {
		if (event.wasClean)
			console.log('WebSocket connection closed cleanly.');
		else
			console.error('WebSocket connection died. Code:', event.code, 'Reason:', event.reason);
		postToApi(`http://${address}/api/tetris/quitRoom`, { argument: "quit", gameId: tetrisGameInformation.getGameId(),
			username: username, roomCode: tetrisGameInformation.getRoomCode() });
		tetrisGameInformation.setGameId(-1);
		tetrisGameInformation.setGame(null);
		tetrisGameInformation.setSocket(null);
		tetrisGameInformation.setRoomOwner(false);
		console.log("Leaving room : " + tetrisGameInformation.getRoomCode());
		tetrisGameInformation.setRoomCode("");
		loadTetrisPage("idle");
	};
}

export const resetSocket = (leaveType: string = "game") => {

	if ((leaveType === "game" && tetrisGameInformation.getRoomCode() === "") ||
		leaveType === "room") {
		console.log("Closing socket");
		tetrisGameInformation.getSocket()?.close();
		tetrisGameInformation.setSocket(null);
		tetrisGameInformation.resetSettings();
	}
	tetrisGameInformation.setGameId(-1);
	tetrisGameInformation.setGame(null);
	tetrisGameInformation.getKeyTimeout("moveLeft")?.clear();
	tetrisGameInformation.getKeyTimeout("moveRight")?.clear();
	tetrisGameInformation.setKeyTimeout("moveLeft", null);
	tetrisGameInformation.setKeyTimeout("moveRight", null);
	tetrisGameInformation.setKeyFirstMove("moveLeft", true);
	tetrisGameInformation.setKeyFirstMove("moveRight", true);
	gameControllers(true);
}

export const    searchGame = () => {
}

export const    arcadeGame = () => {
	// console.log("arcadeGame");
	socket = new WebSocket(`ws://${address}/api/tetris/arcade?username=${username}`);

	socketInit(socket);
	tetrisGameInformation.setSocket(socket);
	loadTetrisHtml("board");
	window.addEventListener("beforeunload", () => {
		postToApi(`http://${address}/api/tetris/forfeit`, { argument: "forfeit", gameId: tetrisGameInformation.getGameId() });
		if (tetrisGameInformation.getSocket()) {
			tetrisGameInformation.getSocket()?.close();
		}
	})
	// gameControllers();
}

export const createRoom = () => {
	socket = new WebSocket(`ws://${address}/api/tetris/createRoom?username=${username}`);
	socketInit(socket);
	tetrisGameInformation.setRoomOwner(true);
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
	socket = new WebSocket(`ws://${address}/api/tetris/joinRoom?code=${roomCode}&username=${username}`);
	socketInit(socket);
}

export const startRoom = () => {
	if (!tetrisGameInformation.getRoomOwner())
		return console.log("You are not the owner of the room");
	if (tetrisGameInformation.getNeedSave())
		return console.log("Need to save the game before starting the room");
	postToApi(`http://${address}/api/tetris/roomCommand`, { argument: "start", gameId: 0, roomCode: tetrisGameInformation.getRoomCode() });
}

const   btbEffect = (btb: string) => {
	if (btb === "break")
		return sfxPlayer.play("btb_break")
	else if (Number(btb) <= 3 )
		return sfxPlayer.play(`btb_${btb}`);
	else
		return sfxPlayer.play("btb_3");
}

const   clearEffect = (clear: string) => {
	switch (clear) {
		case "all":
			return sfxPlayer.play("allclear");
		case "btb":
			return sfxPlayer.play("clearbtb");
		case "line":
			return sfxPlayer.play("clearline");
		case "quad":
			return sfxPlayer.play("clearquad");
		case "spin":
			return sfxPlayer.play("clearspin");
		default:
			return ;
	}
}

const   comboEffect = (combo: string) => {
	if (combo === "break")
		return sfxPlayer.play("combobreak");
	else if (Number(combo) <= 16)
		return sfxPlayer.play(`combo_${combo}`);
	else
		return sfxPlayer.play("combo_16");
}

const   garbageEffect = (garbage: string) => {
	return sfxPlayer.play(garbage);
}

const   userEffect = (user: string) => {
	return sfxPlayer.play(user);
}

const   levelEffect = (level: string) => {
	switch (level) {
		case "up":
			return sfxPlayer.play("levelup");
		case "1":
			return sfxPlayer.play("level1");
		case "5":
			return sfxPlayer.play("level5");
		case "10":
			return sfxPlayer.play("level10");
		case "15":
			return sfxPlayer.play("level15");
		default:
			return ;
	}
}

const   lockEffect = (lock: string) => {
	switch (lock) {
		case "lock":
			return sfxPlayer.play("lock");
		case "spinend":
			return sfxPlayer.play("spinend");
		default:
			return ;
	}
}

const   spinEffect = (spin: string) => {
	switch (spin) {
		default:
			return sfxPlayer.play("spin");
	}
}

const   boardEffect = (board: string) => {
	return sfxPlayer.play(board);
}

const effectPlayer = (type: string, argument: string | null = null) => {
	switch (type) {
		/* ==== BTB ==== */
		case "BTB":
			return btbEffect(argument!);
		/* ==== CLEAR ==== */
		case "CLEAR":
			return clearEffect(argument!);
		/* ==== COMBO ==== */
		case "COMBO":
			return comboEffect(argument!);
		/* ==== GARBAGE ==== */
		case "GARBAGE":
			return garbageEffect(argument!);
		/* ==== USER_EFFECT ==== */
		case "USER_EFFECT":
			return userEffect(argument!);
		/* ==== LEVEL ==== */
		case "LEVEL":
			return levelEffect(argument!);
		/* ==== LOCK ==== */
		case "LOCK":
			return lockEffect(argument!);
		/* ==== SPIN ==== */
		case "SPIN":
			return spinEffect(argument!);
		/* ==== BOARD ==== */
		case "BOARD":
			return boardEffect(argument!);
	}

}

const   messageHandler = (event: MessageEvent)=> {
	// console.log("Receiving: " + event.data)
	let res: tetrisRes = JSON.parse(event.data);

	if (!res)
		return;
	switch (res.type) {
		case 'GAME_START':
			console.log("GAME_START");
			tetrisGameInformation.setGame(res.game);
			// console.log("Game: ", res.game);
			tetrisGameInformation.setGameId(res.game.gameId);
			bgmPlayer.choseBgm("bgm1");
			bgmPlayer.play();
			loadTetrisHtml("board");
			loadTetrisPage("board");
			gameControllers();
			return ;
		case 'MULTIPLAYER_JOIN':
			if (res.argument === "OWNER") {
				console.log("MULTIPLAYER_OWNER");
				tetrisGameInformation.setRoomOwner(true);
			}
			else if(res.argument === "SETTINGS") {
				tetrisGameInformation.setSettings(res.value);
			}
			else {
				console.log("MULTIPLAYER_JOIN");
				tetrisGameInformation.setRoomCode(res.argument as string);
				page.show("/tetris");
				console.log("Joining room: " + res.argument);
			}
			loadTetrisPage("multiplayer-room", {rooms:[{roomCode: tetrisGameInformation.getRoomCode()}]});
			return ;
		case 'MULTIPLAYER_LEAVE':
			console.log("MULTIPLAYER_LEAVE");
			resetSocket("room");
			return ;
		case 'MULTIPLAYER_LEAVE':
			console.log("MULTIPLAYER_LEAVE");
			resetSocket("room");
			return ;
		case 'INFO':
			console.log("INFO: " + res.argument);
			return ;
		case "GAME":
			tetrisGameInformation.setGame(res.game);
			loadTetrisPage("board");
			return ;
		case "EFFECT":
			effectPlayer(res.argument as string, res.value);
			return ;
		case "STATS":
			console.log("Stats: " + JSON.stringify(res.argument));
			return;
		case "MULTIPLAYER_FINISH":
			console.log("The multiplayer game has finished. You ended up at place " + res.argument);
			return ;
		case "MULTIPLAYER_OPPONENTS_GAMES":
			console.log("MULTIPLAYER_OPPONENTS_GAMES");
			tetrisGameInformation.setOpponentsGames(res.argument as any[]);
			return ;
		case "GAME_FINISH":
			console.log("Game Over");
			resetSocket();
			bgmPlayer.stop();
			return ;
		default:
			console.log("Unknown message type: " + res.type);
	}
}

// TODO: Need to make the timeout pause when the opposite key is pressed ( https://stackoverflow.com/questions/3969475/javascript-pause-settimeout )

const   movePiece = (direction: string) => {
	const   arg = direction === "moveLeft" ? "left" : "right";
	const   opposite = direction === "moveLeft" ? "moveRight" : "moveLeft";

	if (tetrisGameInformation.getKeyTimeout(opposite) != null && !tetrisGameInformation.getKeyFirstMove(opposite)) {
		tetrisGameInformation.getKeyTimeout(opposite)?.pause();
	}

	const   repeat = async () => {
		postToApi(`http://${address}/api/tetris/movePiece`, { argument: arg, gameId: tetrisGameInformation.getGameId() });
		if (tetrisGameInformation.getKeyFirstMove(direction)) {
			tetrisGameInformation.setKeyFirstMove(direction, false);
			// console.log("First move")
			tetrisGameInformation.setKeyTimeout(direction, new TimeoutKey(repeat, 150));
			// console.log("First move done");
		}
		else {
			tetrisGameInformation.getKeyTimeout(direction)?.clear();
			tetrisGameInformation.setKeyTimeout(direction, new TimeoutKey(repeat, 40));
		}
	}
	repeat();
}

let abortController: AbortController | null = null;

const gameControllers = async (finish: boolean = false) => {
	const keyStates = {
		moveLeft: false,
		moveRight: false,
		softDrop: false,
	};

	const   keydownHandler = async (event: KeyboardEvent) => {
		const key = event.key;

		if (tetrisGameInformation.getGameId() === -1) {
			tetrisGameInformation.getKeyTimeout("moveLeft")?.clear();
			tetrisGameInformation.getKeyTimeout("moveRight")?.clear();
			abortController?.abort(); // Remove all listeners
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
				postToApi(`http://${address}/api/tetris/rotatePiece`, { argument: "clockwise", gameId: tetrisGameInformation.getGameId() });
				return ;
			case userKeys.getCounterclockwise():
			case userKeys.getCounterclockwise().toLowerCase():
			case userKeys.getCounterclockwise().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/rotatePiece`, { argument: "counter-clockwise", gameId: tetrisGameInformation.getGameId() });
				return ;
			case userKeys.getRotate180():
			case userKeys.getRotate180().toLowerCase():
			case userKeys.getRotate180().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/rotatePiece`, { argument: "180", gameId: tetrisGameInformation.getGameId() });
				return ;
			case userKeys.getHardDrop():
			case userKeys.getHardDrop().toLowerCase():
			case userKeys.getHardDrop().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/dropPiece`, { argument: "Hard", gameId: tetrisGameInformation.getGameId() });
				return ;
			case userKeys.getSoftDrop():
			case userKeys.getSoftDrop().toLowerCase():
			case userKeys.getSoftDrop().toUpperCase():
				if (event.repeat || keyStates.softDrop)
					return ;
				keyStates.softDrop = true;
				postToApi(`http://${address}/api/tetris/dropPiece`, { argument: "Soft", gameId: tetrisGameInformation.getGameId() });
				return ;
			case userKeys.getHold():
			case userKeys.getHold().toLowerCase():
			case userKeys.getHold().toUpperCase():
				// console.log("holding Piece.");
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/holdPiece`, { argument: "hold", gameId: tetrisGameInformation.getGameId() });
				loadTetrisPage("board");
				return ;
			case userKeys.getForfeit():
			case userKeys.getForfeit().toLowerCase():
			case userKeys.getForfeit().toUpperCase():
				postToApi(`http://${address}/api/tetris/forfeit`, { argument: "forfeit", gameId: tetrisGameInformation.getGameId() });
				// tetrisGameInfo.getKeyTimeout("moveLeft")?.clear();
				// tetrisGameInfo.getKeyTimeout("moveRight")?.clear();
				// document.removeEventListener('keydown', keydownHandler);
				// document.removeEventListener('keyup', keyupHandler);
				// bgmPlayer.stop();
				// page.show("/tetris")
				return;
			case userKeys.getRetry():
			case userKeys.getRetry().toLowerCase():
			case userKeys.getRetry().toUpperCase():
				postToApi(`http://${address}/api/tetris/retry`, { argument: "retry", gameId: tetrisGameInformation.getGameId() });
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
				tetrisGameInformation.getKeyTimeout("moveLeft")?.clear();
				tetrisGameInformation.setKeyTimeout("moveLeft", null);
				tetrisGameInformation.setKeyFirstMove("moveLeft", true);
				keyStates.moveLeft = false;
				if (!!tetrisGameInformation.getKeyTimeout("moveRight")) {
					// console.log("Move Right: ", tetrisGameInfo.getKeyTimeout("moveRight"));
					tetrisGameInformation.getKeyTimeout("moveRight")?.resume();
				}
				return ;
			case userKeys.getMoveRight():
			case userKeys.getMoveRight().toLowerCase():
			case userKeys.getMoveRight().toUpperCase():
				// console.log("Not moving piece right");
				tetrisGameInformation.getKeyTimeout("moveRight")?.clear();
				tetrisGameInformation.setKeyTimeout("moveRight", null);
				tetrisGameInformation.setKeyFirstMove("moveRight", true);
				keyStates.moveRight = false;
				if (!!tetrisGameInformation.getKeyTimeout("moveLeft")) {
					tetrisGameInformation.getKeyTimeout("moveLeft")?.resume();
				}
				return ;
			case userKeys.getSoftDrop():
			case userKeys.getSoftDrop().toLowerCase():
			case userKeys.getSoftDrop().toUpperCase():
				keyStates.softDrop = false;
				return postToApi(`http://${address}/api/tetris/dropPiece`, { argument: "Normal", gameId: tetrisGameInformation.getGameId() });
		}
	}

	if (finish) {
		tetrisGameInformation.getKeyTimeout("moveLeft")?.clear();
		tetrisGameInformation.getKeyTimeout("moveRight")?.clear();
		abortController?.abort(); // Abort all listeners
		abortController = null;
		return ;
	}

	if (!abortController) {
		abortController = new AbortController();
		const signal = abortController.signal;

		document.addEventListener("keydown", keydownHandler, { signal });
		document.addEventListener("keyup", keyupHandler, { signal });
	}
}
