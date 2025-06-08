
export const clamp = (value: number, min: number, max: number): number => {
	return Math.max(min, Math.min(value, max));
}

export const abs = (value: number): number => {
	return value < 0 ? -value : value;
}

export interface tetriminoInfo {
	name:       string;
	rotation:   number;
	texture:    string;
}

export interface minoInfo {
	texture: string;
}

export interface    tetrisGoalInfo {
	score:              number;
	level:              number;
	time:               number;
	linesCleared:       number,
	lineClearGoal:      number,
	piecesPlaced:       number,
	piecesPerSecond:    number,
}

export interface        tetrisGameInfo {
	matrix:             minoInfo[][];
	bags:               tetriminoInfo[][];
	hold:               tetriminoInfo;
	gameId:             number;
	canSwap:            boolean;
	score:              number;
	level:              number;
	time:               number;
	linesCleared:       number,
	lineClearGoal:      number,
	piecesPlaced:       number,
	piecesPerSecond:    number,
}

export class    TimeoutKey {
	private start:      number;
	private timer:      number;
	private remaining:  number;
	private callback:   () => void;

	constructor(callback: () => void, delay: number) {
		this.start = Date.now();
		this.timer = setTimeout(callback, delay);
		this.remaining = delay;
		this.callback = callback;
	}
	pause() {
		clearTimeout(this.timer);
		this.timer = 0;
		this.remaining -= Date.now() - this.start;
	}
	resume() {
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
		this.callback = () => {};
	}
}

export const    tetrisSfxPlayer = new class {
	private readonly sfx: {[key: string]: HTMLAudioElement};
	constructor() {
		this.sfx = {
			/* ==== BTB ==== */
			"btb_1": new Audio("/src/medias/sfx/tetris/BejeweledSR/btb_1.ogg"),
			"btb_2": new Audio("/src/medias/sfx/tetris/BejeweledSR/btb_2.ogg"),
			"btb_3": new Audio("/src/medias/sfx/tetris/BejeweledSR/btb_3.ogg"),
			"btb_break": new Audio("/src/medias/sfx/tetris/BejeweledSR/btb_break.ogg"),

			/* ==== CLEAR ==== */
			"allclear": new Audio("/src/medias/sfx/tetris/BejeweledSR/allclear.ogg"),
			"clearbtb": new Audio("/src/medias/sfx/tetris/BejeweledSR/clearbtb.ogg"),
			"clearline": new Audio("/src/medias/sfx/tetris/BejeweledSR/clearline.ogg"),
			"clearquad": new Audio("/src/medias/sfx/tetris/BejeweledSR/clearquad.ogg"),
			"clearspin": new Audio("/src/medias/sfx/tetris/BejeweledSR/clearspin.ogg"),

			/* ==== COMBO ==== */
			"combo_1": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_1.ogg"),
			"combo_2": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_2.ogg"),
			"combo_3": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_3.ogg"),
			"combo_4": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_4.ogg"),
			"combo_5": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_5.ogg"),
			"combo_6": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_6.ogg"),
			"combo_7": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_7.ogg"),
			"combo_8": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_8.ogg"),
			"combo_9": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_9.ogg"),
			"combo_10": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_10.ogg"),
			"combo_11": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_11.ogg"),
			"combo_12": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_12.ogg"),
			"combo_13": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_13.ogg"),
			"combo_14": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_14.ogg"),
			"combo_15": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_15.ogg"),
			"combo_16": new Audio("/src/medias/sfx/tetris/BejeweledSR/combo_16.ogg"),
			"combobreak": new Audio("/src/medias/sfx/tetris/BejeweledSR/combobreak.ogg"),

			/* ==== GARBAGE ==== */
			"counter": new Audio("/src/medias/sfx/tetris/BejeweledSR/counter.ogg"),
			"damage_alert": new Audio("/src/medias/sfx/tetris/BejeweledSR/damage_alert.ogg"),
			"damage_large": new Audio("/src/medias/sfx/tetris/BejeweledSR/damage_large.ogg"),
			"damage_medium": new Audio("/src/medias/sfx/tetris/BejeweledSR/damage_medium.ogg"),
			"damage_small": new Audio("/src/medias/sfx/tetris/BejeweledSR/damage_small.ogg"),
			"garbage_in_large": new Audio("/src/medias/sfx/tetris/BejeweledSR/garbage_in_large.ogg"),
			"garbage_in_medium": new Audio("/src/medias/sfx/tetris/BejeweledSR/garbage_in_medium.ogg"),
			"garbage_in_small": new Audio("/src/medias/sfx/tetris/BejeweledSR/garbage_in_small.ogg"),
			"garbage_out_large": new Audio("/src/medias/sfx/tetris/BejeweledSR/garbage_out_large.ogg"),
			"garbage_out_medium": new Audio("/src/medias/sfx/tetris/BejeweledSR/garbage_out_medium.ogg"),
			"garbage_out_small": new Audio("/src/medias/sfx/tetris/BejeweledSR/garbage_out_small.ogg"),

			/* ==== USER_EFFECT ==== */
			"harddrop": new Audio("/src/medias/sfx/tetris/BejeweledSR/harddrop.ogg"),
			"softdrop": new Audio("/src/medias/sfx/tetris/BejeweledSR/softdrop.ogg"),
			"hold": new Audio("/src/medias/sfx/tetris/BejeweledSR/hold.ogg"),
			"move": new Audio("/src/medias/sfx/tetris/BejeweledSR/move.ogg"),
			"rotate": new Audio("/src/medias/sfx/tetris/BejeweledSR/rotate.ogg"),

			/* ==== LEVEL ==== */
			"level1": new Audio("/src/medias/sfx/tetris/BejeweledSR/level1.ogg"),
			"level5": new Audio("/src/medias/sfx/tetris/BejeweledSR/level5.ogg"),
			"level10": new Audio("/src/medias/sfx/tetris/BejeweledSR/level10.ogg"),
			"level15": new Audio("/src/medias/sfx/tetris/BejeweledSR/level15.ogg"),
			"levelup": new Audio("/src/medias/sfx/tetris/BejeweledSR/levelup.ogg"),

			/* ==== LOCK ==== */
			"spinend": new Audio("/src/medias/sfx/tetris/BejeweledSR/spinend.ogg"),
			"lock": new Audio("/src/medias/sfx/tetris/BejeweledSR/lock.ogg"),

			/* ==== SPIN ==== */
			"spin": new Audio("/src/medias/sfx/tetris/BejeweledSR/spin.ogg"),

			/* ==== BOARD ==== */
			"floor": new Audio("/src/medias/sfx/tetris/BejeweledSR/floor.ogg"),
			"sidehit": new Audio("/src/medias/sfx/tetris/BejeweledSR/sidehit.ogg"),
			"topout": new Audio("/src/medias/sfx/tetris/BejeweledSR/topout.ogg"),
		}
	}

	async play(name: string) {
		if (this.sfx[name]) {
			const   sound = new Audio(this.sfx[name].src);
			sound.volume = 0.3;
			sound.play();
		}
	}
};

