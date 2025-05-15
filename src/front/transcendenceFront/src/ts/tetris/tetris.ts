import {
	bagWidth,
	getMinoTexture, holdWidth, holdHeight,
	keys,
	loadTetrisArgs,
	loadTetrisType,
	minoInfo,
	roomInfo,
	setKey, tetriminoInfo, tetriminoPatterns,
	tetrisGame
} from "./utils.ts";
import { loadTetrisHtml } from "./tetrisHTML.ts";
// @ts-ignore
import page from "page"
import {
	arcadeGame,
	createRoom,
	getMultiplayerRooms,
	joinRoom,
	startRoom
} from "./gameManagement.ts";

import {postToApi, resetGamesSocket} from "../utils.ts";
import { zoneSet } from "../zone/zoneCore.ts";
import { address } from "../immanence.ts";

export const userKeys: keys = new keys();
export const tetrisGameInfo: tetrisGame = new tetrisGame();

export const   loadTetrisPage = (page: loadTetrisType, arg: loadTetrisArgs | null = null) => {
	switch (page) {
		case "empty":
			return emptyPage();
		case "logo":
			return logoPage();
		case "idle":
			return idlePage();
		case "setting":
			return settingPage();
		case "keybindings":
			return keyBindsPage(arg!);
		case "board":
			return drawGame();
		case "multiplayer-room":
			return multiplayerRoom(arg!);
		case "display-multiplayer-room":
			return displayMultiplayerRooms(arg?.rooms!);
	}
}

const   emptyPage = () => {
	loadTetrisHtml("empty");
	//tetrisGameInfo.setRoomOwner(false);
	//resetGamesSocket();
}

const   logoPage = () => {
	loadTetrisHtml("logo");
	//tetrisGameInfo.setRoomOwner(false);
	//resetGamesSocket();
}

const   idlePage = () => {
	loadTetrisHtml("idle");

	resetGamesSocket("tetris");
	document.getElementById("home")?.addEventListener("click", (e) => { e.stopPropagation(); page.show("/"); });
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


export const tetrisTextures: { [key: string]: HTMLImageElement } = {};

export const loadTetrisTextures = () => {

	const   texturePaths = {
		"I":        '/src/medias/textures/tetris/I.png',
		"J":        '/src/medias/textures/tetris/J.png',
		"L":        '/src/medias/textures/tetris/L.png',
		"O":        '/src/medias/textures/tetris/O.png',
		"S":        '/src/medias/textures/tetris/S.png',
		"T":        '/src/medias/textures/tetris/T.png',
		"Z":        '/src/medias/textures/tetris/Z.png',
		"SHADOW":   '/src/medias/textures/tetris/shadow.png',
		"BACKGROUND": '/src/medias/textures/tetris/background.jpg',
		"MATRIX":   '/src/medias/textures/tetris/matrix.png',
		"HOLD":     '/src/medias/textures/tetris/hold.png',
		"BAGS":     '/src/medias/textures/tetris/bags.png',
		"GARBAGE": '/src/medias/textures/tetris/garbage.png',
	}

	return Promise.all(
		Object.entries(texturePaths).map(([key, path]) => {
			return new Promise<void>((resolve, reject) => {
				const img = new Image();
				// console.log(`Loading texture: ${key} from ${path}`);
				img.src = path;
				img.onload = () => {
					tetrisTextures[key] = img;
					resolve();
				};
				img.onerror = (err) => {
					console.error(`Failed to load texture: ${key} from ${path}`, err);
					reject(err)
				};
				// console.log(tetrisTextures[key]);
			});
		})
	);
};


const   drawMino = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, texture: string) => {
	const   minoTexture = getMinoTexture(texture);

	// console.log("Mino texture: ", minoTexture);
	if (minoTexture === null)
		return ;
	if (minoTexture) {
		ctx.drawImage(minoTexture, x, y, size, size);
	}
	else
		console.error(`Texture not found for ${texture}`);
}

