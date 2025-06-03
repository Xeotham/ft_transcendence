import {
	bagWidth,
	getMinoTexture, holdWidth, holdHeight,
	keys,
	loadTetrisArgs,
	loadTetrisType,
	minoInfo,
	roomInfo,
	setKey, tetriminoInfo, tetriminoPatterns,
	tetrisGame, tetrisGoalInfo, tetrisGameInfo, minoSize
} from "./utils.ts";

import { tetrisDisplayMultiplayerRoom } from "./tetrisMultiplayerDisplayHTML.ts";
import { tetrisMultiplayerRoom } from "./tetrisMultiplayerCreateHTML.ts";
import { tetrisEmptyHtml, tetrisBoardHtml, tetrisLogoHtml, tetrisIdleHtml } from "./tetrisHTML.ts";
import { tetrisSettings } from "./tetrisSettingsHTML.ts";

// @ts-ignore
import page from "page"
import {
	arcadeGame,
	createRoom,
	getMultiplayerRooms,
	searchGame,
} from "./gameManagement.ts";

import {resetGamesSocket} from "../utils.ts";
import { imTexts } from "../imTexts/imTexts.ts";

export const userKeys: keys = new keys();
export const tetrisGameInformation: tetrisGame = new tetrisGame();

export const   loadTetrisPage = (page: loadTetrisType, arg: loadTetrisArgs | null = null) => {
	switch (page) {
		case "empty":
			return emptyPage();
		case "logo":
			return logoPage();
		case "idle":
			return idlePage();
		case "setting":
			return tetrisSettingsPage();
		case "board":
			return drawGame();
		case "multiplayer-room":
			return multiplayerRoom(arg!);
		case "display-multiplayer-room":
			return displayMultiplayerRooms(arg?.rooms!);
	}
}

const   emptyPage = () => {
	tetrisEmptyHtml();

	//tetrisGameInfo.setRoomOwner(false);
	//resetGamesSocket();
}

const   logoPage = () => {
	tetrisLogoHtml();
	//tetrisGameInfo.setRoomOwner(false);
	//resetGamesSocket();
}

const   idlePage = () => {
	resetGamesSocket("home");
	tetrisIdleHtml();

	document.getElementById("arcade")?.addEventListener("click", () => tetrisSoloPage());
	document.getElementById("matchmaking")?.addEventListener("click", () => tetrisVersusPage());
	document.getElementById("get-multiplayer-rooms")?.addEventListener("click", () => page.show("/tetris/room-list"));
	document.getElementById("create-room")?.addEventListener("click", () => tetrisCreateRoomPage()); // TODO : create room
	document.getElementById("setting")?.addEventListener("click", () => page.show("/tetris/settings"));

	document.getElementById("home")?.addEventListener("click", (e) => {
		e.stopPropagation();
		page.show("/");
	});
}

const   tetrisSoloPage = () => {
	arcadeGame();
}

const   tetrisVersusPage = () => {
	searchGame();
}

export const   gameListPage = () => {
	getMultiplayerRooms();
}

export const   tetrisCreateRoomPage = () => {
	createRoom();
	//tetrisMultiplayerRoom();
}

const multiplayerRoom = (arg: loadTetrisArgs) => {
	// console.log("multiplayerRoom called");
	tetrisMultiplayerRoom(arg.rooms?.[0]?.roomCode || ""); // TODO modif ben est ce que c est bo
	//tetrisMultiplayerRoom(arg); //TODO before marchais pas ...
}

export const displayMultiplayerRooms = (rooms: roomInfo[]) => {
	tetrisDisplayMultiplayerRoom(rooms);
}

export const   tetrisSettingsPage = () => {
	//(keys: loadTetrisArgs)
	//loadTetrisHtml("setting", keys);
	//tetrisSettingsPage({keys: userKeys});
	//tetrisSettings(keys);
	// {keys: userKeys}
	tetrisSettings(userKeys);
}

