import { userKeys } from "./tetris.ts";

export class   keys {
	private moveLeft:               string;
	private moveRight:              string;
	private clockwise_rotate:       string;
	private count_clockwise_rotate: string;
	private rotate_180:             string;
	private hard_drop:              string;
	private soft_drop:              string;
	private hold:                   string;
	private forfeit:                string;

	constructor() {
		this.moveLeft               = "a";
		this.moveRight              = "d";
		this.clockwise_rotate       = "ArrowRight";
		this.count_clockwise_rotate = "ArrowLeft";
		this.rotate_180             = "w";
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
	getRotate180(): string { return this.rotate_180; }
	getHardDrop(): string { return this.hard_drop; }
	getSoftDrop(): string { return this.soft_drop; }
	getHold(): string { return this.hold; }
	getForfeit(): string { return this.forfeit; }
	// Setters
	setMoveLeft(moveLeft: string): void { this.moveLeft = moveLeft; }
	setMoveRight(moveRight: string): void { this.moveRight = moveRight; }
	setClockwizeRotate(clockwise_rotate: string): void { this.clockwise_rotate = clockwise_rotate; }
	setCountClockwizeRotate(count_clockwise_rotate: string): void { this.count_clockwise_rotate = count_clockwise_rotate; }
	setRotate180(rotate_180: string): void { this.rotate_180 = rotate_180; }
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
		this.rotate_180             = "w";
		this.hard_drop              = "ArrowUp";
		this.soft_drop              = "ArrowDown";
		this.hold                   = "Shift";
		this.forfeit                = "Escape";
	}
}

export interface tetriminoInfo {
	name:       string;
	rotation:   number;
	texture:    string;
}

export interface minoInfo {
	texture: string;
}

export interface    tetrisGameInfo {
	matrix: minoInfo[][];
	bags:   tetriminoInfo[][];
	hold:   tetriminoInfo;
	score:  number;
	gameId: number;
}

export class   TimeoutKey {
	start:      number;
	timer:      number;
	delay:      number;
	remaining:  number;
	callback:   () => void;

	constructor(callback: () => void, delay: number) {
		this.start = Date.now();
		this.timer = setTimeout(callback, delay);
		this.delay = delay;
		this.remaining = delay;
		this.callback = callback;
	}
	pause() {
		console.log("Pause timer");
		clearTimeout(this.timer);
		this.timer = 0;
		this.remaining -= Date.now() - this.start;
	}
	resume() {
		console.log("Resume timer");
		if (this.timer !== 0) {
			return ;
		}
		this.start = Date.now();
		this.timer = setTimeout(this.callback, this.remaining);
	}
	clear() {
		clearTimeout(this.timer);
		this.timer = 0;
		this.remaining = 0;
		this.start = 0;
		this.delay = 0;
		this.callback = () => {};
	}
}

export class    tetrisGame {
	socket:         WebSocket | null;
	gameId:         number;
	game:           tetrisGameInfo | null;
	keyTimeout:     {[key: string]: TimeoutKey | null};
	keyFirstMove:   {[key: string]: boolean};

	// TODO: Add interval for key

	constructor() {
		this.socket = null;
		this.gameId = -1;
		this.game   = null;
		this.keyTimeout = {
			"moveLeft": null,
			"moveRight": null,
		};
		this.keyFirstMove = {
			"moveLeft": true,
			"moveRight": true,
		};
	}
	getSocket(): WebSocket | null { return this.socket; }
	getGameId(): number { return this.gameId; }
	getGame(): tetrisGameInfo | null { return this.game; }
	getKeyTimeout(arg: string): TimeoutKey | null { return this.keyTimeout[arg]; }
	getKeyFirstMove(arg: string): boolean { return this.keyFirstMove[arg]; }

	setSocket(socket: WebSocket | null): void { this.socket = socket; }
	setGameId(gameId: number): void { this.gameId = gameId; }
	setGame(game: tetrisGameInfo | null): void { this.game = game; }
	setKeyTimeout(arg: string, value: TimeoutKey | null): void { this.keyTimeout[arg] = value; }
	setKeyFirstMove(arg: string, value: boolean): void { this.keyFirstMove[arg] = value; }

	reset() {
		this.socket = null;
		this.gameId = -1;
		this.game   = null;
	}
}

export interface    loadTetrisArgs {
	keys?:  keys;
}

export interface    tetrisReq {
	argument:   string;
	roomId:     number;
}

export interface    tetrisRes {
	type:       string;
	argument:   string;
	game:	    tetrisGameInfo;
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
		case "rot180":
			return userKeys.setRotate180(value);
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
	// console.log("Data: ", data);

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
	// console.log(response.json().then((data) => console.log(data)));
	// return response.json();
}

export const    getFromApi = async (url: string) => {
	const   response = await fetch(url);
	if (!response.ok) {
		console.error("Error:", response.statusText);
	}
	return response.json();
}

export const    getMinoColor = (texture: string): string => {
	switch (texture) {
		case "I_SHADOW":
		case "J_SHADOW":
		case "L_SHADOW":
		case "O_SHADOW":
		case "S_SHADOW":
		case "T_SHADOW":
		case "Z_SHADOW":
			return "gray";
		case "I_LOCKED":
		case "I":
			return "cyan";
		case "J_LOCKED":
		case "J":
			return "blue";
		case "L_LOCKED":
		case "L":
			return "orange";
		case "O_LOCKED":
		case "O":
			return "yellow";
		case "S_LOCKED":
		case "S":
			return "green";
		case "T_LOCKED":
		case "T":
			return "purple";
		case "Z_LOCKED":
		case "Z":
			return "red";
		default:
			return "black";
	}
}

export const    minoSize = 30;

export const    boardWidth = minoSize * 10;

export const    boardHeight = minoSize * 25;