const   drawMatrix = (ctx: CanvasRenderingContext2D, matrix: minoInfo[][], xCoord: number, yCoord: number, minoSize: number) => {
	// ctx.clearRect(xCoord, yCoord, width, height);
	ctx.beginPath();
	for (let y = matrix.length - 1; y > 16; --y) {
		for (let x = 0; x < matrix[y].length; ++x) {
			const   newX = (x * minoSize) + xCoord;
			const   newY = ((y - 17) * minoSize) + yCoord;
			drawMino(ctx, newX, newY, minoSize, matrix[y][x].texture);
			// ctx.fillStyle = getMinoColor(matrix[y][x].texture);
			// ctx.fillRect((x * minoSize) + boardCoord.x, ((y - 15) * minoSize) + boardCoord.y , minoSize, minoSize);
		}
	}
}

const   drawTetrimino = (ctx: CanvasRenderingContext2D, pattern: number[][], coord: {x: number, y: number}, minoLength: number, colors: string[]) => {
	// ctx.clearRect(coord.x, coord.y, height, width);
	ctx.beginPath();
	for (let y = 0; y < pattern.length; ++y) {
		for (let x = 0; x < pattern[y].length; ++x) {
			const   newX = (x * minoLength) + coord.x;
			const   newY = (y * minoLength) + coord.y;
			if (pattern[y][x] !== 0) {

				drawMino(ctx, newX, newY, minoLength, colors[pattern[y][x]]);
				// ctx.fillStyle = colors[pattern[y][x]];
				// ctx.fillRect(newX, newY, minoLength, minoLength);
			}
			// else {
			// 	ctx.fillStyle = "gray";
			// 	ctx.fillRect(newX, newY, minoLength, minoLength);
			// }
		}
	}
}

// TODO: Fix the hold piece drawing
const   drawHold = (ctx: CanvasRenderingContext2D, hold: tetriminoInfo, holdCoord: {x: number, y: number}) => {
	
	const   pattern = tetriminoPatterns[hold.name];
	const   margin = 10;
	const   holdMinoSize = ((holdWidth - (2 * margin)) / (pattern.length));
	const   colors: string[] = [ "black", tetrisGameInfo.getGame()?.canSwap ? hold.name : hold.name + "_SHADOW" ];

	drawTetrimino(ctx, pattern, holdCoord, holdMinoSize, colors);
}

const   drawBag = (ctx: CanvasRenderingContext2D, bags: tetriminoInfo[][], bagCoord: {x: number, y: number}) => {
	const   firstBag = bags[0];
	const   secondBag = bags[1];
	const   margin = 10;

	let     bagToPrint: tetriminoInfo[] = [];

	if (firstBag.length >= 4)
		bagToPrint = firstBag.slice(0, 4);
	else
		bagToPrint = firstBag.concat(secondBag.slice(0, 4 - firstBag.length));
	for (let i = 0; i < bagToPrint.length; ++i) {
		const   pattern = tetriminoPatterns[bagToPrint[i].name];
		const   colors: string[] = [ "black", bagToPrint[i].name ];
		const   bagMinoSize = ((bagWidth - (2 * margin)) / (pattern.length));

		drawTetrimino(ctx, pattern, {x: bagCoord.x, y: bagCoord.y + (i * holdHeight)}, bagMinoSize, colors);
	}

}

const   drawBackground = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height:number) => {
	ctx.clearRect(x, y, width, height);
	ctx.drawImage(tetrisTextures["BACKGROUND"], x, y, width, height);
}

const   drawBoard = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
	const   matrixTexture = tetrisTextures["MATRIX"];
	const   holdTexture = tetrisTextures["HOLD"];
	const   bagsTexture = tetrisTextures["BAGS"];

	const   matrixCoord: {x: number, y: number} = { x: x, y: y };
	const   holdCoord: {x: number, y: number} = { x: x - 20 - holdTexture.width, y: y };
	const   bagsCoord: {x: number, y: number} = { x: x + 20 + matrixTexture.width, y: y};

	ctx.drawImage(matrixTexture, matrixCoord.x, matrixCoord.y, matrixTexture.width, matrixTexture.height);
	ctx.drawImage(holdTexture, holdCoord.x, holdCoord.y, holdTexture.width, holdTexture.height);
	ctx.drawImage(bagsTexture, bagsCoord.x, bagsCoord.y, bagsTexture.width, bagsTexture.height);

}

