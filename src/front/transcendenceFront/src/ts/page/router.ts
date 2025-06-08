// IMPORTS ////////////////
// @ts-ignore
import  page from 'page';
// ZONE
import { zoneSet } from "../zone/zoneCore.ts";
// TETRIS
import { loadTetrisPage } from "../tetris/tetris.ts";
// PONG
import  { loadPongPage } from "../pong/pong.ts";
import  { listTournaments } from "../pong/tournament.ts";
import  { getRoomInfo, listRoomsSpectator } from "../pong/spectate.ts";

// Start the router
export const startRouter = () => {

	// ROOT
	page('/', () => zoneSet("HOME"));
	// PONG
	pongRouter();
	// TETRIS
	tetrisRouter();
	// 404
	page('*', () => {
		console.log("404 Not Found: " + document.location.pathname);
		page.show("/")
	});

	// start the router
	page();
}

const pongRouter = () => {
	// PONG IDLE
	page('/pong', () => {
		zoneSet("PONG");
		loadPongPage("idle");
	});
	// PONG OFFLINE
	page("/pong/solo", () => {
		zoneSet("PONG");
		loadPongPage("nav-offline");
	});
	// PONG ONLINE
	page("/pong/versus", () => {
		zoneSet("PONG");
		loadPongPage("nav-online");
	});
	// PONG TOURNAMENT
	page("/pong/tournament", () => {
		zoneSet("PONG");
		loadPongPage("nav-tournament");
	});
	// PONG SETTING
	page("/pong/settings", () => {
		zoneSet("PONG");
		loadPongPage("nav-setting");
	});
	// PONG TOURNAMENT LIST
	page("/pong/tournaments/list", () => {
		listTournaments();
		zoneSet("PONG");
	});
	// PONG ROOM SPECTATOR LIST
	page("/pong/list/rooms-spectator", () => {
		listRoomsSpectator();
		zoneSet("PONG");
	});
	// @ts-ignore PONG ROOM INFO
	page("/pong/room/:id", ({ params } ) => {
		const   roomId = Number(params.id);
		getRoomInfo(roomId);
		zoneSet("PONG");
	})
}

const tetrisRouter = () => {
	// TETRIS IDLE
	page("/tetris", () => {
		zoneSet("TETRIS");
		loadTetrisPage("idle");	
	});

	// TETRIS SETTINGS
	page("/tetris/settings", () => {
		zoneSet("TETRIS");
		loadTetrisPage("setting");
	});
}