export const    bgmPlayer = new class {
	private readonly bgm: {[key: string]: HTMLAudioElement};
	private actualBgm: string;

	constructor() {
		this.bgm = {
			"bgm1": new Audio("/src/medias/bgm/tetris/bgm1.mp3"),
			"bgm2": new Audio("/src/medias/bgm/tetris/bgm2.mp3"),
			"bgm3": new Audio("/src/medias/bgm/tetris/bgm3.mp3"),
			"bgm4": new Audio("/src/medias/bgm/tetris/bgm4.mp3"),
			"bgm5": new Audio("/src/medias/bgm/tetris/bgm5.mp3"),
			"bgm6": new Audio("/src/medias/bgm/tetris/bgm6.mp3"),
		}
		if (localStorage.getItem("tetrisBgm") === null)
			localStorage.setItem("tetrisBgm", "none");
		this.actualBgm = localStorage.getItem("tetrisBgm") || "none";
	}

	getActualBgm(): string { return this.actualBgm; }

	choseBgm(name: string) {
		if (this.bgm[name]) {
			this.bgm[name].loop = true;
			this.bgm[name].volume = 0.2;
			this.actualBgm = name;
			localStorage.setItem("tetrisBgm", name);
		}
		else if (name === "none") {
			this.actualBgm = "none";
			localStorage.setItem("tetrisBgm", "none");
		}
	}

	async play() {
		if (this.actualBgm === "none")
			return ;
		if (this.bgm[this.actualBgm]) {
			this.bgm[this.actualBgm].loop = true;
			this.bgm[this.actualBgm].play();
		}
	}
	async stop() {
		if (this.bgm[this.actualBgm]) {
			this.bgm[this.actualBgm].pause();
			this.bgm[this.actualBgm].currentTime = 0;
		}
	}
};