//
// export const    borderSize = 2;
// // export const    minoSize = 32;
// // export const    boardWidth = minoSize * 10;
// // export const    boardHeight = minoSize * 23;
// // export const    boardCoord = {x: 4 * minoSize + borderSize, y: 0}
// export const    holdWidth = (minoSize * 4) + 8;
// // export const    holdHeight = (minoSize * 4) + 8;
// // export const    holdCoord = {x: 0, y: 0}
// export const    bagWidth = minoSize * 4;
// export const    bagHeight = boardHeight;
// export const    bagCoord = {x: (14 * minoSize) + (borderSize * 2), y: 0}
//
// // export const    canvasWidth = boardWidth + bagWidth + holdWidth + (borderSize * 2);
// // export const    canvasHeight = boardHeight;


const   drawGame = () => {
	const canvas = document.getElementById("tetrisCanvas")  as HTMLCanvasElement;
	const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;
	const game = tetrisGameInfo.getGame();

	if (!canvas || !ctx || !game)
		return ;

	const   minoSize = 32;
	const   boardCoord: { x: number, y: number } = { x: ((canvas.width / 2) - (tetrisTextures["MATRIX"].width / 2)), y: ((canvas.height / 2) - (tetrisTextures["MATRIX"].height / 2)) };
	const   matrixCoord: { x: number, y: number } = { x: ((canvas.width / 2) - (5 * minoSize)), y: ((canvas.height / 2) - (11.5 * minoSize)) };
	const   matrixSize: { width: number, height: number } = { width: (10 * minoSize), height: (23 * minoSize) };
	const   holdCoord: { x: number, y: number } = { x: (matrixCoord.x - tetrisTextures["HOLD"].width - 20) + 10, y: (matrixCoord.y + 20) + 10 }
	const   bagsCoord: { x: number, y: number } = { x: (matrixCoord.x + matrixSize.width + 20) + 30, y: (matrixCoord.y + 20) + 10 }

	// console.log("Matrix Size: ", matrixSize); // height: 736 width: 320

	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		// setTimeout(drawBoard, 100);
	});
	//
	// document.getElementById("score")!.innerText = "Score: " + tetrisGameInfo.getGame()?.score;
	// // document.getElementById("time")!.innerText = "Time: " +
	// // 	(new Date(tetrisGameInfo.getGame()?.time || 0).toISOString().substring(11, 23)); // TODO : add this line
	// document.getElementById("PPS")!.innerText = "Pieces: " + tetrisGameInfo.getGame()?.piecesPlaced +
	// 	", " + tetrisGameInfo.getGame()?.piecesPerSecond + "/S"; // TODO : add this line
	// document.getElementById("score")!.innerText = "Score: " + tetrisGameInfo.getGame()?.score;
	// document.getElementById("awaitingGarbage")!.innerText = "Incoming Garbage: " + JSON.stringify(tetrisGameInfo.getGame()?.awaitingGarbage);
	if (!ctx || !game)
		return;
	drawBackground(ctx, 0, 0, canvas.width, canvas.height);
	drawBoard(ctx, boardCoord.x, boardCoord.y);
	drawMatrix(ctx, game.matrix, matrixCoord.x, matrixCoord.y, minoSize);
	if (tetrisGameInfo.getSettingsValue("showBags") && game.bags)
		drawBag(ctx, game.bags, bagsCoord);
	if (game.hold)
		drawHold(ctx, game.hold, holdCoord);
}

const multiplayerRoom = (arg: loadTetrisArgs) => {
	loadTetrisHtml("multiplayer-room", arg);
	document.getElementById("idle")?.addEventListener("click", () => { resetGamesSocket("home"); loadTetrisPage("idle") });
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
		postToApi(`http://${address}/api/tetris/roomCommand`, { argument: "settings", gameId: 0, roomCode: tetrisGameInfo.getRoomCode(), prefix: tetrisGameInfo.getSettings() })});

}

export const displayMultiplayerRooms = (rooms: roomInfo[]) => {
	loadTetrisHtml("display-multiplayer-room", { rooms: rooms });
	document.getElementById("idle")?.addEventListener("click", () => { resetGamesSocket("home"); loadTetrisPage("idle") });
	document.getElementById("submit")?.addEventListener("click", () =>
		joinRoom((document.getElementById("room-code") as HTMLInputElement).value));
	document.getElementById("refresh")?.addEventListener("click", () => getMultiplayerRooms());

}
