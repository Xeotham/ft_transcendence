import {tetrisTextures, userKeys} from "./tetris.ts";

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
	private retry:                	string;

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
		this.retry                  = "r";
	}
	// Getters
	getMoveLeft(): string { return this.moveLeft ; }
	getMoveRight(): string { return this.moveRight ; }
	getClockwiseRotate(): string { return this.clockwise_rotate; }
	getCounterclockwise(): string { return this.count_clockwise_rotate; }
	getRotate180(): string { return this.rotate_180; }
	getHardDrop(): string { return this.hard_drop; }
	getSoftDrop(): string { return this.soft_drop; }
	getHold(): string { return this.hold; }
	getForfeit(): string { return this.forfeit; }
	getRetry(): string { return this.retry; }
	// Setters
	setMoveLeft(moveLeft: string): void { this.moveLeft = moveLeft; }
	setMoveRight(moveRight: string): void { this.moveRight = moveRight; }
	setClockWiseRotate(clockwise_rotate: string): void { this.clockwise_rotate = clockwise_rotate; }
	SetClockWiseRotate(count_clockwise_rotate: string): void { this.count_clockwise_rotate = count_clockwise_rotate; }
	setRotate180(rotate_180: string): void { this.rotate_180 = rotate_180; }
	setHardDrop(hard_drop: string): void { this.hard_drop = hard_drop; }
	setSoftDrop(soft_drop: string): void { this.soft_drop = soft_drop; }
	setHold(hold: string): void { this.hold = hold; }
	setForfeit(forfeit: string): void { this.forfeit = forfeit; }
	setRetry(retry: string): void { this.retry = retry; }
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
		this.retry					= "r";
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

export interface        tetrisGameInfo {
	matrix:             minoInfo[][];
	bags:               tetriminoInfo[][];
	hold:               tetriminoInfo;
	score:              number;
	level:              number;
	gameId:             number;
	canSwap:            boolean;
	time:               number;
	linesCleared:       number,
	lineClearGoal:      number,
	piecesPlaced:       number,
	piecesPerSecond:    number,
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
		// console.log("Pause timer");
		clearTimeout(this.timer);
		this.timer = 0;
		this.remaining -= Date.now() - this.start;
	}
	resume() {
		// console.log("Resume timer");
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
	socket:			WebSocket | null;
	roomCode:		string;
	roomOwner:		boolean;
	gameId:			number;
	game:			tetrisGameInfo | null;
	keyTimeout:		{[key: string]: TimeoutKey | null};
	keyFirstMove:	{[key: string]: boolean};
	needSave:		boolean;
	settings:		{[key: string]: any};

	// TODO: Add interval for key

	constructor() {
		this.socket = null;
		this.roomCode = "";
		this.roomOwner = false;
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
		this.needSave = false;
		this.settings = {
			"showShadowPiece":			true,
			"showBags":					true,
			"swapAllowed":				true,
			"infiniteHold":				false,
			"infiniteMovement":			false,
			"ARE":						500,
			"spawnARE":					0,
		};
	}
	getSocket(): WebSocket | null { return this.socket; }
	getRoomCode(): string { return this.roomCode; }
	getRoomOwner(): boolean { return this.roomOwner; }
	getGameId(): number { return this.gameId; }
	getGame(): tetrisGameInfo | null { return this.game; }
	getKeyTimeout(arg: string): TimeoutKey | null { return this.keyTimeout[arg]; }
	getKeyFirstMove(arg: string): boolean { return this.keyFirstMove[arg]; }
	getSettings(): any { return this.settings; }
	getNeedSave(): boolean { return this.needSave; }
	getSettingsValue(arg: string): any { return this.settings[arg]; }

	setSocket(socket: WebSocket | null): void { this.socket = socket; }
	setRoomCode(roomCode: string): void { this.roomCode = roomCode; }
	setRoomOwner(roomOwner: boolean): void { this.roomOwner = roomOwner; }
	setGameId(gameId: number): void { this.gameId = gameId; }
	setGame(game: tetrisGameInfo | null): void { this.game = game; }
	setKeyTimeout(arg: string, value: TimeoutKey | null): void { this.keyTimeout[arg] = value; }
	setKeyFirstMove(arg: string, value: boolean): void { this.keyFirstMove[arg] = value; }
	setNeedSave(needSave: boolean): void { this.needSave = needSave; }
	setSettings(settings: any): void { this.settings = settings; }

	reset() {
		this.socket = null;
		this.gameId = -1;
		this.game   = null;
	}
}