export const    backgroundHandler = new class {
	private background: { [key: string]: HTMLImageElement };
	private actualBackground: string;

	constructor() {

		this.background = {};

		(() => {

			const   texturePaths = {
				"bkg_1":        '/src/medias/textures/tetris/background/bkg_1.jpg',
				"bkg_2":        '/src/medias/textures/tetris/background/bkg_2.jpg',
				"bkg_3":        '/src/medias/textures/tetris/background/bkg_3.jpg',
				"bkg_4":        '/src/medias/textures/tetris/background/bkg_4.jpg',
				"bkg_5":        '/src/medias/textures/tetris/background/bkg_5.jpg',
				"bkg_6":        '/src/medias/textures/tetris/background/bkg_6.png',
				"bkg_7":        '/src/medias/textures/tetris/background/bkg_7.jpg',
				"bkg_8":        '/src/medias/textures/tetris/background/bkg_8.jpg',
			}

			Object.entries(texturePaths).map(([key, path]) => {
				return new Promise<void>((resolve, reject) => {
					const img = new Image();

					img.src = path;
					img.onload = () => {
						this.background[key] = img;
						resolve();
					};
					img.onerror = (err) => {
						console.error(`Failed to load texture: ${key} from ${path}`, err);
						reject(err)
					};
				});
			});
		})();
		if (localStorage.getItem("tetrisBackground") === null)
			localStorage.setItem("tetrisBackground", "bkg_1");
		this.actualBackground = localStorage.getItem("tetrisBackground")!;
	}
	getActualBackground(): string { return this.actualBackground; }
	setActualBackground(name: string) {
		if (this.background[name]) {
			this.actualBackground = name;
			localStorage.setItem("tetrisBackground", name);
		}
		else {
			console.error(`Background ${name} not found`);
		}
	}
	getBackgroundTextures() { return this.background[this.actualBackground] ? this.background[this.actualBackground] : this.background["bkg_1"]; }
}

