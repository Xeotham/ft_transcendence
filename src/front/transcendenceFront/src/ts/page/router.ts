// IMPORTS ////////////////
// @ts-ignore
import  page from 'page';
// ZONE
import { zoneSet } from "../zone/zoneCore.ts";
// TETRIS
import { loadTetrisPage, tetrisGameInformation } from "../tetris/tetris.ts";
import { getMultiplayerRooms, joinRoom } from "../tetris/gameManagement.ts";
// PONG
// import  { loadPongPage } from "../pong/pong.ts";
import  { getTournamentInfo, getTourRoomInfo, listTournaments } from "../pong/tournament.ts";
import  { getRoomInfo, listRoomsSpectator } from "../pong/spectate.ts";
// import {loginUser, logoutUser, signUpUser} from "../userManagement/userManagement.ts";

// Start the router
export const startRouter = () => {
	// ROOT
	page('/', () => zoneSet("HOME"));
	// PONG
	pongRouter();
	// TETRIS
	tetrisRouter();
	// LOGIN
	// loginRouter();
	// 404
	page('*', () => {
		console.log('404 Not Found');
		page.show("/")
	});
	// start the router
	page();
}

const tetrisRouter = () => {
	// TETRIS IDLE
	page("/tetris", () => {
		zoneSet("TETRIS");
	});
	// TETRIS MULTIPLAYER ROOM LIST
	page("/tetris/room-list", () => {
		getMultiplayerRooms();
		zoneSet("TETRIS");
	});
	// @ts-ignore TETRIS MULTIPLAYER ROOM JOIN
	page("/tetris/room:code", ({params}) => {
		let roomCode: string = params.code.toString().substring(1);
		// console.log("In the router. Room code: " + roomCode);
		if (tetrisGameInformation.getRoomCode() === "")
			joinRoom(roomCode);
		loadTetrisPage("multiplayer-room", {rooms:[{roomCode: roomCode}]});
		zoneSet("TETRIS");
	})
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
	page("/pong/list/tournaments", () => {
		listTournaments();
		zoneSet("PONG");
	});
	// PONG ROOM SPECTATOR LIST
	page("/pong/list/rooms-spectator", () => {
		listRoomsSpectator();
		zoneSet("PONG");
	});
	// @ts-ignore PONG TOURNAMENT INFO	
	page("/pong/tournament/:id", ({ params } ) => {
		const   tournamentId = Number(params.id);
		//console.log("Type: " + typeof tournamentId + " Value: " + tournamentId);
		getTournamentInfo(tournamentId);
		zoneSet("PONG");
	}) // TODO: Modify this route to return to pong idle and join tournament if possible
	// @ts-ignore PONG ROOM INFO	
	page("/pong/room/:id", ({ params } ) => {
		const   roomId = Number(params.id);
		getRoomInfo(roomId);
		zoneSet("PONG");
	})
	// @ts-ignore PONG TOURNAMENT ROOM INFO
	page("/pong/tournament/room/:id", ({ params } ) => {
		const   roomId = Number(params.id);
		getTourRoomInfo(roomId);
		zoneSet("PONG");
	})
}

// const loginRouter = () => {
// 	page('/login', () => {
// 		loginUser();
// 		zoneSet("HOME");
// 	});
// }
