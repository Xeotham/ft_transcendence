import { bgmPlayer, tetrisSfxPlayer, tetrisRes, TimeoutKey } from "./utils.ts";
import { loadTetrisPage, tetrisGameInformation } from "./tetris.ts";
import { postToApi, address, user, getFromApi } from "../utils.ts";
import { tetrisBoardHtml } from "./tetrisHTML.ts";
import { hideZoneGame, zone } from "../zone/zoneCore.ts";
import { imTexts } from "../imTexts/imTexts.ts";
import { userKeys } from "./utils.ts";
import { TCS } from "../TCS.ts";

// @ts-ignore
import page from "page";

let socket: WebSocket | null = null;



interface GameUserInfo {
	date: string;
	totalTime: number;
	username?: string;
	userId: number;
	score: number;
	winner: boolean;
	type: string;
	maxCombo: number;
	piecesPlaced: number;
	piecesPerSecond: number;
	attacksSent: number;
	attacksSentPerMinute: number;
	attacksReceived: number;
	attacksReceivedPerMinute: number;
	keysPressed: number;
	keysPerPiece: number;
	keysPerSecond: number;
	holds: number;
	linesCleared: number;
	linesPerMinute: number;
	maxB2B: number;
	perfectClears: number;
	single: number;
	double: number;
	triple: number;
	quad: number;
	tspinZero: number;
	tspinSingle: number;
	tspinDouble: number;
	tspinTriple: number;
	tspinQuad: number;
	miniTspinZero: number;
	miniTspinSingle: number;
	miniSpinZero: number;
	miniSpinSingle: number;
	miniSpinDouble: number;
	miniSpinTriple: number;
	miniSpinQuad: number
}


const socketClose = async (type: string) => {
	try {
		console.log("WebSocket connection closed.");
		postToApi(`http://${address}/api/tetris/forfeit`, {
			argument: "forfeit",
			gameId: tetrisGameInformation.getGameId()
		}).catch();
		postToApi(`http://${address}/api/tetris/quitRoom`, {
			argument: "quit", gameId: tetrisGameInformation.getGameId(),
			username: user.getUsername(), roomCode: tetrisGameInformation.getRoomCode()
		}).catch();
		if (type === "unload")
			postToApi(`http://${address}/api/user/disconnect-user`, {username: user.getUsername()}).catch();
		tetrisGameInformation.getSocket()?.close();
		tetrisGameInformation.setSocket(null);
		tetrisGameInformation.setGameId(-1);
		tetrisGameInformation.setGame(null);
		tetrisGameInformation.setRoomOwner(false);
		if (tetrisGameInformation.getRoomCode() !== "")
			console.log("Leaving room : " + tetrisGameInformation.getRoomCode());
		tetrisGameInformation.setRoomCode("");
		tetrisGameInformation.resetSettings();
		if (zone.state === "TETRIS")
			loadTetrisPage("idle");
		bgmPlayer.stop();
		resetSocket("game");
	}
	catch (error) {
		return ;
	}
}

const socketInit = (socket: WebSocket) => {
	tetrisGameInformation.setSocket(socket);
	socket.onmessage = messageHandler;
	socket.onerror = err => { console.error("Error:", err) };
	socket.onopen = () => { console.log("Connected to server") };
	socket.onclose = () => socketClose("close");

	window.onunload = () => socketClose("unload");
	// Special handling for Chrome
	if (!navigator.userAgent.includes("Firefox"))
		window.onbeforeunload = (e) => {
			socketClose("unload");
			e.preventDefault();
			return e.returnValue = imTexts.tetrisRefreshConfirmation;
		};
}

