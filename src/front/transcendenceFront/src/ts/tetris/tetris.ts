import {
	bagWidth,
	getMinoTexture, holdWidth, holdHeight,
	loadTetrisArgs,
	loadTetrisType,
	minoInfo,
	roomInfo,
	setKey, tetriminoInfo, tetriminoPatterns,
	tetrisGame, tetrisGoalInfo, tetrisGameInfo, minoSize, backgroundHandler, tetrisTexturesHandler
} from "./utils.ts";

import { tetrisDisplayMultiplayerRoom } from "./tetrisMultiplayerDisplayHTML.ts";
import { tetrisMultiplayerRoom } from "./tetrisMultiplayerCreateHTML.ts";
import { tetrisEmptyHtml, tetrisLogoHtml, tetrisIdleHtml } from "./tetrisHTML.ts";
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
import { zoneSet } from "../zone/zoneCore.ts";
import  { userKeys } from "./utils.ts";


// userKeys.getKeysFromApi().then().catch();
export const tetrisGameInformation: tetrisGame = new tetrisGame();

export const   loadTetrisPage = (page: loadTetrisType, arg: loadTetrisArgs | null = null) => {
	// console.log("loadTetrisPage", page);
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
	// console.log("Loading idle page");
	resetGamesSocket("home");
	tetrisIdleHtml();

	document.getElementById("arcade")?.addEventListener("click", () => tetrisSoloPage());
	document.getElementById("matchmaking")?.addEventListener("click", () => tetrisVersusPage());
	document.getElementById("get-multiplayer-rooms")?.addEventListener("click", () => { zoneSet("TETRIS"); gameListPage(); });
	document.getElementById("create-room")?.addEventListener("click", () => tetrisCreateRoomPage());
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
	tetrisMultiplayerRoom(arg.rooms?.[0]?.roomCode || "");
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
	tetrisSettings();
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

	const getNewKey = async (event: KeyboardEvent) => {
		const newKey = event.key;
		modify = false;
		setKey(keyType, newKey);
		localStorage.setItem("tetrisKeybindings", JSON.stringify(userKeys?.getKeys()));

		document.removeEventListener("keydown", getNewKey);
		//document.getElementById(keyType)!.innerText = newKey === ' ' ? "Space" : newKey;
		pressKey.remove();
		loadTetrisPage("setting");
	};

	document.addEventListener("keydown", getNewKey);
}


// export const tetrisTexturesHandler: { [key: string]: HTMLImageElement } = {};
//
// export const loadTetrisTextures = () => {
//
// 	const   texturePaths = {
// 		"I":        '/src/medias/textures/tetris/I.png',
// 		"J":        '/src/medias/textures/tetris/J.png',
// 		"L":        '/src/medias/textures/tetris/L.png',
// 		"O":        '/src/medias/textures/tetris/O.png',
// 		"S":        '/src/medias/textures/tetris/S.png',
// 		"T":        '/src/medias/textures/tetris/T.png',
// 		"Z":        '/src/medias/textures/tetris/Z.png',
// 		"SHADOW":   '/src/medias/textures/tetris/shadow.png',
// 		"MATRIX":   '/src/medias/textures/tetris/matrix.png',
// 		"HOLD":     '/src/medias/textures/tetris/hold.png',
// 		"BAGS":     '/src/medias/textures/tetris/bags.png',
// 		"GARBAGE": '/src/medias/textures/tetris/garbage.png',
// 	}
//
// 	return Promise.all(
// 		Object.entries(texturePaths).map(([key, path]) => {
// 			return new Promise<void>((resolve, reject) => {
// 				const img = new Image();
// 				// console.log(`Loading texture: ${key} from ${path}`);
// 				img.src = path;
// 				img.onload = () => {
// 					tetrisTexturesHandler[key] = img;
// 					resolve();
// 				};
// 				img.onerror = (err) => {
// 					console.error(`Failed to load texture: ${key} from ${path}`, err);
// 					reject(err)
// 				};
// 				// console.log(tetrisTexturesHandler[key]);
// 			});
// 		})
// 	);
// };


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
	const   background = backgroundHandler.getBackgroundTextures();
	const   newx = (width - background.width) / 2;
	const   newy = (height - background.height) / 2;
	ctx.drawImage(background, newx, newy);
}

const   drawBoard = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
	const   matrixTexture = tetrisTexturesHandler.getTexture("MATRIX");
	const   holdTexture = tetrisTexturesHandler.getTexture("HOLD");
	const   bagsTexture = tetrisTexturesHandler.getTexture("BAGS");

	const   matrixCoord: {x: number, y: number} = { x: x, y: y };
	const   holdCoord: {x: number, y: number} = { x: x - 20 - holdTexture.width, y: y };
	const   bagsCoord: {x: number, y: number} = { x: x + 20 + matrixTexture.width, y: y};

	ctx.drawImage(matrixTexture, matrixCoord.x, matrixCoord.y, matrixTexture.width, matrixTexture.height);
	ctx.drawImage(holdTexture, holdCoord.x, holdCoord.y, holdTexture.width, holdTexture.height);
	ctx.drawImage(bagsTexture, bagsCoord.x, bagsCoord.y, bagsTexture.width, bagsTexture.height);

}

