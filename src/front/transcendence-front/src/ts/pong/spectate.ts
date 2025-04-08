// @ts-ignore
import  page from "page";
import  { address } from "../main.ts";
import  { gameInfo, loadPongPage } from "./pong.ts";
import  { PongRoom, messageHandler } from "./game.ts";
import { RoomInfo } from "./utils.ts";

export const getRoomInfo = (id: number) => {

	fetch(`http://${address}:3000/api/pong/get_room_info?id=${id}`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText);
			}
			return response.json();
		})
		.then((data: RoomInfo) => {
			const   full = data.full;
			const   isSolo = data.isSolo;

			if (full === undefined || isSolo === undefined)
				throw new Error("Room does not exist");
			loadPongPage("spec-room-info", { roomId: id });

			document.getElementById('spectate')?.addEventListener("click", () => {
				joinSpectate(id);
			});
		})
		.catch(error => {
			alert(error);
			page.show("/pong/list/rooms-spectator");
		});
}

export const listRoomsSpectator = () => {
	fetch(`http://${address}:3000/api/pong/get_rooms`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText);
			}
			return response.json();
		})
		.then(data => {
			loadPongPage("list-rooms", { roomLst: data });
			// Add event listeners to the buttons
		})
		.catch(error => {
			console.error('There was a problem with the fetch operation:', error);
		});
}

export async function	joinSpectate(roomId: Number) {
	const   socket = new WebSocket(`ws://${address}:3000/api/pong/addSpectatorToRoom?id=${roomId}`);

	gameInfo.setRoom(new PongRoom(socket));
	gameInfo.getRoom()?.setPlayer("SPEC");

	gameInfo.getRoom()?.initSocket();
	// Listen for messages
	socket.addEventListener("message", messageHandler);
}