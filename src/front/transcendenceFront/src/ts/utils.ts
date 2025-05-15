import { tetrisGameInfo } from "./tetris/tetris.ts";
import { pongGameInfo } from "./pong/pong.ts";
import { address } from "./main.ts";

export const    postToApi = async (url: string, data: any) => {
	// console.log("Data: ", data);

	await fetch(url, {
		method: 'POST', // Specify the HTTP method
		headers: {
			'Content-Type': 'application/json', // Set the content type to JSON
		},
		body: JSON.stringify(data), // Convert the data to a JSON string
	})
	.then(async response => {
		if (!response.ok) {
			// Check if the response status is not OK (status code 200-299)
			let errorData = await response.json();
			console.error('Error in post:', url);
			throw {
				status: response.status,
				message: errorData.message || 'An error occurred',
			};
		}
		return response.json(); // Parse the JSON response if successful
	})
	// .then(data => {
	// 	// Handle the successful response data
	// 	console.log('Success:', data);
	// })
	// .catch(error => {
	// 	// Handle the error
	// 	console.error('Error:', error.status, error.message);
	// 	throw error;
	// });
}

export const    getFromApi = async (url: string) => {
	const   response = await fetch(url);
	if (!response.ok) {
		console.error("Error:", response.statusText);
	}
	return response.json();
}

export const    resetGamesSocket = (type: string) => {
	if (tetrisGameInfo.getSocket() && type !== "tetris") {
		tetrisGameInfo.getSocket()?.close();
		postToApi(`http://${address}/api/tetris/forfeit`, { argument: "forfeit", roomId: tetrisGameInfo.getGameId() });
	}
	if (pongGameInfo.getRoom()?.getSocket() && type !== "pong")
		pongGameInfo.getRoom()?.getSocket()?.close();
	if (pongGameInfo.getTournament()?.getSocket() && type !== "pong")
		pongGameInfo.getTournament()?.getSocket()?.close();
}