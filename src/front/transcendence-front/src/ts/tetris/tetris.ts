import {
	bagCoord,
	bagWidth,
	boardCoord, boardHeight, boardWidth, borderSize,
	getMinoColor, holdCoord, holdHeight, holdWidth,
	keys,
	loadTetrisArgs,
	loadTetrisType,
	minoInfo,
	minoSize, postToApi, roomInfo,
	setKey, tetriminoInfo, tetriminoPatterns,
	tetrisGame
} from "./utils.ts";
import { loadTetrisHtml } from "./htmlPage.ts";
// @ts-ignore
import page from "page"
import {
	arcadeGame,
	createRoom,
	getMultiplayerRooms,
	joinRoom,
	resetSocket,
	searchGame,
	startRoom
} from "./gameManagement.ts";
import { address } from "../main.ts";

export const userKeys: keys = new keys();
export const tetrisGameInfo: tetrisGame = new tetrisGame();

export const   loadTetrisPage = (page: loadTetrisType, arg: loadTetrisArgs | null = null) => {
	switch (page) {
		case "idle":
			return idlePage();
		case "setting":
			return settingPage();
		case "keybindings":
			return keyBindsPage(arg!);
		case "board":
			return drawBoard();
		case "multiplayer-room":
			return multiplayerRoom(arg!);
		case "display-multiplayer-room":
			return displayMultiplayerRooms(arg?.rooms!);
	}
}

const   idlePage = () => {
	loadTetrisHtml("idle");
	tetrisGameInfo.setRoomOwner(false);

	document.getElementById("home")?.addEventListener("click", () => page.show("/"));
	// document.getElementById("matchmaking")?.addEventListener("click", () => searchGame())
	document.getElementById("arcade")?.addEventListener("click", () => arcadeGame());
	document.getElementById("create-room")?.addEventListener("click", () => createRoom());
	document.getElementById("get-multiplayer-rooms")?.addEventListener("click", () => getMultiplayerRooms());
	document.getElementById("setting")?.addEventListener("click", () => loadTetrisPage("keybindings", { keys: userKeys }));
}

const   settingPage = () => {
	loadTetrisHtml("setting");

	document.getElementById("idle")?.addEventListener("click", () => loadTetrisPage("idle"));
	document.getElementById("keybindings")?.addEventListener("click", () => loadTetrisPage("keybindings", { keys: userKeys }));

}

const  keyBindsPage = (keys: loadTetrisArgs) => {
	loadTetrisHtml("keybindings", keys);

	document.getElementById("idle")?.addEventListener("click", () => loadTetrisPage("idle"));
	document.getElementById("keybindings")?.addEventListener("click", () => loadTetrisPage("keybindings", { keys: userKeys }));

	document.getElementById("moveLeft")?.addEventListener("click", () => changeKeys("moveLeft"));
	document.getElementById("moveRight")?.addEventListener("click", () => changeKeys("moveRight"));
	document.getElementById("rotClock")?.addEventListener("click", () => changeKeys("rotClock"));
	document.getElementById("rotCountClock")?.addEventListener("click", () => changeKeys("rotCountClock"));
	document.getElementById("rot180")?.addEventListener("click", () => changeKeys("rot180"));
	document.getElementById("hardDrop")?.addEventListener("click", () => changeKeys("hardDrop"));
	document.getElementById("softDrop")?.addEventListener("click", () => changeKeys("softDrop"));
	document.getElementById("hold")?.addEventListener("click", () => changeKeys("hold"));
	document.getElementById("forfeit")?.addEventListener("click", () => changeKeys("forfeit"));
}

let  modify: boolean = false;

const changeKeys = (keyType: string) => {
	if (modify)
		return ;
	document.getElementById(keyType)!.innerText = "Press a key";

	modify = true;

	const getNewKey = (event: KeyboardEvent) => {
		const newKey = event.key;
		modify = false;
		setKey(keyType, newKey);
		console.log("New key set:", newKey);
		document.removeEventListener("keydown", getNewKey);
		document.getElementById(keyType)!.innerText = newKey === ' ' ? "Space" : newKey;
	};

	document.addEventListener("keydown", getNewKey);
}

