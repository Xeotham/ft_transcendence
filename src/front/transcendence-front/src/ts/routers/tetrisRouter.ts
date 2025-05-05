// @ts-ignore
import page from 'page';
import { loadTetrisPage, tetrisGameInfo } from "../tetris/tetris.ts";
import { getMultiplayerRooms, joinRoom } from "../tetris/gameManagement.ts";

export const tetrisRouter = () => {
	page("/tetris", () => loadTetrisPage("idle"));

	page("/tetris/room-list", getMultiplayerRooms);

	// @ts-ignore
	page("/tetris/room:code", ({params}) => {
		let roomCode: string = params.code.toString().substring(1);
		// console.log("In the router. Room code: " + roomCode);
		if (tetrisGameInfo.getRoomCode() === "")
			joinRoom(roomCode);
		loadTetrisPage("multiplayer-room", {rooms:[{roomCode: roomCode}]});
	})
}