export interface roomInfo {
	roomCode:		string;
}

export interface    loadTetrisArgs {
	keys?:  keys;
	rooms?: roomInfo[];
}

export interface    tetrisReq {
	argument:	string;
	gameId:		number;
	username?:	string;
	roomCode?:	string;
	prefix?:	any;
}

export interface    tetrisRes {
	type:       string;
	argument:   string;
	game:	    tetrisGameInfo;
}

export type loadTetrisType = "idle" | "setting" | "keybindings" | "change-key" | "board" | "multiplayer-room" | "display-multiplayer-room";

export const    setKey = (keyType: string, value: string) => {
	switch (keyType) {
		case "moveLeft":
			return userKeys.setMoveLeft(value);
		case "moveRight":
			return userKeys.setMoveRight(value);
		case "rotClock":
			return userKeys.setClockWiseRotate(value);
		case "rotCountClock":
			return userKeys.SetClockWiseRotate(value);
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

export const    getMinoTexture = (texture: string): HTMLImageElement | null => {
	switch (texture) {
		case "I_SHADOW":
		case "J_SHADOW":
		case "L_SHADOW":
		case "O_SHADOW":
		case "S_SHADOW":
		case "T_SHADOW":
		case "Z_SHADOW":
			return tetrisTextures["SHADOW"];
		case "I_LOCKED":
		case "I":
			console.log("I texture");
			return tetrisTextures["I"];
		case "J_LOCKED":
		case "J":
			console.log("J texture");
			return tetrisTextures["J"];
		case "L_LOCKED":
		case "L":
			console.log("L texture");
			return tetrisTextures["L"];
		case "O_LOCKED":
		case "O":
			console.log("O texture");
			return tetrisTextures["O"];
		case "S_LOCKED":
		case "S":
			console.log("S texture");
			return tetrisTextures["S"];
		case "T_LOCKED":
		case "T":
			console.log("T texture");
			return tetrisTextures["T"];
		case "Z_LOCKED":
		case "Z":
			console.log("Z texture");
			return tetrisTextures["Z"];
		case "GARBAGE":
			console.log("GARBAGE texture");
			return tetrisTextures["GARBAGE"];
			//TODO: Do garbage
		default:
			return null;
	}
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
		case "GARBAGE":
		case "GARBAGE_LOCKED":
			return "pink";
		default:
			return "black";
	}
}

export const    tetriminoPatterns: {[key: string]: number[][]} = {
	"I": [
		[ 0, 0, 0, 0 ],
		[ 1, 1, 1, 1 ],
		[ 0, 0, 0, 0 ],
		[ 0, 0, 0, 0 ],
	],
	"J": [
		[ 1, 0, 0 ],
		[ 1, 1, 1 ],
		[ 0, 0, 0 ],
	],
	"L": [
		[ 0, 0, 1 ],
		[ 1, 1, 1 ],
		[ 0, 0, 0 ],
	],
	"O": [
		[ 0, 1, 1 ],
		[ 0, 1, 1 ],
		[ 0, 0, 0 ],
	],
	"S": [
		[ 0 ,1, 1 ],
		[ 1, 1, 0 ],
		[ 0, 0, 0 ],
	],
	"T": [
		[ 0, 1, 0 ],
		[ 1, 1, 1 ],
		[ 0, 0, 0 ],
	],
	"Z": [
		[ 1, 1, 0 ],
		[ 0, 1, 1 ],
		[ 0, 0, 0 ],
	],
}


export const    borderSize = 2;
export const    minoSize = 32;
// export const    boardWidth = minoSize * 10;
// export const    boardHeight = minoSize * 23;
// export const    boardCoord = {x: 4 * minoSize + borderSize, y: 0}
export const    holdWidth = (minoSize * 4);
export const    holdHeight = (minoSize * 4);
// export const    holdCoord = {x: 0, y: 0}
export const    bagWidth = minoSize * 4;
export const    bagHeight = minoSize * 23;
// export const    bagCoord = {x: (14 * minoSize) + (borderSize * 2), y: 0}

// export const    canvasWidth = boardWidth + bagWidth + holdWidth + (borderSize * 2);
// export const    canvasHeight = boardHeight;
