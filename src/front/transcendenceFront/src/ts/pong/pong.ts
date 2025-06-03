import { RoomInfo, TournamentInfo, loadPongHtmlType, loadHtmlArg, gameInformation } from "./utils.ts";
import { createPrivateRoom, joinMatchmaking, joinPrivRoom, joinSolo, joinBot, quit } from "./game.ts";
import { getTournamentName } from "./tournament.ts";
import { loadPongHtml } from "./pongHTML.ts";
import { drawGame } from "./pongDraw.ts";
import { copyToClipboard } from "../tetris/tetrisMultiplayerCreateHTML.ts";
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

	// document.getElementById("ok")?.addEventListener("click", () => { page.show("/pong"); });
	// document.getElementById("return")?.addEventListener("click", () => { page.show("/pong"); });
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

	document.getElementById("return")?.addEventListener("click", () => page.show("/pong/tournament"));
	document.getElementById("tetrisDisplayMultiplayerRefresh")?.addEventListener("click", () => { tourRoomListPage(rooms) }); //TODO a verifier
}

const   privRoomCreate = (inviteCode: string) => {
	loadPongHtml("priv-room-create", { inviteCode: inviteCode });

	document.getElementById("quit")?.addEventListener("click", () => quit("LEAVE"));

	document.getElementById("clipboardCopy")?.addEventListener("click", async (e) => {
		e.preventDefault();
		await copyToClipboard(inviteCode);		
	});
}

const   privRoomCode = () => {
	loadPongHtml("priv-room-code");

	document.getElementById("back")?.addEventListener("click", () => { page.show("/pong");});

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
