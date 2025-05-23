import {
	Game,
	RoomInfo,
	TournamentInfo,
	loadPongHtmlType,
	loadHtmlArg,
	gameInformation,
	boardWidth,
	boardHeight, ballSize
} from "./utils.ts";
import {createPrivateRoom, joinMatchmaking, joinPrivRoom, joinSolo, joinBot, quit} from "./game.ts";
import {getTournamentName} from "./tournament.ts";
import  { loadPongHtml } from "./pongHTML.ts";
import {zoneSet} from "../zone/zoneCore.ts";

// @ts-ignore
import  page from "page"
import {resetGamesSocket} from "../utils.ts";

export const	pongGameInfo: gameInformation = new gameInformation();


export const loadPongPage = (page: loadPongHtmlType, arg: loadHtmlArg | null = null) => {
	switch (page) {
		case "empty":
			return emptyPage();
		case "logo":
			return logoPage();
		case "idle":
			return idlePage();
		case "nav-offline":
			return navOffline();
		case "nav-online":
			return navOnline();
		case "nav-tournament":
			return navTournament();
		case "nav-setting":
			return navSetting();
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

const   emptyPage = () => {
	loadPongHtml("empty");
}

const   logoPage = () => {
	loadPongHtml("logo");
}

// const   idlePage = () => {
// 	loadPongHtml("idle");

// 	resetGamesSocket("pong")
// 	document.getElementById("Join-game")?.addEventListener("click", joinMatchmaking);
// 	document.getElementById("Solo-game")?.addEventListener("click", joinSolo);
// 	document.getElementById("Bot-game")?.addEventListener("click", joinBot);
// 	document.getElementById("Private-room")?.addEventListener("click", createPrivateRoom);
// 	document.getElementById("Join-priv-room")?.addEventListener("click", joinPrivRoom);
// 	document.getElementById("Create-tournament")?.addEventListener("click", getTournamentName);
// 	document.getElementById("Tournaments")?.addEventListener("click", () => { page.show("/pong/list/tournaments"); });
// 	document.getElementById("Rooms-spectator")?.addEventListener("click", () => { page.show("/pong/list/rooms-spectator"); });
// 	document.getElementById("Home")?.addEventListener("click", (e) => { e.stopPropagation(); page.show("/"); });
// }

const   idlePage = () => {
	loadPongHtml("idle");

	resetGamesSocket("pong")
	document.getElementById("offline")?.addEventListener("click", () => { page.show("/pong/offline"); });
	document.getElementById("online")?.addEventListener("click", () => { page.show("/pong/online"); });
	document.getElementById("tournament")?.addEventListener("click", () => { page.show("/pong/tournament"); });
	document.getElementById("setting")?.addEventListener("click", () => { page.show("/pong/setting"); });
	document.getElementById("home")?.addEventListener("click", (e) => { e.stopPropagation(); page.show("/"); });
}

const   navOffline = () => {
	loadPongHtml("nav-offline");

	document.getElementById("solo")?.addEventListener("click", joinSolo);
	document.getElementById("bot")?.addEventListener("click", joinBot);
	document.getElementById("return")?.addEventListener("click", idlePage);
	//document.getElementById("return")?.addEventListener("click", () => page.show("/pong"));
}

const   navOnline = () => {
	loadPongHtml("nav-online");
	document.getElementById("join")?.addEventListener("click", joinMatchmaking);
	document.getElementById("private")?.addEventListener("click", createPrivateRoom);
	document.getElementById("join-priv-room")?.addEventListener("click", joinPrivRoom);
	document.getElementById("spectate")?.addEventListener("click", () => { page.show("/pong/list/rooms-spectator"); });
	document.getElementById("return")?.addEventListener("click", idlePage);
}	

const   navTournament = () => {
	loadPongHtml("nav-tournament");
	document.getElementById("create")?.addEventListener("click", getTournamentName);
	document.getElementById("play")?.addEventListener("click", () => { page.show("/pong/list/tournaments"); });
	document.getElementById("return")?.addEventListener("click", idlePage);
}

const   navSetting = () => {
	loadPongHtml("nav-setting");
	document.getElementById("ok")?.addEventListener("click", () => { page.show("/pong"); });
	document.getElementById("return")?.addEventListener("click", idlePage);
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
		"BACKGROUND": '/src/medias/textures/pong/background.jpg',
		"BOARD": '/src/medias/textures/pong/pongBoard.png',
		"PADDLE": '/src/medias/textures/pong/pongPaddle.png',
		"BALL": '/src/medias/textures/pong/pongBall.png',
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

const   drawBall = (ctx: CanvasRenderingContext2D, coord: { x: number, y: number }) => {
	ctx.drawImage(pongTextures["BALL"], coord.x, coord.y, ballSize * 2, ballSize * 2)
}

const   drawScore = (ctx: CanvasRenderingContext2D, player1: { username: string, score: number }, player2: { username: string, score: number }, canvas: HTMLCanvasElement) => {
	ctx.textAlign = "center";

	const   writeText = (text: string, x: number, y: number) => {
		ctx.font = "30px Arial";
		ctx.fillStyle = "black";
		ctx.strokeText(text, x, y);
		ctx.fillStyle = "white";
		ctx.fillText(text, x, y);
	}
	const   player1Coord = { x: (canvas.width / 2) - 200, y: (canvas.height / 2) - (boardHeight / 2) - 30 };
	const   player2Coord = { x: (canvas.width / 2) + 200, y: (canvas.height / 2) - (boardHeight / 2) - 30 };

	if (pongGameInfo.getRoom()?.getPlayer() == "P2") {
		writeText(`${player1.username}: ${player1.score}`, player2Coord.x, player2Coord.y);
		writeText(`${player2.username}: ${player2.score}`, player1Coord.x, player1Coord.y);
	}
	else {
		writeText(`${player1.username}: ${player1.score}`, player1Coord.x, player1Coord.y);
		writeText(`${player2.username}: ${player2.score}`, player2Coord.x, player2Coord.y);
	}
}

const drawGame =  (game: Game) => {
	const   canvas = document.getElementById("pongCanvas")  as HTMLCanvasElement;
	const   ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;

	const   boardCoord = { x: (canvas.width / 2) - (boardWidth / 2), y: (canvas.height / 2) - (boardHeight / 2) };
	let     paddle1Coord;
	let     paddle2Coord;
	let     ballCoord;

	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	if (game) {
		paddle1Coord = {x: game.paddle1.x + boardCoord.x, y: game.paddle1.y + boardCoord.y};
		paddle2Coord = {x: game.paddle2.x + boardCoord.x, y: game.paddle2.y + boardCoord.y};
		ballCoord = {x: game.ball.x + boardCoord.x - ballSize, y: game.ball.y + boardCoord.y - ballSize};
		if (pongGameInfo.getRoom()?.getPlayer() == "P2") {
			paddle1Coord = { x: canvas.width - paddle1Coord.x - 10, y: paddle1Coord.y };
			paddle2Coord = { x: canvas.width - paddle2Coord.x - 10, y: paddle2Coord.y };
			ballCoord = { x: canvas.width - ballCoord.x - 20, y: ballCoord.y };
		}
	}

	if (!ctx || !game)
		return;

	drawBackground(ctx, canvas.width, canvas.height);
	// Draw board
	drawBoard(ctx, boardCoord)

	// Draw score
	if (game.score)
		drawScore(ctx, game.score.player1, game.score.player2, canvas);
	// c.fillStyle = "black";
	// c.fillRect(0, 0, canvas.width, canvas.height);
	// Draw ball
	drawBall(ctx, ballCoord!);
	// ctx.fillStyle = "white";
	// ctx.beginPath();
	// ctx.arc(game.ball.x + boardCoord.x, game.ball.y + boardCoord.y, game.ball.size, 0, Math.PI * 2);
	// ctx.fill();

	// Draw paddles
	drawPaddle(ctx, paddle1Coord!);
	drawPaddle(ctx, paddle2Coord!);
}
