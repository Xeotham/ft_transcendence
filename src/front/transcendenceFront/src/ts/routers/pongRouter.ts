// @ts-ignore
import  page from "page";
import  { loadPongPage } from "../pong/pong.ts";
import  { getTournamentInfo, getTourRoomInfo, listTournaments } from "../pong/tournament.ts";
import  { getRoomInfo, listRoomsSpectator } from "../pong/spectate.ts";

export const   pongRouter = () => {
	page('/pong', () => loadPongPage("idle"));

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
}
