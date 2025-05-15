import {
	Game,
	RoomInfo,
	TournamentInfo,
	loadPongHtmlType,
	loadHtmlArg,
	gameInformation,
	boardWidth,
	boardHeight
} from "./utils.ts";
import {createPrivateRoom, joinMatchmaking, joinPrivRoom, joinSolo, joinBot, quit} from "./game.ts";
import {getTournamentName} from "./tournament.ts";
import  { loadPongHtml } from "./htmlPage.ts";

// @ts-ignore
import  page from "page"
import {resetGamesSocket} from "../utils.ts";

export const	pongGameInfo: gameInformation = new gameInformation();


export const loadPongPage = (page: loadPongHtmlType, arg: loadHtmlArg | null = null) => {
	switch (page) {
		case "idle":
			return idlePage();
		case "match-found":
			return matchFoundPage();
		case "tournament-found":
			return tournamentFoundPage();
		case "confirm":
			return confirmPage();
		case "tournament-name":
			return tournamentNamePage();
		case "spec-room-info":
			return specRoomInfoPage(arg?.roomId!);
		case "tour-info":
			return tourInfoPage(arg?.tourId!, arg?.started!, arg?.tourName!);
		case "list-rooms":
			return roomListPage(arg?.roomLst!);
		case "tour-rooms-list":
			return tourRoomListPage(arg?.roomLst!);
		case "list-tournaments":
			return tournamentListPage(arg?.tourLst!);
		case "board":
			return drawGame(arg?.game!);
		case "tournament-end":
			return tournamentEndPage(arg?.winner!);
		case "priv-room-create":
			return privRoomCreate(arg?.inviteCode!);
		case "priv-room-code":
			return privRoomCode();
	}
}

const   idlePage = () => {
	loadPongHtml("idle");

	resetGamesSocket()
	document.getElementById("home")?.addEventListener("click", () => { page.show("/"); });
	document.getElementById("join-game")?.addEventListener("click", joinMatchmaking);
	document.getElementById("solo-game")?.addEventListener("click", joinSolo);
	document.getElementById("bot-game")?.addEventListener("click", joinBot);
	document.getElementById("private-room")?.addEventListener("click", createPrivateRoom);
	document.getElementById("join-priv-room")?.addEventListener("click", joinPrivRoom);
	document.getElementById("create-tournament")?.addEventListener("click", getTournamentName);
	document.getElementById("tournaments")?.addEventListener("click", () => { page.show("/pong/list/tournaments"); });
	document.getElementById("rooms-spectator")?.addEventListener("click", () => { page.show("/pong/list/rooms-spectator"); });
}

const   matchFoundPage = () => {
	loadPongHtml("match-found");

	document.getElementById("quit")?.addEventListener("click", () => quit("LEAVE"));
}

const   specRoomInfoPage = (roomId: number) => {
	loadPongHtml("spec-room-info", { roomId: roomId });
	document.getElementById("return")?.addEventListener("click", () => page.show("/pong/list/rooms-spectator"));
}

const   tourInfoPage = (tourId: number, started: boolean, name: string) => {
	loadPongHtml("tour-info", { tourId: tourId, started: started, tourName: name });

	document.getElementById("return")?.addEventListener("click", () => page.show("/pong/list/tournament-info"));
}

const   tourRoomListPage = (rooms: RoomInfo[]) => {
	loadPongHtml("tour-rooms-list", { roomLst: rooms });
}

const   privRoomCreate = (inviteCode: string) => {
	loadPongHtml("priv-room-create", { inviteCode: inviteCode });

	document.getElementById("quit")?.addEventListener("click", () => quit("LEAVE"));
}

const   privRoomCode = () => {
	loadPongHtml("priv-room-code");

	document.getElementById("back")?.addEventListener("click", () => { page.show("/pong"); });
}

const roomListPage = (rooms: RoomInfo[]) => {
	loadPongHtml("list-rooms", { roomLst: rooms });

	document.getElementById("back")?.addEventListener("click", () => { page.show("/pong"); });
}

const tournamentListPage = (tournaments: TournamentInfo[]) => {
	loadPongHtml("list-tournaments", { tourLst: tournaments });

	document.getElementById("back")?.addEventListener("click", () => { page.show("/pong"); });
}

const   tournamentNamePage = () => {
	loadPongHtml("tournament-name");
	document.getElementById("back")?.addEventListener("click", () => {page.show("/pong");});
}

const   tournamentEndPage = (winner: number) => {
	loadPongHtml("tournament-end", { winner: winner });

	document.getElementById("home")?.addEventListener("click", () => { page.show("/pong"); });
}

const   tournamentFoundPage = () => {
    loadPongHtml("tournament-found");

	if (!pongGameInfo.getTournament())
		return ;

	document.getElementById("quit")?.addEventListener("click", () => quit("LEAVE"));
}

// TODO: Add spec tournament board

const   confirmPage = () => {
	loadPongHtml("confirm");
}




export const pongTextures: { [key: string]: HTMLImageElement } = {};

export const loadPongTextures = () => {

	const   texturePaths = {
		"BACKGROUND": './src/textures/pong/background.jpg',
		"BOARD": './src/textures/pong/pongBoard.png',
		"PADDLE": './src/textures/pong/pongPaddle.png',
	}

	return Promise.all(
		Object.entries(texturePaths).map(([key, path]) => {
			return new Promise<void>((resolve, reject) => {
				const img = new Image();
				// console.log(`Loading texture: ${key} from ${path}`);
				img.src = path;
				img.onload = () => {
					pongTextures[key] = img;
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


const   drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number ) => {
	ctx.clearRect(0, 0, width, height);
	ctx.drawImage(pongTextures["BACKGROUND"], 0, 0, width, height);
}

const   drawBoard = (ctx: CanvasRenderingContext2D, coord: { x: number, y: number }) => {
	// console.log(coord);
	ctx.drawImage(pongTextures["BOARD"], coord.x, coord.y - 3, boardWidth, boardHeight + 6);
}

const   drawPaddle = (ctx: CanvasRenderingContext2D, coord: { x: number, y: number }) => {
	ctx.drawImage(pongTextures["PADDLE"], coord.x, coord.y, pongTextures["PADDLE"].width, pongTextures["PADDLE"].height);
}

const drawGame =  (game: Game) => {
	const   canvas = document.getElementById("pongCanvas")  as HTMLCanvasElement;
	const   ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;

	const   boardCoord = { x: (canvas.width / 2) - (boardWidth / 2), y: (canvas.height / 2) - (boardHeight / 2) };
	let     paddle1Coord;
	let     paddle2Coord;

	if (game) {
		paddle1Coord = { x: game.paddle1.x + boardCoord.x, y: game.paddle1.y + boardCoord.y };
		paddle2Coord = { x: game.paddle2.x + boardCoord.x, y: game.paddle2.y + boardCoord.y };
	}

	if (!ctx || !game)
		return;

	drawBackground(ctx, canvas.width, canvas.height);
	// Draw board
	drawBoard(ctx, boardCoord)
	// c.fillStyle = "black";
	// c.fillRect(0, 0, canvas.width, canvas.height);
	// Draw ball
	ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(game.ball.x + boardCoord.x, game.ball.y + boardCoord.y, game.ball.size, 0, Math.PI * 2);
	ctx.fill();

	// Draw paddles
	drawPaddle(ctx, paddle1Coord);
	drawPaddle(ctx, paddle2Coord);
}
