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
		this.rotate_180             = "ArrowUp";
		this.hard_drop              = "w";
		this.soft_drop              = "s";
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
		this.rotate_180             = "ArrowUp";
		this.hard_drop              = "w";
		this.soft_drop              = "s";
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

export class    TimeoutKey {
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

class    sfxHandler {
	private readonly sfx: {[key: string]: HTMLAudioElement};
	constructor() {
		this.sfx = {
			/* ==== BTB ==== */
			"btb_1": new Audio("./src/sfx/tetris/BejeweledSR/btb_1.ogg"),
			"btb_2": new Audio("./src/sfx/tetris/BejeweledSR/btb_2.ogg"),
			"btb_3": new Audio("./src/sfx/tetris/BejeweledSR/btb_3.ogg"),
			"btb_break": new Audio("./src/sfx/tetris/BejeweledSR/btb_break.ogg"),

			/* ==== CLEAR ==== */
			"allclear": new Audio("./src/sfx/tetris/BejeweledSR/allclear.ogg"),
			"clearbtb": new Audio("./src/sfx/tetris/BejeweledSR/clearbtb.ogg"),
			"clearline": new Audio("./src/sfx/tetris/BejeweledSR/clearline.ogg"),
			"clearquad": new Audio("./src/sfx/tetris/BejeweledSR/clearquad.ogg"),
			"clearspin": new Audio("./src/sfx/tetris/BejeweledSR/clearspin.ogg"),

			/* ==== COMBO ==== */
			"combo_1": new Audio("./src/sfx/tetris/BejeweledSR/combo_1.ogg"),
			"combo_2": new Audio("./src/sfx/tetris/BejeweledSR/combo_2.ogg"),
			"combo_3": new Audio("./src/sfx/tetris/BejeweledSR/combo_3.ogg"),
			"combo_4": new Audio("./src/sfx/tetris/BejeweledSR/combo_4.ogg"),
			"combo_5": new Audio("./src/sfx/tetris/BejeweledSR/combo_5.ogg"),
			"combo_6": new Audio("./src/sfx/tetris/BejeweledSR/combo_6.ogg"),
			"combo_7": new Audio("./src/sfx/tetris/BejeweledSR/combo_7.ogg"),
			"combo_8": new Audio("./src/sfx/tetris/BejeweledSR/combo_8.ogg"),
			"combo_9": new Audio("./src/sfx/tetris/BejeweledSR/combo_9.ogg"),
			"combo_10": new Audio("./src/sfx/tetris/BejeweledSR/combo_10.ogg"),
			"combo_11": new Audio("./src/sfx/tetris/BejeweledSR/combo_11.ogg"),
			"combo_12": new Audio("./src/sfx/tetris/BejeweledSR/combo_12.ogg"),
			"combo_13": new Audio("./src/sfx/tetris/BejeweledSR/combo_13.ogg"),
			"combo_14": new Audio("./src/sfx/tetris/BejeweledSR/combo_14.ogg"),
			"combo_15": new Audio("./src/sfx/tetris/BejeweledSR/combo_15.ogg"),
			"combo_16": new Audio("./src/sfx/tetris/BejeweledSR/combo_16.ogg"),
			"combobreak": new Audio("./src/sfx/tetris/BejeweledSR/combobreak.ogg"),

			/* ==== GARBAGE ==== */
			"counter": new Audio("./src/sfx/tetris/BejeweledSR/counter.ogg"),
			"damage_alert": new Audio("./src/sfx/tetris/BejeweledSR/damage_alert.ogg"),
			"damage_large": new Audio("./src/sfx/tetris/BejeweledSR/damage_large.ogg"),
			"damage_medium": new Audio("./src/sfx/tetris/BejeweledSR/damage_medium.ogg"),
			"damage_small": new Audio("./src/sfx/tetris/BejeweledSR/damage_small.ogg"),
			"garbage_in_large": new Audio("./src/sfx/tetris/BejeweledSR/garbage_in_large.ogg"),
			"garbage_in_medium": new Audio("./src/sfx/tetris/BejeweledSR/garbage_in_medium.ogg"),
			"garbage_in_small": new Audio("./src/sfx/tetris/BejeweledSR/garbage_in_small.ogg"),
			"garbage_out_large": new Audio("./src/sfx/tetris/BejeweledSR/garbage_out_large.ogg"),
			"garbage_out_medium": new Audio("./src/sfx/tetris/BejeweledSR/garbage_out_medium.ogg"),
			"garbage_out_small": new Audio("./src/sfx/tetris/BejeweledSR/garbage_out_small.ogg"),

			/* ==== USER_EFFECT ==== */
			"harddrop": new Audio("./src/sfx/tetris/BejeweledSR/harddrop.ogg"),
			"softdrop": new Audio("./src/sfx/tetris/BejeweledSR/softdrop.ogg"),
			"hold": new Audio("./src/sfx/tetris/BejeweledSR/hold.ogg"),
			"move": new Audio("./src/sfx/tetris/BejeweledSR/move.ogg"),
			"rotate": new Audio("./src/sfx/tetris/BejeweledSR/rotate.ogg"),

			/* ==== LEVEL ==== */
			"level1": new Audio("./src/sfx/tetris/BejeweledSR/level1.ogg"),
			"level5": new Audio("./src/sfx/tetris/BejeweledSR/level5.ogg"),
			"level10": new Audio("./src/sfx/tetris/BejeweledSR/level10.ogg"),
			"level15": new Audio("./src/sfx/tetris/BejeweledSR/level15.ogg"),
			"levelup": new Audio("./src/sfx/tetris/BejeweledSR/levelup.ogg"),

			/* ==== LOCK ==== */
			"spinend": new Audio("./src/sfx/tetris/BejeweledSR/spinend.ogg"),
			"lock": new Audio("./src/sfx/tetris/BejeweledSR/lock.ogg"),

			/* ==== SPIN ==== */
			"spin": new Audio("./src/sfx/tetris/BejeweledSR/spin.ogg"),

			/* ==== BOARD ==== */
			"floor": new Audio("./src/sfx/tetris/BejeweledSR/floor.ogg"),
			"sidehit": new Audio("./src/sfx/tetris/BejeweledSR/sidehit.ogg"),
			"topout": new Audio("./src/sfx/tetris/BejeweledSR/topout.ogg"),
		}
	}