export const    tetrisTexturesHandler = new class {
	private textures: { [key: string]: {[key: string]: HTMLImageElement } };
	private actualTexture: string;

	constructor() {
		this.textures = {};

		(() => {

			const   texturePaths = {
				"classic": {
					"I":            '/src/medias/textures/tetris/classic/I.png',
					"J":            '/src/medias/textures/tetris/classic/J.png',
					"L":            '/src/medias/textures/tetris/classic/L.png',
					"O":            '/src/medias/textures/tetris/classic/O.png',
					"S":            '/src/medias/textures/tetris/classic/S.png',
					"T":            '/src/medias/textures/tetris/classic/T.png',
					"Z":            '/src/medias/textures/tetris/classic/Z.png',
					"SHADOW":       '/src/medias/textures/tetris/classic/shadow.png',
					"GARBAGE":      '/src/medias/textures/tetris/classic/garbage.png',
					"MATRIX":       '/src/medias/textures/tetris/classic/matrix.png',
					"HOLD":		    '/src/medias/textures/tetris/classic/hold.png',
					"BAGS":          '/src/medias/textures/tetris/classic/bags.png',
				},
				"minetris": {
					"I":            '/src/medias/textures/tetris/minetris/I.png',
					"J":            '/src/medias/textures/tetris/minetris/J.png',
					"L":            '/src/medias/textures/tetris/minetris/L.png',
					"O":            '/src/medias/textures/tetris/minetris/O.png',
					"S":            '/src/medias/textures/tetris/minetris/S.png',
					"T":            '/src/medias/textures/tetris/minetris/T.png',
					"Z":            '/src/medias/textures/tetris/minetris/Z.png',
					"SHADOW":       '/src/medias/textures/tetris/minetris/shadow.png',
					"GARBAGE":      '/src/medias/textures/tetris/minetris/garbage.png',
					"MATRIX":       '/src/medias/textures/tetris/minetris/matrix.png',
					"HOLD":		    '/src/medias/textures/tetris/minetris/hold.png',
					"BAGS":          '/src/medias/textures/tetris/minetris/bags.png',
				},
				"minimalist": {
					"I":            '/src/medias/textures/tetris/minimalist/I.png',
					"J":            '/src/medias/textures/tetris/minimalist/J.png',
					"L":            '/src/medias/textures/tetris/minimalist/L.png',
					"O":            '/src/medias/textures/tetris/minimalist/O.png',
					"S":            '/src/medias/textures/tetris/minimalist/S.png',
					"T":            '/src/medias/textures/tetris/minimalist/T.png',
					"Z":            '/src/medias/textures/tetris/minimalist/Z.png',
					"SHADOW":       '/src/medias/textures/tetris/minimalist/shadow.png',
					"GARBAGE":      '/src/medias/textures/tetris/minimalist/garbage.png',
					"MATRIX":       '/src/medias/textures/tetris/minimalist/matrix.png',
					"HOLD":		    '/src/medias/textures/tetris/minimalist/hold.png',
					"BAGS":          '/src/medias/textures/tetris/minimalist/bags.png',
				}
			}

			Object.entries(texturePaths).map(([key, path]) => {
				Object.entries(path).map(([textureKey, texturePath]) => {
					return new Promise<void>((resolve, reject) => {
						const img = new Image();

						img.src = texturePath;
						img.onload = () => {
							if (!this.textures[key]) {
								this.textures[key] = {};
							}
							this.textures[key][textureKey] = img;
							resolve();
						};
						img.onerror = (err) => {
							console.error(`Failed to load texture: ${textureKey} from ${texturePath}`, err);
							reject(err)
						};
					});
				});
			});
		})();

		if (localStorage.getItem("tetrisTexture") === null)
			localStorage.setItem("tetrisTexture", "minimalist");
		this.actualTexture = localStorage.getItem("tetrisTexture")!;
	}

	setTexture(name: string) {
		if (this.textures[name]) {
			this.actualTexture = name;
			localStorage.setItem("tetrisTexture", name);
		}
		else {
			console.error(`Texture ${name} not found`);
		}
	}

	getActualTexture(): string { return this.actualTexture; }

	getTexture(name: string): HTMLImageElement {
		if (this.textures[this.actualTexture] && this.textures[this.actualTexture][name]) {
			return this.textures[this.actualTexture][name];
		}
		else {
			console.error(`Texture ${name} not found in ${this.actualTexture}`);
			return this.textures["minimalist"][name];
		}
	}
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
		interface   keybinds {
			moveLeft: string;
			moveRight: string;
			rotateClockwise: string;
			rotateCounterClockwise: string;
			rotate180: string;
			hardDrop: string;
			softDrop: string;
			hold: string;
			forfeit: string;
			retry: string;
		}

		const   keys: keybinds = JSON.parse(localStorage.getItem("tetrisKeybindings") || "{}");

		this.moveLeft               = keys.moveLeft || "a";
		this.moveRight              = keys.moveRight || "d";
		this.rotateClockwise        = keys.rotateClockwise || "ArrowRight";
		this.rotateCounterClockwise = keys.rotateCounterClockwise || "ArrowLeft";
		this.rotate180              = keys.rotate180 || "w";
		this.hardDrop               = keys.hardDrop || "ArrowUp";
		this.softDrop               = keys.softDrop || "ArrowDown";
		this.hold                   = keys.hold || "Shift";
		this.forfeit                = keys.forfeit || "Escape";
		this.retry                  = keys.retry || "r";
		// console.log("Keys initialized:", this.getKeys());
		localStorage.setItem("tetrisKeybindings", JSON.stringify(this.getKeys()));
	}
	// Getters
	getKeys() {
		return {
			moveLeft: this.moveLeft,
			moveRight: this.moveRight,
			rotateClockwise: this.rotateClockwise,
			rotateCounterClockwise: this.rotateCounterClockwise,
			rotate180: this.rotate180,
			hardDrop: this.hardDrop,
			softDrop: this.softDrop,
			hold: this.hold,
			forfeit: this.forfeit,
			retry: this.retry,
		}
	};
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

		localStorage.setItem("tetrisKeybindings", JSON.stringify(this.getKeys()));
	}

}

export let userKeys: keys = new keys();

