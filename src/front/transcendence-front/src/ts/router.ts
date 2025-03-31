// @ts-ignore
import  page from 'page';

// Define your routes
import { loadPongHtml } from "./pong/pong.ts";
import { homePage } from "./main.ts";
import { joinMatchmaking, joinSolo, quit } from "./pong/game.ts";
import { getTournamentName, listTournaments } from "./pong/tournament.ts";
import { listRoomsSpectator } from "./pong/spectate.ts";

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
page("/pong/create-tournament", getTournamentName);
page("/pong/list/tournaments", listTournaments);
page("/pong/list/rooms-spectator", listRoomsSpectator);
page("/pong/quit-room", () => quit("LEAVE"));
page("/pong/game", () => loadPongHtml("board"));
page("/pong/match-found", () => loadPongHtml("match-found"));

page('*', () => {
	console.log('404 Not Found');
	page.show("/")
});



// Start the router
page();
