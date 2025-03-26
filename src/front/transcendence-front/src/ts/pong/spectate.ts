import  { content, address } from "../main.ts";
import  { specRoomInfoHtml, roomListHtml, gameInfo, idlePage } from "./pong.ts";
import  { PongRoom, messageHandler } from "./game.ts";

const getRoomInfo = async (event:  Event) => {
	if (!content)
		return ;

	const	roomId = (event.target as HTMLButtonElement).getAttribute('id');

	fetch(`http://${address}:3000/api/pong/get_room_info?id=${roomId}`, {
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
		.then(() => {
			specRoomInfoHtml(Number(roomId));

			document.getElementById('roomLst')?.addEventListener("click", listRoomsSpectator);
			document.getElementById('spectate')?.addEventListener("click", () => {
				joinSpectate(Number(roomId))
			});
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
			roomListHtml(data);
			document.getElementById("back")?.addEventListener("click", idlePage);
			// Add event listeners to the buttons
			document.querySelectorAll('.room-button').forEach(button => {
				button.addEventListener('click', getRoomInfo);
			});
		})
		.catch(error => {
			console.error('There was a problem with the fetch operation:', error);
		});
}

async function	joinSpectate(roomId: Number) {
	const   socket = new WebSocket(`ws://${address}:3000/api/pong/addSpectatorToRoom?id=${roomId}`);

	gameInfo.setRoom(new PongRoom(socket));
	gameInfo.getRoom()?.setPlayer("SPEC");

	gameInfo.getRoom()?.initSocket();
	// Listen for messages
	socket.addEventListener("message", messageHandler);
}