export class    tetrisGame {
	private socket:					WebSocket | null;
	private roomCode:				string;
	private roomOwner:				boolean;
	private gameId:					number;
	private game:					tetrisGameInfo | null;
	private readonly keyTimeout:	{[key: string]: TimeoutKey | null};
	private readonly keyFirstMove:	{[key: string]: boolean};
	private settings:				{[key: string]: any};
	private opponentsGames:  		tetrisGameInfo[] | null;

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
		this.settings = {};
		this.resetSettings();
		this.opponentsGames = null;
	}
	getSocket(): WebSocket | null { return this.socket; }
	getRoomCode(): string { return this.roomCode; }
	getRoomOwner(): boolean { return this.roomOwner; }
	getGameId(): number { return this.gameId; }
	getGame(): tetrisGameInfo | null { return this.game; }
	getKeyTimeout(arg: string): TimeoutKey | null { return this.keyTimeout[arg]; }
	getKeyFirstMove(arg: string): boolean { return this.keyFirstMove[arg]; }
	getSettings(): any { return this.settings; }
	getSettingsValue(arg: string): any { return this.settings[arg]; }
	getOpponentsGames(): tetrisGameInfo[] | null { return this.opponentsGames; }

	setSocket(socket: WebSocket | null): void { this.socket = socket; }
	setRoomCode(roomCode: string): void { this.roomCode = roomCode; }
	setRoomOwner(roomOwner: boolean): void { this.roomOwner = roomOwner; }
	setGameId(gameId: number): void { this.gameId = gameId; }
	setGame(game: tetrisGameInfo | null): void { this.game = game; }
	setKeyTimeout(arg: string, value: TimeoutKey | null): void { this.keyTimeout[arg] = value; }
	setKeyFirstMove(arg: string, value: boolean): void { this.keyFirstMove[arg] = value; }
	setSettings(settings: any): void { this.settings = settings; }
	setOpponentsGames(opponentGames: tetrisGameInfo[] | null): void { this.opponentsGames = opponentGames; }

	reset() {
		this.socket = null;
		this.gameId = -1;
		this.game   = null;
	}
	resetSettings() {
		this.settings = {
			"isPrivate":				true,
			"isVersus":					false,
			"showShadowPiece":			true,
			"showBags":					true,
			"holdAllowed":				true,
			"showHold":					true,
			"infiniteHold":				false,
			"infiniteMovement":			false,
			"lockTime":					500,
			"spawnARE":					0,
			"softDropAmp":				1.5,
			"level":					4,
			"isLevelling":				false,
			"canRetry":					true,
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
	argument:   string | tetrisGameInfo[];
	value:      string;
	game:	    tetrisGameInfo;
}

export type loadTetrisType = "empty" | "logo" | "idle" | "setting" | "keybindings" | "change-key" | "board" | "multiplayer-room" | "display-multiplayer-room";

export const    setKey = (keyType: string, value: string) => {
	switch (keyType) {
		case "moveLeft":
			return userKeys?.setMoveLeft(value);
		case "moveRight":
			return userKeys?.setMoveRight(value);
		case "rotateClockwise":
			return userKeys?.setClockWiseRotate(value);
		case "rotateCounterClockwise":
			return userKeys?.SetClockWiseRotate(value);
		case "rotate180":
			return userKeys?.setRotate180(value);
		case "hardDrop":
			return userKeys?.setHardDrop(value);
		case "softDrop":
			return userKeys?.setSoftDrop(value);
		case "hold":
			return userKeys?.setHold(value);
		case "forfeit":
			return userKeys?.setForfeit(value);
		case "retry":
			return userKeys?.setRetry(value);
		default:
			console.error("Invalid key type: ", keyType);
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
			return tetrisTexturesHandler.getTexture("SHADOW");
		case "I_LOCKED":
		case "I":
			return tetrisTexturesHandler.getTexture("I");
		case "J_LOCKED":
		case "J":
			return tetrisTexturesHandler.getTexture("J");
		case "L_LOCKED":
		case "L":
			return tetrisTexturesHandler.getTexture("L");
		case "O_LOCKED":
		case "O":
			return tetrisTexturesHandler.getTexture("O");
		case "S_LOCKED":
		case "S":
			return tetrisTexturesHandler.getTexture("S");
		case "T_LOCKED":
		case "T":
			return tetrisTexturesHandler.getTexture("T");
		case "Z_LOCKED":
		case "Z":
			return tetrisTexturesHandler.getTexture("Z");
		case "GARBAGE":
			return tetrisTexturesHandler.getTexture("GARBAGE");
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

export const    minoSize = 32;
export const    holdWidth = (minoSize * 4);
export const    holdHeight = (minoSize * 4);
export const    bagWidth = minoSize * 4;
export const    bagHeight = minoSize * 23;