let  modify: boolean = false;

export const changeKeys = (keyType: string) => {
	if (modify)
		return ;

	const pressKey = document.createElement('div');
	pressKey.className = 'fixed inset-0 w-full h-full bg-black/80 z-[9999] flex justify-center items-center text-white text-2xl';
	pressKey.textContent = imTexts.tetrisSettingsKeyChange + " ("+ keyType + ")";
	document.body.appendChild(pressKey);

	modify = true;

	const getNewKey = (event: KeyboardEvent) => {
		const newKey = event.key;
		modify = false;
		setKey(keyType, newKey);
		// console.log("New key set:", newKey);
		document.removeEventListener("keydown", getNewKey);
		//TODO marche pas  ?
		//document.getElementById(keyType)!.innerText = newKey === ' ' ? "Space" : newKey;
		pressKey.remove();
		tetrisSettingsPage();
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

	if (minoTexture === null)
		return ;
	if (minoTexture) {
		ctx.drawImage(minoTexture, x, y, size, size);
	}
	else
		console.error(`Texture not found for ${texture}`);
}

const   drawMatrix = (ctx: CanvasRenderingContext2D, matrix: minoInfo[][], xCoord: number, yCoord: number, minoSize: number) => {
	ctx.beginPath();
	for (let y = matrix.length - 1; y > 16; --y) {
		for (let x = 0; x < matrix[y].length; ++x) {
			const   newX = (x * minoSize) + xCoord;
			const   newY = ((y - 17) * minoSize) + yCoord;
			drawMino(ctx, newX, newY, minoSize, matrix[y][x].texture);
		}
	}
}

const   drawTetrimino = (ctx: CanvasRenderingContext2D, pattern: number[][], coord: {x: number, y: number}, minoLength: number, colors: string[]) => {
	ctx.beginPath();
	for (let y = 0; y < pattern.length; ++y) {
		for (let x = 0; x < pattern[y].length; ++x) {
			const   newX = (x * minoLength) + coord.x;
			const   newY = (y * minoLength) + coord.y;
			if (pattern[y][x] !== 0) {

				drawMino(ctx, newX, newY, minoLength, colors[pattern[y][x]]);
			}
		}
	}
}

// TODO: Fix the hold piece drawing
const   drawHold = (ctx: CanvasRenderingContext2D, hold: tetriminoInfo, holdCoord: {x: number, y: number}) => {
	
	const   pattern = tetriminoPatterns[hold.name];
	const   margin = 10;
	const   holdMinoSize = ((holdWidth - (2 * margin)) / (pattern.length));
	const   colors: string[] = [ "black", tetrisGameInformation.getGame()?.canSwap ? hold.name : hold.name + "_SHADOW" ];

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

const drawInfo = (ctx: CanvasRenderingContext2D, x: number, y: number, gameInfo: tetrisGoalInfo) => {

	const   spacing = 50;
	ctx.textAlign = "right";
	const   writeText = (text: string, x: number, y: number) => {
		ctx.font = "25px Arial";
		ctx.fillStyle = "black";
		ctx.strokeText(text, x, y);
		ctx.fillStyle = "white";
		ctx.fillText(text, x, y);
	}
	writeText("Score: " + gameInfo.score, x, y);
	writeText("Level: " + gameInfo.level, x, y + spacing);
	writeText("Time: " + (new Date(tetrisGameInformation.getGame()?.time || 0).toISOString().substring(14, 23)), x, y + (spacing * 2));
	writeText(`Goal: ${gameInfo.linesCleared} / ${gameInfo.lineClearGoal}`, x, y + (spacing * 3));
	writeText(`Pieces: ${gameInfo.piecesPlaced}, ${gameInfo.piecesPerSecond}/s`, x, y + (spacing * 4));
}

const   drawOpponentsList = (ctx: CanvasRenderingContext2D, x: number, y: number, opponents: tetrisGameInfo[]) => {
	const   margin = 10;
	const   opponentsSize = {width: 340, height: 756};
	const   opponentsNumber = opponents.length;
	const   opponentsBoardInfo: {x: number, y: number, width: number, height: number}[] = [];
	const   matrixTexture = tetrisTextures["MATRIX"];
	let     boardSize = {width: 0, height: 0};

	if (opponents.length === 0)
		return ;
	boardSize.height = (opponentsSize.height - (margin * (opponentsNumber - 1))) / opponentsNumber;
	boardSize.width = opponentsSize.width * (boardSize.height / matrixTexture.height);

	for (let i = 0; i < opponentsNumber; ++i) {
		opponentsBoardInfo.push({
			x: x + ((opponentsSize.width / 2) - (boardSize.width / 2)),
			y: y + (i * (boardSize.height + margin)),
			width: boardSize.width,
			height: boardSize.height});
	}

	opponentsBoardInfo.forEach((boardInfo, index) => {
		ctx.drawImage(matrixTexture, boardInfo.x - (margin / opponentsNumber), boardInfo.y - (margin / opponentsNumber), boardInfo.width, boardInfo.height);
		drawMatrix(ctx, opponents[index].matrix, boardInfo.x, boardInfo.y, (minoSize * boardInfo.width) / matrixTexture.width);
	});
}

const   drawOpponents = (ctx: CanvasRenderingContext2D, x: number, y: number, opponents: tetrisGameInfo[]) => {
	const   rightListCoord: {x: number, y: number} = { x: x, y: y };
	const   leftListCoord: {x: number, y: number} = { x: x - 1075, y: y };
	const   leftList: tetrisGameInfo[] = [];
	const   rightList: tetrisGameInfo[] = [];

	if (!opponents)
		return ;
	opponents.forEach((opponent, index) => {
		if (index % 2 === 0)
			rightList.push(opponent);
		else
			leftList.push(opponent);
	});

	drawOpponentsList(ctx, rightListCoord.x, rightListCoord.y, rightList);
	drawOpponentsList(ctx, leftListCoord.x, leftListCoord.y, leftList);
}

const   drawGame = () => {
	const canvas = document.getElementById("tetrisCanvas")  as HTMLCanvasElement;
	const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;
	const game = tetrisGameInformation.getGame();
	const opponents = tetrisGameInformation.getOpponentsGames();

	if (!canvas || !ctx || !game)
		return ;

	const   minoSize = 32;
	const   boardCoord: { x: number, y: number } = { x: ((canvas.width / 2) - (tetrisTextures["MATRIX"].width / 2)), y: ((canvas.height / 2) - (tetrisTextures["MATRIX"].height / 2)) };
	const   matrixCoord: { x: number, y: number } = { x: ((canvas.width / 2) - (5 * minoSize)), y: ((canvas.height / 2) - (11.5 * minoSize)) };
	const   matrixSize: { width: number, height: number } = { width: (10 * minoSize), height: (23 * minoSize) };
	const   holdCoord: { x: number, y: number } = { x: (matrixCoord.x - tetrisTextures["HOLD"].width - 20) + 10, y: (matrixCoord.y + 20) + 10 }
	const   bagsCoord: { x: number, y: number } = { x: (matrixCoord.x + matrixSize.width + 20) + 30, y: (matrixCoord.y + 20) + 10 }
	const   infoCoord: {x: number, y: number} = { x: (boardCoord.x - 10), y: (boardCoord.y + 400)}
	const   gameInfo: tetrisGoalInfo = {score: game.score, level: game.level, time: game.time, lineClearGoal: game.lineClearGoal, linesCleared: game.linesCleared, piecesPerSecond: game.piecesPerSecond, piecesPlaced: game.piecesPlaced };
	const   opponentsCoord: { x: number, y: number } = { x: (boardCoord.x + matrixSize.width + bagWidth + 100), y: (boardCoord.y)}


	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
	if (!ctx || !game)
		return;
	drawBackground(ctx, 0, 0, canvas.width, canvas.height);
	drawBoard(ctx, boardCoord.x, boardCoord.y);
	drawMatrix(ctx, game.matrix, matrixCoord.x, matrixCoord.y, minoSize);
	drawInfo(ctx, infoCoord.x, infoCoord.y, gameInfo);
	if (opponents && opponents.length > 0)
		drawOpponents(ctx, opponentsCoord.x, opponentsCoord.y, opponents);

	if (tetrisGameInformation.getSettingsValue("showBags") && game.bags)
		drawBag(ctx, game.bags, bagsCoord);
	if (game.hold)
		drawHold(ctx, game.hold, holdCoord);
}

// const multiplayerRoom = (arg: loadTetrisArgs) => {
// 	loadTetrisHtml("multiplayer-room", arg);

// 	document.getElementById("idle")?.addEventListener("click", () => { resetGamesSocket("home"); loadTetrisPage("idle") });
// 	if (!tetrisGameInformation.getRoomOwner())
// 		return ;
// 	document.getElementById("start")?.addEventListener("click", () => startRoom());
// 	document.getElementById("show-shadow")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));
// 	document.getElementById("show-bags")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));
// 	document.getElementById("hold-allowed")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));
// 	document.getElementById("infinite-hold")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));
// 	document.getElementById("infinite-movement")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));
// 	document.getElementById("lock-time")?.addEventListener("change", () => tetrisGameInformation.setNeedSave(true));
// 	document.getElementById("spawn-ARE")?.addEventListener("change", () => tetrisGameInformation.setNeedSave(true));
// 	document.getElementById("soft-drop-amp")?.addEventListener("change", () => tetrisGameInformation.setNeedSave(true));
// 	document.getElementById("level")?.addEventListener("change", () => tetrisGameInformation.setNeedSave(true));
// 	document.getElementById("is-leveling")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));

// 	document.getElementById("save")?.addEventListener("click", () => {
// 		tetrisGameInformation.setSettings({
// 			"showShadowPiece": (document.getElementById("show-shadow") as HTMLInputElement)?.checked,
// 			"showBags": (document.getElementById("show-bags") as HTMLInputElement)?.checked,
// 			"holdAllowed": (document.getElementById("hold-allowed") as HTMLInputElement)?.checked,
// 			"showHold": (document.getElementById("show-hold") as HTMLInputElement)?.checked,
// 			"infiniteHold": (document.getElementById("infinite-hold") as HTMLInputElement)?.checked,
// 			"infiniteMovement": (document.getElementById("infinite-movement") as HTMLInputElement)?.checked,
// 			"lockTime": parseInt((document.getElementById("lock-time") as HTMLInputElement).value),
// 			"spawnARE": parseInt((document.getElementById("spawn-ARE") as HTMLInputElement).value),
// 			"softDropAmp": parseInt((document.getElementById("soft-drop-amp") as HTMLInputElement).value),
// 			"level": parseInt((document.getElementById("level") as HTMLInputElement).value),
// 			"isLevelling": (document.getElementById("is-leveling") as HTMLInputElement)?.checked,
// 		});
// 		tetrisGameInformation.setNeedSave(false);
// 		postToApi(`http://${address}/api/tetris/roomCommand`, { argument: "settings", gameId: 0, roomCode: tetrisGameInformation.getRoomCode(), prefix: tetrisGameInformation.getSettings() })});

// }


// export const displayMultiplayerRooms = (rooms: roomInfo[]) => {
// 	loadTetrisHtml("display-multiplayer-room", { rooms: rooms });

// 	document.getElementById("idle")?.addEventListener("click", () => { resetGamesSocket("home"); loadTetrisPage("idle") });
// 	document.getElementById("submit")?.addEventListener("click", () =>
// 		joinRoom((document.getElementById("room-code") as HTMLInputElement).value));
// 	document.getElementById("refresh")?.addEventListener("click", () => getMultiplayerRooms());

// }