const drawInfo = (x: number, y: number, gameInfo: tetrisGoalInfo) => {


	const   spacing = 31;

	const	scoreDiv = document.getElementById("scoreDiv") as HTMLDivElement;
	const	levelDiv = document.getElementById("levelDiv") as HTMLDivElement;
	const	timeDiv = document.getElementById("timeDiv") as HTMLDivElement;
	const	goalDiv = document.getElementById("goalDiv") as HTMLDivElement;
	const	piecesDiv = document.getElementById("piecesDiv") as HTMLDivElement;

	scoreDiv.innerText = `Score: ${gameInfo.score}`;
	levelDiv.innerText = `Level: ${gameInfo.level}`;
	timeDiv.innerText = `Time: ${new Date(tetrisGameInformation.getGame()?.time || 0).toISOString().substring(14, 23)}`;
	goalDiv.innerText = `Goal: ${gameInfo.linesCleared} / ${gameInfo.lineClearGoal}`;
	piecesDiv.innerText = `Pieces: ${gameInfo.piecesPlaced}, ${gameInfo.piecesPerSecond}/s`;

	scoreDiv.style.position = "absolute";
	scoreDiv.style.left = `${x}px`;
	scoreDiv.style.top = `${y}px`;

	levelDiv.style.position = "absolute";
	levelDiv.style.left = `${x}px`;
	levelDiv.style.top = `${y + spacing}px`;

	timeDiv.style.position = "absolute";
	timeDiv.style.left = `${x}px`;
	timeDiv.style.top = `${y + (spacing * 2)}px`;

	goalDiv.style.position = "absolute";
	goalDiv.style.left = `${x}px`;
	goalDiv.style.top = `${y + (spacing * 3)}px`;

	piecesDiv.style.position = "absolute";
	piecesDiv.style.left = `${x}px`;
	piecesDiv.style.top = `${y + (spacing * 4)}px`;
}

const   drawOpponentsList = (ctx: CanvasRenderingContext2D, x: number, y: number, opponents: tetrisGameInfo[]) => {
	const   margin = 10;
	const   opponentsSize = {width: 340, height: 756};
	const   opponentsNumber = opponents.length;
	const   opponentsBoardInfo: {x: number, y: number, width: number, height: number}[] = [];
	const   matrixTexture = tetrisTexturesHandler.getTexture("MATRIX");
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
		drawMatrix(ctx, opponents[index]?.matrix, boardInfo.x, boardInfo.y, (minoSize * boardInfo.width) / matrixTexture.width);
	});
}

const   drawOpponents = (ctx: CanvasRenderingContext2D, x: number, y: number, opponents: tetrisGameInfo[]) => {
	const   rightListCoord: {x: number, y: number} = { x: x, y: y };
	const   leftListCoord: {x: number, y: number} = { x: x - 1250, y: y };
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
	const   textures: {[key: string]: HTMLImageElement} = {
		"MATRIX": tetrisTexturesHandler.getTexture("MATRIX"),
		"HOLD": tetrisTexturesHandler.getTexture("HOLD"),
	};

	if (!canvas || !ctx || !game)
		return ;

	const   minoSize = 32;
	const   boardCoord: { x: number, y: number } = { x: ((canvas.width / 2) - (textures["MATRIX"].width / 2)), y: ((canvas.height / 2) - (textures["MATRIX"].height / 2)) };
	const   matrixCoord: { x: number, y: number } = { x: ((canvas.width / 2) - (5 * minoSize)), y: ((canvas.height / 2) - (11.5 * minoSize)) };
	const   matrixSize: { width: number, height: number } = { width: (10 * minoSize), height: (23 * minoSize) };
	const   holdCoord: { x: number, y: number } = { x: (matrixCoord.x - textures["HOLD"].width - 20) + 10, y: (matrixCoord.y + 20) + 10 }
	const   bagsCoord: { x: number, y: number } = { x: (matrixCoord.x + matrixSize.width + 20) + 30, y: (matrixCoord.y + 20) + 10 }
	const   infoCoord: {x: number, y: number} = { x: (boardCoord.x + textures["MATRIX"].width +  24), y: (boardCoord.y + 575)}
	const   gameInfo: tetrisGoalInfo = {score: game.score, level: game.level, time: game.time, lineClearGoal: game.lineClearGoal, linesCleared: game.linesCleared, piecesPerSecond: game.piecesPerSecond, piecesPlaced: game.piecesPlaced };
	const   opponentsCoord: { x: number, y: number } = { x: (boardCoord.x + matrixSize.width + bagWidth + 200), y: (boardCoord.y)}


	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});
	if (!ctx || !game)
		return;
	drawBackground(ctx, 0, 0, canvas.width, canvas.height);
	drawBoard(ctx, boardCoord.x, boardCoord.y);
	drawMatrix(ctx, game.matrix, matrixCoord.x, matrixCoord.y, minoSize);
	drawInfo(infoCoord.x, infoCoord.y, gameInfo);
	if (opponents && opponents.length > 0)
		drawOpponents(ctx, opponentsCoord.x, opponentsCoord.y, opponents);

	if (tetrisGameInformation.getSettingsValue("showBags") && game.bags)
		drawBag(ctx, game.bags, bagsCoord);
	if (game.hold)
		drawHold(ctx, game.hold, holdCoord);
}
