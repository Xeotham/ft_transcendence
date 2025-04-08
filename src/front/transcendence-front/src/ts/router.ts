// @ts-ignore
import  page from 'page';

// Define your routes
import  { loadPongPage } from "./pong/pong.ts";
import  { homePage } from "./main.ts";
import  { createPrivateRoom, joinMatchmaking, joinPrivRoom, joinSolo, quit } from "./pong/game.ts";
import  { getTournamentInfo, getTournamentName, getTourRoomInfo, listTournaments } from "./pong/tournament.ts";
import  { getRoomInfo, listRoomsSpectator } from "./pong/spectate.ts";

// page.base(`http://${address}:5000`);

page('/', homePage);

page('/pong', () => loadPongPage("idle"));

page('/tetris', () => {
	alert("Page under construction");
});

page('/login', () => {
	alert("Page under construction");
});

page('/register', () => {
	alert("Page under construction");
});

// TODO: Change all the route to return to a more SPA work (Matchmaking, solo, private room, tournament)

// Pong routes
page("/pong/list/tournaments", listTournaments);
page("/pong/list/rooms-spectator", listRoomsSpectator);
// @ts-ignore
page("/pong/tournament/:id", ({ params } ) => {
	const   tournamentId = Number(params.id);

	console.log("Type: " + typeof tournamentId + " Value: " + tournamentId);
	getTournamentInfo(tournamentId);
}) // TODO: Modify this route to return to pong idle and join tournament if possible

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
