import { tetrisGameInformation } from "./tetris/tetris.ts";
import { pongGameInfo } from "./pong/pong.ts";
import {address, user} from "./immanence.ts";


export class UserInfo {
	private username: string;
	private token: string | null;
	private avatarImg: string;
	constructor() {
		this.username = localStorage.getItem("username") || UserInfo.generateUsername();
		this.token = null;
		this.avatarImg = "http://localhost:5000/src/medias/avatars/avatar1.png"; // Default avatar
	}

	static generateUsername() {
		const   characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const   length = 8;
		let     result: string = "";

		for (let i = 0; i < length; i++)
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		return result;
	}

	getAvatar() {
		return this.avatarImg;
	}

	private static base64ToBlob(base64: string) {
		const byteCharacters = atob(base64);
		const byteArrays = [];

		for (let i = 0; i < byteCharacters.length; i++) {
			byteArrays.push(byteCharacters.charCodeAt(i));
		}

		const byteArray = new Uint8Array(byteArrays);
		return new Blob([byteArray], { type: 'image/png' });
	}

	setAvatar(avatarImg: string) {
		const   avatarBlob = UserInfo.base64ToBlob(avatarImg);
		const   url = URL.createObjectURL(avatarBlob);


		console.log(url);
		document.getElementById("avatarImg")?.setAttribute("src", `${url}`);
		this.avatarImg = url;
	}

	getToken() {
		return this.token;
	}

	isAuthenticated() {
		return this.token !== null && this.token !== undefined && this.token !== "";
	}

	setToken(token: string | null) {
		this.token = token;
		if (token)
			localStorage.setItem("authToken", token);
		else
			localStorage.removeItem("authToken");
	}
	getUsername() {
		return this.username;
	}
	setUsername(username: string) {
		this.username = username;
	}
}

export const    postToApi = async (url: string, data: any) => {
	console.log("Token: ", user.getToken());

	const fetched = await fetch(url, {
		method: 'POST', // Specify the HTTP method
		headers: {
			'Content-Type': 'application/json', // Set the content type to JSON
			'Authorization': `Bearer ${user.getToken() || ""}`, // Include the token
		},
		body: JSON.stringify(data), // Convert the data to a JSON string
	})

	if (!fetched.ok)
	{
		let errorData = await fetched.json();
		console.error('Error in post:', url);
		throw {
			status: fetched.status,
			message: errorData.message || 'An error occurred',
		};
	}
	return fetched.json(); // Parse the JSON response if successful
}

export const    patchToApi = async (url: string, data: any) => {
	const fetched = await fetch(url, {
		method: 'PATCH', // Specify the HTTP method
		headers: {
			'Content-Type': 'application/json', // Set the content type to JSON
			'Authorization': `Bearer ${user.getToken() || ""}`, // Include the token
		},
		body: JSON.stringify(data), // Convert the data to a JSON string
	})

	if (!fetched.ok)
	{
		let errorData = await fetched.json();
		console.error('Error in patch:', url);
		throw {
			status: fetched.status,
			message: errorData.message || 'An error occurred',
		};
	}
	return fetched.json(); // Parse the JSON response if successful
}

export const    getFromApi = async (url: string) => {
	const   response = await fetch(url);
	if (!response.ok) {
		console.error("Error:", response.statusText);
	}
	return response.json();
}

export const    resetGamesSocket = (type: string) => {
	if (tetrisGameInformation.getSocket() && type !== "tetris") {
		tetrisGameInformation.getSocket()?.close();
		postToApi(`http://${address}/api/tetris/forfeit`, { argument: "forfeit", roomId: tetrisGameInformation.getGameId() });
	}
	if (pongGameInfo.getRoom()?.getSocket() && type !== "pong")
		pongGameInfo.getRoom()?.getSocket()?.close();
	if (pongGameInfo.getTournament()?.getSocket() && type !== "pong")
		pongGameInfo.getTournament()?.getSocket()?.close();
}