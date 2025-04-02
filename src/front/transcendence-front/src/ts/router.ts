// @ts-ignore
import  page from 'page';

// Define your routes
import  { loadPongHtml } from "./pong/pong.ts";
import  { homePage } from "./main.ts";
import {createPrivateRoom, joinMatchmaking, joinPrivRoom, joinSolo, quit} from "./pong/game.ts";
import  { getTournamentInfo, getTournamentName, getTourRoomInfo, listTournaments } from "./pong/tournament.ts";
import  { getRoomInfo, listRoomsSpectator } from "./pong/spectate.ts";

// page.base(`http://${address}:5000`);

page('/', homePage);

page('/pong', () => loadPongHtml("idle"));

page('/tetris', () => {
	alert("Page under construction");
});

page('/login', () => {
	alert("Page under construction");
});

page('/register', () => {
	alert("Page under construction");
});

// Pong routes
page("/pong/join-game", joinMatchmaking);
page("/pong/solo-game", () => {
	loadPongHtml("match-found");
	joinSolo()
});
page("/pong/private-room", createPrivateRoom);
page("/pong/join-private-room", joinPrivRoom);
page("/pong/create-tournament", getTournamentName);
page("/pong/list/tournaments", listTournaments);
page("/pong/list/rooms-spectator", listRoomsSpectator);
page("/pong/quit-room", () => quit("LEAVE"));
page("/pong/game", () => loadPongHtml("board"));
page("/pong/match-found", () => loadPongHtml("match-found"));
// @ts-ignore
page("/pong/tournament/:id", ({ params } ) => {
	const   tournamentId = Number(params.id);

	console.log("Type: " + typeof tournamentId + " Value: " + tournamentId);
	getTournamentInfo(tournamentId);
})

// @ts-ignore
page("/pong/room/:id", ({ params } ) => {
	const   roomId = Number(params.id);

	console.log("Type: " + typeof roomId + " Value: " + roomId);
	getRoomInfo(roomId);
})

// @ts-ignore
page("/pong/tournament/room/:id", ({ params } ) => {
	const   roomId = Number(params.id);

	console.log("Type: " + typeof roomId + " Value: " + roomId);
	getTourRoomInfo(roomId);
})



page('*', () => {
	console.log('404 Not Found');
	page.show("/")
});



// Start the router
page();