export const resetSocket = (leaveType: string = "game") => {

	if ((leaveType === "game" && tetrisGameInformation.getRoomCode() === "") ||
		leaveType === "room") {
		// console.log("Closing socket");
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
	socket = new WebSocket(`ws://${address}/api/tetris/matchmaking?username=${user.getUsername()}`);
	socketInit(socket);
}

export const    arcadeGame = () => {
	// console.log("arcadeGame");
	socket = new WebSocket(`ws://${address}/api/tetris/arcade?username=${user.getUsername()}`);

	socketInit(socket);
	tetrisBoardHtml();

	// gameControllers();
}

export const createRoom = () => {
	socket = new WebSocket(`ws://${address}/api/tetris/createRoom?username=${user.getUsername()}`);
	socketInit(socket);
	tetrisGameInformation.setRoomOwner(true);
}

export const getMultiplayerRooms = async () => {

	try {
		const res = await getFromApi(`http://${address}/api/tetris/getMultiplayerRooms`);

		loadTetrisPage("display-multiplayer-room", {rooms: res});
	}
	catch (error) {
		alert(error);
	}
}

export const joinRoom = (roomCode: string) => {
	socket = new WebSocket(`ws://${address}/api/tetris/joinRoom?code=${roomCode}&username=${user.getUsername()}`);
	socketInit(socket);
}

export const startRoom = () => {
	if (!tetrisGameInformation.getRoomOwner())
		return console.log("You are not the owner of the room");
	postToApi(`http://${address}/api/tetris/roomCommand`, { argument: "start", gameId: 0, roomCode: tetrisGameInformation.getRoomCode() }).catch();
}

const   btbEffect = (btb: string) => {
	if (btb === "break")
		return tetrisSfxPlayer.play("btb_break")
	else if (Number(btb) <= 3 )
		return tetrisSfxPlayer.play(`btb_${btb}`);
	else
		return tetrisSfxPlayer.play("btb_3");
}

const   clearEffect = (clear: string) => {
	switch (clear) {
		case "all":
			return tetrisSfxPlayer.play("allclear");
		case "btb":
			return tetrisSfxPlayer.play("clearbtb");
		case "line":
			return tetrisSfxPlayer.play("clearline");
		case "quad":
			return tetrisSfxPlayer.play("clearquad");
		case "spin":
			return tetrisSfxPlayer.play("clearspin");
		default:
			return ;
	}
}

const   comboEffect = (combo: string) => {
	if (combo === "break")
		return tetrisSfxPlayer.play("combobreak");
	else if (Number(combo) <= 16)
		return tetrisSfxPlayer.play(`combo_${combo}`);
	else
		return tetrisSfxPlayer.play("combo_16");
}

const   garbageEffect = (garbage: string) => {
	return tetrisSfxPlayer.play(garbage);
}

const   userEffect = (user: string) => {
	return tetrisSfxPlayer.play(user);
}

const   levelEffect = (level: string) => {
	switch (level) {
		case "up":
			return tetrisSfxPlayer.play("levelup");
		case "1":
			return tetrisSfxPlayer.play("level1");
		case "5":
			return tetrisSfxPlayer.play("level5");
		case "10":
			return tetrisSfxPlayer.play("level10");
		case "15":
			return tetrisSfxPlayer.play("level15");
		default:
			return ;
	}
}

const   lockEffect = (lock: string) => {
	switch (lock) {
		case "lock":
			return tetrisSfxPlayer.play("lock");
		case "spinend":
			return tetrisSfxPlayer.play("spinend");
		default:
			return ;
	}
}

const   spinEffect = (spin: string) => {
	switch (spin) {
		default:
			return tetrisSfxPlayer.play("spin");
	}
}

const   boardEffect = (board: string) => {
	return tetrisSfxPlayer.play(board);
}

const	effectPlayer = (type: string, argument: string | null = null) => {
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
			// console.log("GAME_START");
			tetrisGameInformation.setGame(res.game);
			tetrisGameInformation.setGameId(res.game.gameId);
			tetrisGameInformation.setOpponentsGames([]);
			bgmPlayer.play();
			tetrisBoardHtml();
			loadTetrisPage("board");
			document.getElementById("endGame")!.style.display = "none";
			gameControllers();
			return ;
		case 'MULTIPLAYER_JOIN':
			// console.log("MULTIPLAYER_JOIN : " + res.argument);
			if (res.argument === "OWNER") {
				// console.log("MULTIPLAYER_OWNER");
				tetrisGameInformation.setRoomOwner(true);
			}
			else if(res.argument === "SETTINGS") {
				tetrisGameInformation.setSettings(res.value);
				// console.log("settings saved: " + JSON.stringify(res.value));
			}
			else {
				// console.log("MULTIPLAYER_JOIN");
				tetrisGameInformation.setRoomCode(res.argument as string);
				console.log("Joining room: " + res.argument);
			}
			loadTetrisPage("multiplayer-room", {rooms:[{roomCode: tetrisGameInformation.getRoomCode()}]});
			return ;
		case 'MULTIPLAYER_LEAVE':
			// console.log("MULTIPLAYER_LEAVE");
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
			showStats(res.argument);
			return;
		case "MULTIPLAYER_FINISH":
			return ;
		case "MULTIPLAYER_OPPONENTS_GAMES":
			tetrisGameInformation.setOpponentsGames(res.argument as any[]);
			loadTetrisPage("board");
			return ;
		case "GAME_FINISH":
			console.log("Game Over");
			resetSocket("game");
			bgmPlayer.stop();
			return ;
		default:
			console.log("Unknown message type: " + res.type);
	}
}