	async play(name: string) {
		// this.actualSfx = name;
		if (this.sfx[name]) {
			const   sound = new Audio(this.sfx[name].src);
			// console.log("Play sound: ", name);
			sound.play();
		}
	}
}

export const sfxPlayer = new sfxHandler();

class   bgmHandler {
	private readonly bgm: {[key: string]: HTMLAudioElement};
	private actualBgm: string;
	constructor() {
		this.bgm = {
			"bgm1": new Audio("./src/bgm/tetris/bgm1.mp3"),
			"bgm2": new Audio("./src/bgm/tetris/bgm2.mp3"),
			"bgm3": new Audio("./src/bgm/tetris/bgm3.mp3"),
		}
		this.actualBgm = "";
	}

	async choseBgm(name: string) {
		if (this.bgm[name]) {
			this.bgm[name].loop = true;
			this.bgm[name].volume = 0.2;
			this.actualBgm = name;
		}
		else {
			console.error("BGM not found");
		}
	}

	async play() {
		if (this.bgm[this.actualBgm]) {
			this.bgm[this.actualBgm].loop = true;
			this.bgm[this.actualBgm].play();
		}
	}
	async stop() {
		if (this.bgm[this.actualBgm]) {
			this.bgm[this.actualBgm].pause();
			console.log("BGM paused: ", this.bgm[this.actualBgm].paused);
			this.bgm[this.actualBgm].currentTime = 0;
		}
	}
}

export const bgmPlayer = new bgmHandler();

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
		this.settings = {};
		this.resetSettings();
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
	resetSettings() {
		this.settings = {
			"showShadowPiece":			true,
			"showBags":					true,
			"holdAllowed":				true,
			"showHold":					true,
			"infiniteHold":				true, // TODO : change to false
			"infiniteMovement":			true,
			"lockTime":					-1, // TODO : change to 500
			"spawnARE":					0,
			"softDropAmp":				1.5,
			"level":					4,
			"isLevelling":				false,
		};
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
	value:     string;
	game:	    tetrisGameInfo;
}

export type loadTetrisType = "empty" | "logo" | "idle" | "setting" | "keybindings" | "change-key" | "board" | "multiplayer-room" | "display-multiplayer-room";

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
			return tetrisTextures["I"];
		case "J_LOCKED":
		case "J":
			return tetrisTextures["J"];
		case "L_LOCKED":
		case "L":
			return tetrisTextures["L"];
		case "O_LOCKED":
		case "O":
			return tetrisTextures["O"];
		case "S_LOCKED":
		case "S":
			return tetrisTextures["S"];
		case "T_LOCKED":
		case "T":
			return tetrisTextures["T"];
		case "Z_LOCKED":
		case "Z":
			return tetrisTextures["Z"];
		case "GARBAGE":
			return tetrisTextures["GARBAGE"];
			//TODO: Do garbage
		default:
			return null;
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
