import	{ FastifyInstance } from "fastify";
import {
	joinMatchmaking,
	joinSolo,
	joinBot,
	quitRoom,
	movePaddle,
	startConfirm,
	getRooms,
	getRoomInfo,
	createPrivateRoom, joinPrivateRoom
} from "./game-controllers";
import {
	startTournament,
	createTournament,
	joinTournament,
	shuffleTree,
	getTournaments,
	getTournamentInfo,
	getTournamentRoundRooms,
	getTourRoomInfo
} from "./tournament-controllers";
import	{ addSpectatorToRoom } from "./spectator-controllers";


export default async function pongRoutes(fastify: FastifyInstance) {

	fastify.get('/joinMatchmaking', {websocket: true}, joinMatchmaking);
	fastify.get('/joinSolo', {websocket: true}, joinSolo);
	fastify.get('/joinBot', {websocket: true}, joinBot);
	fastify.get('/createTournament', {websocket: true}, createTournament);
	fastify.get('/joinTournament', {websocket: true}, joinTournament);
	fastify.get('/addSpectatorToRoom', {websocket: true}, addSpectatorToRoom);
	fastify.post('/shuffleTree', shuffleTree);
	fastify.post('/quitRoom', quitRoom);
	fastify.post('/startConfirm', startConfirm);
	fastify.post('/startTournament', startTournament);
	fastify.post('/movePaddle', movePaddle);
	fastify.get("/get_tournaments", getTournaments);
	fastify.get("/get_tournament_info", getTournamentInfo);
	fastify.get("/get_rooms", getRooms);
	fastify.get("/get_room_info", getRoomInfo);
	fastify.get("/get_tournament_round_rooms", getTournamentRoundRooms);
	fastify.get("/get_tournament_room_info", getTourRoomInfo);
	fastify.get('/createPrivateRoom', {websocket: true}, createPrivateRoom);
	fastify.get('/joinPrivRoom', {websocket: true}, joinPrivateRoom);
}
