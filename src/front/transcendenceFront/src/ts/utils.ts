import { tetrisGameInformation } from "./tetris/tetris.ts";
import { pongGameInfo } from "./pong/pong.ts";
import { setZoneAvatar } from "./zone/zoneHTML.ts";

export class UserInfo {
	private username: string;
	private token: string | null;
	private avatarImg: string;
	constructor() {
		this.token = localStorage.getItem("authToken") || null;
		if (!this.token)
			localStorage.clear();
		this.username = localStorage.getItem("username") || "";
		this.avatarImg = "http://localhost:5000/src/medias/avatars/avatar1.png"; // Default avatar
	}

	static generateUsername() {
		const   characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const   length = 8;
		let     result: string = "";

		for (let i = 0; i < length; i++)
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		// console.log("Generated username:", result);
		return result;
	}

	getAvatar() {
		return this.avatarImg;
	}

	static base64ToBlob(base64: string) {
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

		document.getElementById("avatarImg")?.setAttribute("src", `${url}`);
		this.avatarImg = url;
	}

	getToken() {
		return this.token;
	}

	isAuthenticated() {
		const result = this.token !== null && this.token !== undefined && this.token !== "";
		setZoneAvatar(result);

		return result;
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
		localStorage.setItem('username', username);
		this.username = username;
	}

	resetUser() {
		this.username = "";
		this.token = null;
		this.avatarImg = "http://localhost:5000/src/medias/avatars/avatar1.png"; // Default avatar
	}
}

// adress
export const	address = import.meta.env.VITE_API_ADDRESS;
export const	user = new UserInfo();

export const    postToApi = async (url: string, data: any) => {
	// console.log("Token: ", user.getToken());

	const fetched = await fetch(url, {
		method: 'POST', // Specify the HTTP method
		headers: {
			'Content-Type': 'application/json', // Set the content type to JSON
			'Authorization': `Bearer ${user.getToken() || ""}`, // Include the token
			'username': user.getUsername() || "", // Include the username
		},
		body: JSON.stringify(data), // Convert the data to a JSON string
	})

	if (!fetched.ok)
	{
		let errorData = await fetched.json();
		if (fetched.status === 401 && errorData.disconnect) {
			console.log("Disconnecting user due to 401 error");
			localStorage.clear();
			user.resetUser();
		}
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
			'username': user.getUsername() || "", // Include the username
		},
		body: JSON.stringify(data), // Convert the data to a JSON string
	})

	if (!fetched.ok)
	{
		let errorData = await fetched.json();
		console.error('Error in patch:', errorData);
		if (fetched.status === 401 && errorData.disconnect) {
			console.log("Disconnecting user due to 401 error");
			localStorage.clear();
			user.resetUser();
		}
		throw {
			status: fetched.status,
			message: errorData.message || 'An error occurred',
		};
	}
	return fetched.json(); // Parse the JSON response if successful
}

export const    getFromApi = async (url: string) => {
	const   response = await fetch(url, {
		method: "GET", // Specify the HTTP method
		headers: {
			'Authorization': `Bearer ${user.getToken() || ""}`, // Include the token
			'username': user.getUsername() || "", // Include the username
		}
	});
	if (!response.ok) {
		console.error("Error:", ((await response.json()).message) || response.statusText);
		const   errorData = await response.json();
		if (response.status === 401 && errorData.disconnect) {
			console.error("Disconnecting user due to 401 error");
			localStorage.clear();
			user.resetUser();
		}
		throw new Error(response.statusText);
	}
	return response.json();
}

export const    resetGamesSocket = (type: string) => {
	if (tetrisGameInformation.getSocket() && type !== "tetris") {
		tetrisGameInformation.getSocket()?.close();
	}
	if (pongGameInfo.getRoom()?.getSocket() && type !== "pong")
		pongGameInfo.getRoom()?.getSocket()?.close();
	if (pongGameInfo.getTournament()?.getSocket() && type !== "pong")
		pongGameInfo.getTournament()?.getSocket()?.close();
	// window.onunload = null;
	window.onbeforeunload = null;
}

export class   keys {
	private moveLeft:               string;
	private moveRight:              string;
	private rotateClockwise:		string;
	private rotateCounterClockwise:	string;
	private rotate180:				string;
	private hardDrop:				string;
	private softDrop:				string;
	private hold:                   string;
	private forfeit:                string;
	private retry:                	string;

