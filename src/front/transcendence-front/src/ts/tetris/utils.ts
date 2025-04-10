import { userKeys } from "./tetris.ts";

export class   keys {
	private moveLeft:               string;
	private moveRight:              string;
	private clockwise_rotate:       string;
	private count_clockwise_rotate: string;
	private hard_drop:              string;
	private soft_drop:              string;
	private hold:                   string;
	private forfeit:                string;

	constructor() {
		this.moveLeft               = "a";
		this.moveRight              = "d";
		this.clockwise_rotate       = "ArrowRight";
		this.count_clockwise_rotate = "ArrowLeft";
		this.hard_drop              = "ArrowUp";
		this.soft_drop              = "ArrowDown";
		this.hold                   = "Shift";
		this.forfeit                = "Escape";
	}
	// Getters
	getMoveLeft(): string { return this.moveLeft ; }
	getMoveRight(): string { return this.moveRight ; }
	getClockwizeRotate(): string { return this.clockwise_rotate; }
	getCountClockwizeRotate(): string { return this.count_clockwise_rotate; }
	getHardDrop(): string { return this.hard_drop; }
	getSoftDrop(): string { return this.soft_drop; }
	getHold(): string { return this.hold; }
	getForfeit(): string { return this.forfeit; }
	// Setters
	setMoveLeft(moveLeft: string): void { this.moveLeft = moveLeft; }
	setMoveRight(moveRight: string): void { this.moveRight = moveRight; }
	setClockwizeRotate(clockwise_rotate: string): void { this.clockwise_rotate = clockwise_rotate; }
	setCountClockwizeRotate(count_clockwise_rotate: string): void { this.count_clockwise_rotate = count_clockwise_rotate; }
	setHardDrop(hard_drop: string): void { this.hard_drop = hard_drop; }
	setSoftDrop(soft_drop: string): void { this.soft_drop = soft_drop; }
	setHold(hold: string): void { this.hold = hold; }
	setForfeit(forfeit: string): void { this.forfeit = forfeit; }
	// Methods
	resetKeys(): void {
		this.moveLeft               = "a";
		this.moveRight              = "d";
		this.clockwise_rotate       = "ArrowRight";
		this.count_clockwise_rotate = "ArrowLeft";
		this.hard_drop              = "ArrowUp";
		this.soft_drop              = "ArrowDown";
		this.hold                   = "Shift";
		this.forfeit                = "Escape";
	}
}

export class    tetrisGame {

}

export interface    loadTetrisArgs {
	keys?:  keys;
}

export interface    tetrisReq {
	argument: string;
}

export type loadTetrisType = "idle" | "setting" | "keybindings" | "change-key" | "board";

export const    setKey = (keyType: string, value: string) => {
	switch (keyType) {
		case "moveLeft":
			return userKeys.setMoveLeft(value);
		case "moveRight":
			return userKeys.setMoveRight(value);
		case "rotClock":
			return userKeys.setClockwizeRotate(value);
		case "rotCountClock":
			return userKeys.setCountClockwizeRotate(value);
		case "hardDrop":
			return userKeys.setHardDrop(value);
		case "softDrop":
			return userKeys.setSoftDrop(value);
		case "hold":
			return userKeys.setHold(value);
		case "forfeit":
			return userKeys.setForfeit(value);
		default:
			console.error("Invalid key type");
	}
}

export const    postToApi = async (url: string, data: tetrisReq) => {
	const   response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		console.error("Error:", response.statusText);
	}
	console.log(response.json().then((data) => console.log(data)));
	// return response.json();
}

export const    getFromApi = async (url: string) => {
	const   response = await fetch(url);
	if (!response.ok) {
		console.error("Error:", response.statusText);
	}
	return response.json();
}

export const    minoSize = 30;

export const    boardWidth = minoSize * 10;

export const    boardHeight = minoSize * 25;