import {
	Game,
	RoomInfo,
	TournamentInfo,
	loadPongHtmlType,
	loadHtmlArg,
	gameInformation,
	boardWidth,
	boardHeight, ballSize, pongTextureHandler
} from "./utils.ts";
import {createPrivateRoom, joinMatchmaking, joinPrivRoom, joinSolo, joinBot, quit} from "./game.ts";
import {getTournamentName} from "./tournament.ts";
import  { loadPongHtml } from "./pongHTML.ts";
// import {zoneSet} from "../zone/zoneCore.ts";

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

const   idlePage = () => {
	loadPongHtml("idle");
	resetGamesSocket("pong");

	document.getElementById("pongSolo")?.addEventListener("click", () => { page.show("/pong/solo"); });
	document.getElementById("pongVersus")?.addEventListener("click", () => { page.show("/pong/versus"); });
	document.getElementById("pongTournament")?.addEventListener("click", () => { page.show("/pong/tournament"); });
	document.getElementById("pongSettings")?.addEventListener("click", () => { page.show("/pong/settings"); });
	document.getElementById("pongBack")?.addEventListener("click", (e) => { e.stopPropagation(); page.show("/"); });
}

const   navOffline = () => {
	loadPongHtml("nav-offline");

	document.getElementById("pongSoloSolo")?.addEventListener("click", joinSolo);
	document.getElementById("pongSoloBot")?.addEventListener("click", joinBot);
	document.getElementById("pongSoloBack")?.addEventListener("click", () => { page.show("/pong"); });
}

const   navOnline = () => {
	loadPongHtml("nav-online");

	document.getElementById("pongVersusJoin")?.addEventListener("click", joinMatchmaking);
	document.getElementById("pongVersusPrivate")?.addEventListener("click", createPrivateRoom);
	document.getElementById("pongVersusJoinPrivRoom")?.addEventListener("click", joinPrivRoom);
	document.getElementById("pongVersusSpectate")?.addEventListener("click", () => { page.show("/pong/list/rooms-spectator"); });
	document.getElementById("pongVersusBack")?.addEventListener("click", () => { page.show("/pong"); });
}	

const   navTournament = () => {
	loadPongHtml("nav-tournament");

	document.getElementById("pongTournamentCreate")?.addEventListener("click", getTournamentName);
	document.getElementById("pongTournamentPlay")?.addEventListener("click", () => { page.show("/pong/list/tournaments"); });
	document.getElementById("pongTournamentBack")?.addEventListener("click", () => { page.show("/pong"); });
}

const   navSetting = () => {
	loadPongHtml("nav-setting");

	document.getElementById("ok")?.addEventListener("click", () => { page.show("/pong"); });
	document.getElementById("return")?.addEventListener("click", () => { page.show("/pong"); });
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



//
// export const pongTextures: { [key: string]: HTMLImageElement } = {};
//
// export const loadPongTextures = () => {
//
// 	const   texturePaths = {
// 		"BACKGROUND": '/src/medias/textures/pong/background.jpg',
// 		"BOARD": '/src/medias/textures/pong/pongBoard.png',
// 		"PADDLE": '/src/medias/textures/pong/pongPaddle.png',
// 		"BALL": '/src/medias/textures/pong/pongBall.png',
// 	}
//
// 	return Promise.all(
// 		Object.entries(texturePaths).map(([key, path]) => {
// 			return new Promise<void>((resolve, reject) => {
// 				const img = new Image();
// 				// console.log(`Loading texture: ${key} from ${path}`);
// 				img.src = path;
// 				img.onload = () => {
// 					pongTextures[key] = img;
// 					resolve();
// 				};
// 				img.onerror = (err) => {
// 					console.error(`Failed to load texture: ${key} from ${path}`, err);
// 					reject(err)
// 				};
// 				// console.log(tetrisTextures[key]);
// 			});
// 		})
// 	);
// };


const   drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number ) => {
	ctx.clearRect(0, 0, width, height);
	ctx.drawImage(pongTextureHandler.getTexture("BACKGROUND") as HTMLImageElement, 0, 0, width, height);
}

const   drawBoard = (ctx: CanvasRenderingContext2D, coord: { x: number, y: number }) => {
	// console.log(coord);
	ctx.drawImage(pongTextureHandler.getTexture("BOARD") as HTMLImageElement, coord.x, coord.y - 3, boardWidth, boardHeight + 6);
}

const   drawPaddle = (ctx: CanvasRenderingContext2D, coord: { x: number, y: number }, opponent: boolean) => {
	const   paddleTexture = pongTextureHandler.getTexture(opponent ? "OPPONENT_PADDLE" : "USER_PADDLE") as HTMLImageElement;
	ctx.drawImage(paddleTexture, coord.x, coord.y, paddleTexture.width, paddleTexture.height);
}

const   drawBall = (ctx: CanvasRenderingContext2D, coord: { x: number, y: number }) => {
	ctx.drawImage(pongTextureHandler.getTexture("BALL") as HTMLImageElement, coord.x, coord.y, ballSize * 2, ballSize * 2)
}

const   drawScore = (ctx: CanvasRenderingContext2D, player1: { username: string, score: number }, player2: { username: string, score: number }, canvas: HTMLCanvasElement) => {
	ctx.textAlign = "center";

	const   writeText = (text: string, x: number, y: number) => {
		ctx.font = pongTextureHandler.getFont()!;
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

	// Draw background
	// drawBackground(ctx, canvas.width, canvas.height);
	drawBackground(ctx, window.innerWidth, window.innerHeight); // ????

	// Draw board
	drawBoard(ctx, boardCoord);

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
	drawPaddle(ctx, paddle1Coord!, false); // User paddle
	drawPaddle(ctx, paddle2Coord!, true); // Opponent paddle
}
