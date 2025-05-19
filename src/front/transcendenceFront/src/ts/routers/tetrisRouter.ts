// @ts-ignore
import page from 'page';
import { loadTetrisPage, tetrisGameInformation } from "../tetris/tetris.ts";
import { getMultiplayerRooms, joinRoom } from "../tetris/gameManagement.ts";

export const tetrisRouter = () => {
	page("/tetris", () => loadTetrisPage("idle"));

	// @ts-ignore
	page("/tetris/room:code", async ({params}) => {
		let roomCode: string = params.code.toString().substring(1);
		const n = async ()  => {
			page.show("/tetris")
		};

		await n();
		// console.log("In the router. Room code: " + roomCode);
		if (tetrisGameInformation.getRoomCode() === "")
			joinRoom(roomCode);
		loadTetrisPage("multiplayer-room", {rooms:[{roomCode: roomCode}]});
	})
}