const   drawMatrix = (matrix: minoInfo[][], ctx: CanvasRenderingContext2D) => {
	ctx.clearRect(boardCoord.x, boardCoord.y, boardWidth, boardHeight);
	ctx.beginPath();
	for (let y = matrix.length - 1; y > 15; --y) {
		for (let x = 0; x < matrix[y].length; ++x) {
			ctx.fillStyle = getMinoColor(matrix[y][x].texture);
			ctx.fillRect((x * minoSize) + boardCoord.x, ((y - 15) * minoSize) + boardCoord.y , minoSize, minoSize);
		}
	}
}

const   drawBorder = (ctx: CanvasRenderingContext2D) => {
	ctx.strokeStyle = "gray";
	ctx.lineWidth = 2;
	ctx.strokeRect(holdCoord.x - borderSize, holdCoord.y, holdWidth + (2 * borderSize), holdHeight - 8);
	ctx.strokeRect(boardCoord.x - borderSize, boardCoord.y, boardWidth + (2 * borderSize), boardHeight);
}

const   drawTetrimino = (ctx: CanvasRenderingContext2D, pattern: number[][], coord: {x: number, y: number}, height: number, width: number, minoLength: number, colors: string[]) => {
	ctx.clearRect(coord.x, coord.y, height, width);
	ctx.beginPath();
	for (let y = 0; y < pattern.length; ++y) {
		for (let x = 0; x < pattern[y].length; ++x) {
			if (pattern[y][x] !== 0) {
				const   newX = (x * minoLength) + coord.x;
				const   newY = (y * minoLength) + coord.y;

				ctx.fillStyle = colors[pattern[y][x]];
				ctx.fillRect(newX, newY, minoLength, minoLength);
			}
		}
	}
}

// TODO: Fix the hold piece drawing
const   drawHold = (ctx: CanvasRenderingContext2D, hold: tetriminoInfo) => {
	
	const   pattern = tetriminoPatterns[hold.name];
	const   margin = 4;
	const   holdMinoSize = ((holdWidth - (2 * margin)) / (pattern.length));
	const   colors: string[] = [ "black", getMinoColor(hold.name) ];

	drawTetrimino(ctx, pattern, holdCoord, holdHeight - 8, holdWidth - 8, holdMinoSize, colors);
}

const   drawBag = (ctx: CanvasRenderingContext2D, bags: tetriminoInfo[][]) => {
	const   firstBag = bags[0];
	const   secondBag = bags[1];
	let     bagToPrint: tetriminoInfo[] = [];

	if (firstBag.length >= 4)
		bagToPrint = firstBag.slice(0, 4);
	else
		bagToPrint = firstBag.concat(secondBag.slice(0, 4 - firstBag.length));
	for (let i = 0; i < bagToPrint.length; ++i) {
		const   pattern = tetriminoPatterns[bagToPrint[i].name];
		const   colors: string[] = [ "black", getMinoColor(bagToPrint[i].name) ];
		const   bagMinoSize = ((bagWidth - (2 * borderSize)) / (pattern.length));

		drawTetrimino(ctx, pattern, {x: bagCoord.x, y: bagCoord.y + (i * holdHeight)}, holdHeight - 8, holdWidth - 8, bagMinoSize, colors);
	}

}