	constructor() {
		this.moveLeft               = "a";
		this.moveRight              = "d";
		this.rotateClockwise        = "ArrowRight";
		this.rotateCounterClockwise = "ArrowLeft";
		this.rotate180              = "w";
		this.hardDrop               = "ArrowUp";
		this.softDrop               = "ArrowDown";
		this.hold                   = "Shift";
		this.forfeit                = "Escape";
		this.retry                  = "r";
	}
	// Getters
	getMoveLeft(): string { return this.moveLeft ; }
	getMoveRight(): string { return this.moveRight ; }
	getClockwiseRotate(): string { return this.rotateClockwise; }
	getCounterclockwise(): string { return this.rotateCounterClockwise; }
	getRotate180(): string { return this.rotate180; }
	getHardDrop(): string { return this.hardDrop; }
	getSoftDrop(): string { return this.softDrop; }
	getHold(): string { return this.hold; }
	getForfeit(): string { return this.forfeit; }
	getRetry(): string { return this.retry; }
	// Setters
	setMoveLeft(moveLeft: string): void { this.moveLeft = moveLeft; }
	setMoveRight(moveRight: string): void { this.moveRight = moveRight; }
	setClockWiseRotate(clockwise_rotate: string): void { this.rotateClockwise = clockwise_rotate; }
	SetClockWiseRotate(count_clockwise_rotate: string): void { this.rotateCounterClockwise = count_clockwise_rotate; }
	setRotate180(rotate_180: string): void { this.rotate180 = rotate_180; }
	setHardDrop(hard_drop: string): void { this.hardDrop = hard_drop; }
	setSoftDrop(soft_drop: string): void { this.softDrop = soft_drop; }
	setHold(hold: string): void { this.hold = hold; }
	setForfeit(forfeit: string): void { this.forfeit = forfeit; }
	setRetry(retry: string): void { this.retry = retry; }
	// Methods

	resetKeys(): void {
		this.moveLeft               = "a";
		this.moveRight              = "d";
		this.rotateClockwise       = "ArrowRight";
		this.rotateCounterClockwise = "ArrowLeft";
		this.rotate180             = "w";
		this.hardDrop              = "ArrowUp";
		this.softDrop              = "ArrowDown";
		this.hold                   = "Shift";
		this.forfeit                = "Escape";
		this.retry					= "r";
	}

	async build() {

		const   keys: { moveLeft: string, moveRight: string, rotateClockwise: string, rotateCounterClockwise: string, rotate180: string, hardDrop: string,
			softDrop: string, hold: string, forfeit: string, retry: string,} = (await getFromApi(`http://${address}/api/user/get-parameter?username=${user.getUsername()}`)).parameter;


		this.moveLeft               = keys.moveLeft || "a";
		this.moveRight              = keys.moveRight || "d";
		this.rotateClockwise       = keys.rotateClockwise || "ArrowRight";
		this.rotateCounterClockwise = keys.rotateCounterClockwise || "ArrowLeft";
		this.rotate180             = keys.rotate180 || "w";
		this.hardDrop              = keys.hardDrop || "ArrowUp";
		this.softDrop              = keys.softDrop || "ArrowDown";
		this.hold                   = keys.hold || "Shift";
		this.forfeit                = keys.forfeit || "Escape";
		this.retry					= "r";
		return this;
	}

}


// export const syncKeys = async () => {
// 	try {
// 		const   keys: { moveLeft: string, moveRight: string, rotateClockwise: string, rotateCounterClockwise: string, rotate180: string, hardDrop: string,
// 			softDrop: string, hold: string, forfeit: string, retry: string,} = (await getFromApi(`http://${address}/api/user/get-parameter?username=${user.getUsername()}`)).parameter;
//
// 		Object.entries(keys).forEach(([key, value]) => {
// 			console.log(key, value)
// 			setKey(key, value);
// 		});
// 		console.log(userKeys);
//
// 	}
// 	catch (error) {
// 		console.error("Error loading user keys:", error);
// 	}
// }

export let userKeys: keys | null = null;

(async () => {
	if (!user.isAuthenticated())
		return ;
	const   newKeys = new keys();

	userKeys = await newKeys.build();
	// console.log("Loaded keys: ", newKeys);
})()