const	showStats = (stats: GameUserInfo) => {
	const	endGameDiv = document.getElementById("endGame");

	if (!endGameDiv) {
		hideZoneGame()
		return;
	}

	document.getElementById("scoreDiv")!.style.display = "none";
	document.getElementById("levelDiv")!.style.display = "none";
	document.getElementById("timeDiv")!.style.display = "none";
	document.getElementById("goalDiv")!.style.display = "none";
	document.getElementById("piecesDiv")!.style.display = "none";

	endGameDiv.style.display = "block";

	endGameDiv.innerHTML = `
		<div id="tetrisStatsDetailText" class="${TCS.modaleStatDetail}">
		<div class="${TCS.modaleTitre} text-center">GAME OVER</div>
		<div class="h-[15px]"></div>
		<div class="${TCS.tetrisEndGameScore}">Score: ${stats?.score}</div>
		<div class="h-[30px]"></div>
		<div class="grid grid-cols-6 gap-[2px]">
	
	
		  <div class="col-span-2 ${TCS.modaleStatDetail}">Total Time: </div>
		  <div class="col-span-4">${stats?.totalTime}</div>

 		  <div class="col-span-2 ${TCS.modaleStatDetail}">Level: </div>
		  <div class="col-span-4">${stats?.level}</div>
	
		  <div class="col-span-6 h-[5px]"></div>
	
		  <div class="col-span-2 ${TCS.modaleStatDetail}">Max Combo: </div>
		  <div class="col-span-4">${stats?.maxCombo}</div>
	
		  <div class="col-span-2 ${TCS.modaleStatDetail}">Max B2B: </div>
		  <div class="col-span-4">${stats?.maxB2B}</div>
	
		  <div class="col-span-2 ${TCS.modaleStatDetail}">Perfect Clears: </div>
		  <div class="col-span-4">${stats?.perfectClears}</div>
	
		  <div class="col-span-2 ${TCS.modaleStatDetail}">Pieces: </div>
		  <div class="col-span-4">${stats?.piecesPlaced} placed | ${stats?.piecesPerSecond} / s</div>
	
		  <div class="col-span-6 h-[5px]"></div>
	
		  <div class="col-span-2 ${TCS.modaleStatDetail}">Keys: </div>
		  <div class="col-span-4">${stats?.keysPressed} pressed | ${stats?.keysPerPiece} / pieces | ${stats?.keysPerSecond} / s</div>
	
		  <div class="col-span-2 ${TCS.modaleStatDetail}">Holds: </div>
		  <div class="col-span-4">${stats?.holds}</div>
	
		  <div class="col-span-2 ${TCS.modaleStatDetail}">Lines: </div>
		  <div class="col-span-4">${stats?.linesCleared} cleared | ${stats?.linesPerMinute} / min</div>
	
		</div>
	
		<div class="h-[20px]"></div>
	
		<div class="grid grid-cols-6">
	
		  <div class="${TCS.modaleStatDetail} ${TCS.statRow1}">TYPE</div>
		  <div class="${TCS.modaleStatDetail} ${TCS.statCol1}">Zero</div>
		  <div class="${TCS.modaleStatDetail} ${TCS.statCol1}">Single</div>
		  <div class="${TCS.modaleStatDetail} ${TCS.statCol1}">Double</div>
		  <div class="${TCS.modaleStatDetail} ${TCS.statCol1}">Triple</div>
		  <div class="${TCS.modaleStatDetail} ${TCS.statCol1}">Quad</div>
	
		  <div class="${TCS.modaleStatDetail}">Clears</div>
		  <div class="${TCS.modaleStatDetail}">X</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.single}</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.double}</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.triple}</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.quad}</div>
	
		  <div class="${TCS.modaleStatDetail}">Tspin</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.tspinZero}</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.tspinSingle}</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.tspinDouble}</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.tspinTriple}</div>
		  <div class="${TCS.modaleStatDetail}">X</div>
	
		  <div class="${TCS.modaleStatDetail}">Mini Tspin</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.miniTspinZero}</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.miniTspinSingle}</div>
		  <div class="${TCS.modaleStatDetail}">X</div>
		  <div class="${TCS.modaleStatDetail}">X</div>
		  <div class="${TCS.modaleStatDetail}">X</div>
	
		  <div class="${TCS.modaleStatDetail}">Mini Spin</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.miniSpinZero}</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.miniSpinSingle}</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.miniSpinDouble}</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.miniSpinTriple}</div>
		  <div class="${TCS.modaleStatDetail}">${stats?.miniSpinQuad}</div>
		</div>
	
		<div class="h-[30px]"></div>
		
		<div id="returnHome" class="${TCS.tetrisEndGameButton}">
			${imTexts.tetrisBoardReturnToMenu}
		</div>
	
	  </div>
	`
	document.getElementById("returnHome")!.addEventListener("click", () => {
		hideZoneGame();
	})

}

