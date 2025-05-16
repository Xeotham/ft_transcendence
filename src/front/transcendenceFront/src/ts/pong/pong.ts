import {Game, RoomInfo, TournamentInfo, loadPongHtmlType, loadHtmlArg, gameInformation} from "./utils.ts";
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
		case "match-found":
			return matchFoundPage();
		case "tournament-found":
			return tournamentFoundPage();
		case "board":
			return drawBoard();
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
		case "draw-game":
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

	resetGamesSocket()
	document.getElementById("Join-game")?.addEventListener("click", joinMatchmaking);
	document.getElementById("Solo-game")?.addEventListener("click", joinSolo);
	document.getElementById("Bot-game")?.addEventListener("click", joinBot);
	document.getElementById("Private-room")?.addEventListener("click", createPrivateRoom);
	document.getElementById("Join-priv-room")?.addEventListener("click", joinPrivRoom);
	document.getElementById("Create-tournament")?.addEventListener("click", getTournamentName);
	document.getElementById("Tournaments")?.addEventListener("click", () => { page.show("/pong/list/tournaments"); });
	document.getElementById("Rooms-spectator")?.addEventListener("click", () => { page.show("/pong/list/rooms-spectator"); });
	document.getElementById("Home")?.addEventListener("click", () => { page.show("/"); //zoneSet("HOME");   
	});
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

const   drawBoard = () => {
	loadPongHtml("board");
	document.getElementById("quit")?.addEventListener("click", () => quit("LEAVE"));
}

const   confirmPage = () => {
	loadPongHtml("confirm");
}

function drawGame(game: Game) {
	const canvas = document.getElementById("gameCanvas")  as HTMLCanvasElement;
	const c = canvas?.getContext("2d") as CanvasRenderingContext2D;

	if (!c || !game)
		return;
	c.clearRect(0, 0, canvas.width, canvas.height);

	// Draw ball
	c.fillStyle = "white";
	c.beginPath();
	c.arc(game.ball.x, game.ball.y, game.ball.size, 0, Math.PI * 2);
	c.fill();

	// Draw paddles
	c.fillRect(game.paddle1.x, game.paddle1.y, game.paddle1.x_size, game.paddle1.y_size); // Left Paddle
	c.fillRect(game.paddle2.x, game.paddle2.y, game.paddle2.x_size, game.paddle2.y_size); // Right Paddle
}
