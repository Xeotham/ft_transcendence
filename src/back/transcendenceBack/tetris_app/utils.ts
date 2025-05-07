import { arcadeGamesLst, multiplayerRoomLst } from "./api/controllers";

export interface    tetrisReq {
	argument:	string;
	gameId:		number;
	username?:	string;
	roomCode?:	string;
	prefix?:	any;
}

export const getTetrisGame = (gameId: number) => {
	if (arcadeGamesLst.find((game) => game.getGameId() === gameId))
		return arcadeGamesLst.find((game) => game.getGameId() === gameId);
	return multiplayerRoomLst.find((room => room.getGameById(gameId)))?.getGameById(gameId);
}

export const deleteTetrisGame = (gameId: number) => {
	getTetrisGame(gameId)?.setOver(true);
	if (arcadeGamesLst.find((game) => game.getGameId() === gameId))
		arcadeGamesLst.splice(arcadeGamesLst.indexOf(arcadeGamesLst.find((game) => game.getGameId() === gameId)!), 1);
}

export const codeNameExists = (code: string) => {
	return multiplayerRoomLst.find((room) => { return room.getCode() === code; });
}