const   movePiece = (direction: string) => {
	const   arg = direction === "moveLeft" ? "left" : "right";
	const   opposite = direction === "moveLeft" ? "moveRight" : "moveLeft";

	if (tetrisGameInformation.getKeyTimeout(opposite) != null && !tetrisGameInformation.getKeyFirstMove(opposite)) {
		tetrisGameInformation.getKeyTimeout(opposite)?.pause();
	}

	const   repeat = async () => {
		postToApi(`http://${address}/api/tetris/movePiece`, { argument: arg, gameId: tetrisGameInformation.getGameId() }).catch();
		if (tetrisGameInformation.getKeyFirstMove(direction)) {
			tetrisGameInformation.setKeyFirstMove(direction, false);
			tetrisGameInformation.setKeyTimeout(direction, new TimeoutKey(repeat, 150));
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

		switch (key) {
			case userKeys?.getMoveLeft().toUpperCase():
			case userKeys?.getMoveLeft().toLowerCase():
			case userKeys?.getMoveLeft():
				if (event.repeat || keyStates.moveLeft)
					return ;
				keyStates.moveLeft = true;
				movePiece("moveLeft");
				return ;
			case userKeys?.getMoveRight():
			case userKeys?.getMoveRight().toLowerCase():
			case userKeys?.getMoveRight().toUpperCase():
				if (event.repeat || keyStates.moveRight)
					return ;
				keyStates.moveRight = true;
				movePiece("moveRight");
				return ;
			case userKeys?.getClockwiseRotate():
			case userKeys?.getClockwiseRotate().toLowerCase():
			case userKeys?.getClockwiseRotate().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/rotatePiece`, { argument: "clockwise", gameId: tetrisGameInformation.getGameId() }).catch();
				return ;
			case userKeys?.getCounterclockwise():
			case userKeys?.getCounterclockwise().toLowerCase():
			case userKeys?.getCounterclockwise().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/rotatePiece`, { argument: "counter-clockwise", gameId: tetrisGameInformation.getGameId() }).catch();
				return ;
			case userKeys?.getRotate180():
			case userKeys?.getRotate180().toLowerCase():
			case userKeys?.getRotate180().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/rotatePiece`, { argument: "180", gameId: tetrisGameInformation.getGameId() }).catch();
				return ;
			case userKeys?.getHardDrop():
			case userKeys?.getHardDrop().toLowerCase():
			case userKeys?.getHardDrop().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/dropPiece`, { argument: "Hard", gameId: tetrisGameInformation.getGameId() }).catch();
				return ;
			case userKeys?.getSoftDrop():
			case userKeys?.getSoftDrop().toLowerCase():
			case userKeys?.getSoftDrop().toUpperCase():
				if (event.repeat || keyStates.softDrop)
					return ;
				keyStates.softDrop = true;
				postToApi(`http://${address}/api/tetris/dropPiece`, { argument: "Soft", gameId: tetrisGameInformation.getGameId() }).catch();
				return ;
			case userKeys?.getHold():
			case userKeys?.getHold().toLowerCase():
			case userKeys?.getHold().toUpperCase():
				// console.log("holding Piece.");
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/holdPiece`, { argument: "hold", gameId: tetrisGameInformation.getGameId() }).catch();
				loadTetrisPage("board");
				return ;
			case userKeys?.getForfeit():
			case userKeys?.getForfeit().toLowerCase():
			case userKeys?.getForfeit().toUpperCase():
				forfeit();
				return;
			case userKeys?.getRetry():
			case userKeys?.getRetry().toLowerCase():
			case userKeys?.getRetry().toUpperCase():
				if (event.repeat)
					return ;
				postToApi(`http://${address}/api/tetris/retry`, { argument: "retry", gameId: tetrisGameInformation.getGameId() }).catch();
				return;
		}
	}

	const keyupHandler = async (event: KeyboardEvent) => {
		const key = event.key;

		switch (key) {
			case userKeys?.getMoveLeft():
			case userKeys?.getMoveLeft().toLowerCase():
			case userKeys?.getMoveLeft().toUpperCase():
				// console.log("Not moving piece left");
				tetrisGameInformation.getKeyTimeout("moveLeft")?.clear();
				tetrisGameInformation.setKeyTimeout("moveLeft", null);
				tetrisGameInformation.setKeyFirstMove("moveLeft", true);
				keyStates.moveLeft = false;
				if (!!tetrisGameInformation.getKeyTimeout("moveRight")) {
					tetrisGameInformation.getKeyTimeout("moveRight")?.resume();
				}
				return ;
			case userKeys?.getMoveRight():
			case userKeys?.getMoveRight().toLowerCase():
			case userKeys?.getMoveRight().toUpperCase():
				// console.log("Not moving piece right");
				tetrisGameInformation.getKeyTimeout("moveRight")?.clear();
				tetrisGameInformation.setKeyTimeout("moveRight", null);
				tetrisGameInformation.setKeyFirstMove("moveRight", true);
				keyStates.moveRight = false;
				if (!!tetrisGameInformation.getKeyTimeout("moveLeft")) {
					tetrisGameInformation.getKeyTimeout("moveLeft")?.resume();
				}
				return ;
			case userKeys?.getSoftDrop():
			case userKeys?.getSoftDrop().toLowerCase():
			case userKeys?.getSoftDrop().toUpperCase():
				keyStates.softDrop = false;
				return postToApi(`http://${address}/api/tetris/dropPiece`, { argument: "Normal", gameId: tetrisGameInformation.getGameId() }).catch();
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

export const   forfeit = () => {
	postToApi(`http://${address}/api/tetris/forfeit`, { argument: "forfeit", gameId: tetrisGameInformation.getGameId() }).catch();
	hideZoneGame();
}