const   drawBoard = () => {
	const canvas = document.getElementById("gameCanvas")  as HTMLCanvasElement;
	const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;
	const game = tetrisGameInfo.getGame();

	if (!ctx || !game)
		return;

	document.getElementById("score")!.innerText = "Score: " + tetrisGameInfo.getGame()?.score;
	// document.getElementById("time")!.innerText = "Time: " +
	// 	(new Date(tetrisGameInfo.getGame()?.time || 0).toISOString().substring(11, 23)); // TODO : add this line
	document.getElementById("PPS")!.innerText = "Pieces: " + tetrisGameInfo.getGame()?.piecesPlaced +
		", " + tetrisGameInfo.getGame()?.piecesPerSecond + "/S"; // TODO : add this line
	// document.getElementById("level")!.innerText = "level: " + tetrisGameInfo.getGame()?.level;
	// document.getElementById("lines")!.innerText = "lines: " + tetrisGameInfo.getGame()?.linesCleared + "/" + tetrisGameInfo.getGame()?.lineClearGoal;
	// c.clearRect(0, 0, canvas.width, canvas.height);
	// c.beginPath();
	drawBorder(ctx);
	drawMatrix(game.matrix, ctx);
	if (tetrisGameInfo.getSettingsValue("showBags") && game.bags)
		drawBag(ctx, game.bags);
	if (game.hold)
		drawHold(ctx, game.hold);
}

const multiplayerRoom = (arg: loadTetrisArgs) => {
	loadTetrisHtml("multiplayer-room", arg);
	document.getElementById("idle")?.addEventListener("click", () => { resetSocket(); loadTetrisPage("idle") });
	if (!tetrisGameInfo.getRoomOwner())
		return ;
	document.getElementById("start")?.addEventListener("click", () => startRoom());
	document.getElementById("show-shadow")?.addEventListener("click", () => tetrisGameInfo.setNeedSave(true));
	document.getElementById("show-bags")?.addEventListener("click", () => tetrisGameInfo.setNeedSave(true));
	document.getElementById("hold-allowed")?.addEventListener("click", () => tetrisGameInfo.setNeedSave(true));
	document.getElementById("infinite-hold")?.addEventListener("click", () => tetrisGameInfo.setNeedSave(true));
	document.getElementById("infinite-movement")?.addEventListener("click", () => tetrisGameInfo.setNeedSave(true));
	document.getElementById("ARE")?.addEventListener("change", () => tetrisGameInfo.setNeedSave(true));
	document.getElementById("spawn-ARE")?.addEventListener("change", () => tetrisGameInfo.setNeedSave(true));

	document.getElementById("save")?.addEventListener("click", () => {
		tetrisGameInfo.setSettings({
			"showShadowPiece": (document.getElementById("show-shadow") as HTMLInputElement)?.checked,
			"showBags": (document.getElementById("show-bags") as HTMLInputElement)?.checked,
			"holdAllowed": (document.getElementById("hold-allowed") as HTMLInputElement)?.checked,
			"showHold": (document.getElementById("show-hold") as HTMLInputElement)?.checked,
			"infiniteHold": (document.getElementById("infinite-hold") as HTMLInputElement)?.checked,
			"infiniteMovement": (document.getElementById("infinite-movement") as HTMLInputElement)?.checked,
			"ARE": parseInt((document.getElementById("ARE") as HTMLInputElement).value),
			"spawnARE": parseInt((document.getElementById("spawn-ARE") as HTMLInputElement).value)
		});
		tetrisGameInfo.setNeedSave(false);
		postToApi(`http://${address}:3000/api/tetris/roomCommand`, { argument: "settings", gameId: 0, roomCode: tetrisGameInfo.getRoomCode(), prefix: tetrisGameInfo.getSettings() })});

}

export const displayMultiplayerRooms = (rooms: roomInfo[]) => {
	loadTetrisHtml("display-multiplayer-room", { rooms: rooms });
	document.getElementById("idle")?.addEventListener("click", () => { resetSocket(); loadTetrisPage("idle") });
	document.getElementById("submit")?.addEventListener("click", () =>
		joinRoom((document.getElementById("room-code") as HTMLInputElement).value));
	document.getElementById("refresh")?.addEventListener("click", () => getMultiplayerRooms());

}
