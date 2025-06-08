import { PongRoom } from "./game.ts";
import { Tournament } from "./tournament.ts";

export const    pongSfxPlayer = new class {
	private readonly    sfx: {
		[key: string]:{
			[key: string]: HTMLAudioElement }
};
	private             pack: string;
	constructor() {
		this.sfx = {
			"retro": {
				"hitPaddle": new Audio("/src/medias/sfx/pong/retro/hitPaddle.mp3"),
				"hitOpponentPaddle": new Audio("/src/medias/sfx/pong/retro/hitOpponentPaddle.mp3"),
				"goal": new Audio("/src/medias/sfx/pong/retro/goal.mp3"),
			},
			"phantom": {
				"hitPaddle": new Audio("/src/medias/sfx/pong/phantom/hitPaddle.mp3"),
				"hitOpponentPaddle": new Audio("/src/medias/sfx/pong/phantom/hitOpponentPaddle.mp3"),
				"goal": new Audio("/src/medias/sfx/pong/phantom/goal.mp3"),
			},
			"tv_world": {
				"hitPaddle": new Audio("/src/medias/sfx/pong/TVWorld/hitPaddle.mp3"),
				"hitOpponentPaddle": new Audio("/src/medias/sfx/pong/TVWorld/hitOpponentPaddle.mp3"),
				"goal": new Audio("/src/medias/sfx/pong/TVWorld/goal.mp3"),
			},
			"retro1975": {
				"hitPaddle": new Audio("/src/medias/sfx/pong/retro/hitPaddle.mp3"),
				"hitOpponentPaddle": new Audio("/src/medias/sfx/pong/retro/hitOpponentPaddle.mp3"),
				"goal": new Audio("/src/medias/sfx/pong/retro/goal.mp3"),
			},
			"dark_hour": {
				"hitPaddle": new Audio("/src/medias/sfx/pong/DarkHour/hitPaddle.mp3"),
				"hitOpponentPaddle": new Audio("/src/medias/sfx/pong/DarkHour/hitOpponentPaddle.mp3"),
				"goal": new Audio("/src/medias/sfx/pong/DarkHour/goal.mp3"),
			}
		}
		if (!localStorage.getItem("pongPack"))
			localStorage.setItem("pongPack", "retro1975");
		this.pack = localStorage.getItem("pongPack")!;
	}

	play(name: string) {
		if (this.sfx[this.pack][name] !== undefined) {
			const   sound = new Audio(this.sfx[this.pack][name].src);
			sound.play();
		}
		else
			console.error("Sound not found: " + name);
	}
	setPack(pack: string) {
		if (this.sfx[pack] !== undefined)
			this.pack = pack;
		else {
			console.error("Sound pack not found: " + pack);
			pongPackHandler.setPack("retro1975");

		}
	}
}

export const    pongTextureHandler = new class {
	private pack: string;
	private textures: {[key: string]: {[key: string]: HTMLImageElement}};
	private fonts: {[key: string]: string}
	constructor() {
		this.textures = {};
		this.generateTextures();
		this.fonts = {
			"retro": "Arial",
			"phantom": "'PhantomFont', Arial, sans-serif",
			"tv_world": "'Fontsona4', Arial, sans-serif",
			"retro1975": "'C64Pro', Arial, sans-serif",
			"dark_hour": "'DarkHourFont', Arial, sans-serif"
		}
		if (!localStorage.getItem("pongPack"))
			localStorage.setItem("pongPack", "retro1975");
		this.pack = localStorage.getItem("pongPack")!;
	}
	private generateTextures() {
		const   texturePaths = {
			"retro": {
				"BACKGROUND":       '/src/medias/textures/pong/retro/background.png',
				"BOARD":            '/src/medias/textures/pong/retro/pongBoard.png',
				"USER_PADDLE":      '/src/medias/textures/pong/retro/userPaddle.png',
				"OPPONENT_PADDLE":  '/src/medias/textures/pong/retro/opponentPaddle.png',
				"BALL":             '/src/medias/textures/pong/retro/pongBall.png',
			},
			"phantom": {
				"BACKGROUND":       '/src/medias/textures/pong/phantom/background.png',
				"BOARD":            '/src/medias/textures/pong/phantom/pongBoard.png',
				"USER_PADDLE":      '/src/medias/textures/pong/phantom/userPaddle.png',
				"OPPONENT_PADDLE":  '/src/medias/textures/pong/phantom/opponentPaddle.png',
				"BALL":             '/src/medias/textures/pong/phantom/pongBall.png',
			},
			"tv_world": {
				"BACKGROUND":       '/src/medias/textures/pong/TVWorld/background.png',
				"BOARD":            '/src/medias/textures/pong/TVWorld/pongBoard.png',
				"USER_PADDLE":      '/src/medias/textures/pong/TVWorld/userPaddle.png',
				"OPPONENT_PADDLE":  '/src/medias/textures/pong/TVWorld/opponentPaddle.png',
				"BALL":             '/src/medias/textures/pong/TVWorld/pongBall.png',
			},
			"retro1975": {
				"BACKGROUND":       '/src/medias/textures/pong/retro1975/background.png',
				"BOARD":            '/src/medias/textures/pong/retro1975/pongBoard.png',
				"USER_PADDLE":      '/src/medias/textures/pong/retro1975/userPaddle.png',
				"OPPONENT_PADDLE":  '/src/medias/textures/pong/retro1975/opponentPaddle.png',
				"BALL":             '/src/medias/textures/pong/retro1975/pongBall.png',
			},
			"dark_hour": {
				"BACKGROUND":       '/src/medias/textures/pong/DarkHour/background.png',
				"BOARD":            '/src/medias/textures/pong/DarkHour/pongBoard.png',
				"USER_PADDLE":      '/src/medias/textures/pong/DarkHour/userPaddle.png',
				"OPPONENT_PADDLE":  '/src/medias/textures/pong/DarkHour/opponentPaddle.png',
				"BALL":             '/src/medias/textures/pong/DarkHour/pongBall.png',
			}
		}

		Object.entries(texturePaths).map(([pack, path]) => {
			this.textures[pack] = {};
			Object.entries(path).map(([key, path]) => {
				return new Promise<void>((resolve, reject) => {
					const img = new Image();
					img.src = path;
					img.onload = () => {
						this.textures[pack][key] = img;
						resolve();
					};
					img.onerror = (err) => {
						console.error(`Failed to load texture: ${key} from ${path}`, err);
						reject(err)
					};
				})
			});
		});
	}

	getTexture(name: string): HTMLImageElement | null {
		if (this.textures[this.pack] && this.textures[this.pack][name])
			return this.textures[this.pack][name];
		console.error("Texture not found: " + name);
		return null;
	}

	setPack(pack: string): string | null {
		if (this.textures[pack] !== undefined)
			return this.pack = pack;
		console.error("Texture pack not found: " + pack);
		pongPackHandler.setPack("retro1975");
		return null;
	}

	getFont(): string | null {
		if (this.fonts[this.pack] !== undefined)
			return this.fonts[this.pack];
		console.error("Font pack not found: " + this.pack);
		return null;
	}
}

export const    pongPackHandler = new class {
	private pack: string;
	constructor() {
		if (!localStorage.getItem("pongPack"))
			localStorage.setItem("pongPack", "retro1975");
		this.pack = localStorage.getItem("pongPack")!; // Default pack retro, phantom, tv_world, retro1975
		pongSfxPlayer.setPack(this.pack);
		pongTextureHandler.setPack(this.pack);
	}

	setPack(pack: string) {
		if (this.pack !== pack) {
			this.pack = pack;
			pongSfxPlayer.setPack(pack);
			pongTextureHandler.setPack(pack);
			localStorage.setItem("pongPack", pack);
		}
	}
	getPack() { return this.pack; }
}

export class   gameInformation {
	private room: PongRoom | null;
	private tournament: Tournament | null;
	private matchType: "PONG" | "TOURNAMENT" | null;

	constructor () {
		this.room = null;
		this.tournament = null;
		this.matchType = null;
	}

	getRoom() { return this.room; }
	getMatchType() { return this.matchType; }
	getTournament() { return this.tournament; }

	setRoom(room: PongRoom, classic: boolean = true) {
		this.room = room;
		if (classic)
			this.matchType = "PONG";
	}
	setTournament(tournament: Tournament) { this.tournament = tournament; this.matchType = "TOURNAMENT"; }
	resetRoom() {
		this.room = null;
		this.matchType = this.matchType === "TOURNAMENT" ? "TOURNAMENT" : null;
	}
	resetTournament() { this.resetRoom(); this.tournament = null; this.matchType = null; }
}

export interface responseFormat {
	type: string;
	data: any;
	message: string;
	player: string | null;
	tourPlacement: number | null;
	tourId: number | null;
	roomId: number | null;
	winner: number | null;
	inviteCode: string | null;
}

export interface Game {
	paddle1:	{ x: number, y: number, x_size: number, y_size: number };
	paddle2:	{ x: number, y: number, x_size: number, y_size: number };
	ball:		{ x: number, y: number, size: number, orientation: number, speed: number };
	score:      { player1: { username: string, score: number }, player2: { username: string, score: number } };
}

export interface	RoomInfo {
	id:		number;
	full:	boolean;
	isSolo:	boolean;
	isBot:	boolean;
	privRoom:	boolean;
}

export interface	TournamentInfo {
	id:			number;
	name:		string;
	started:	boolean;
}

export interface intervals {
	ArrowUp: number | null;
	ArrowDown: number | null;
	KeyS: number | null;
	KeyX: number | null;
}

export interface buttons {
	ArrowUp: boolean;
	ArrowDown: boolean;
	KeyS: boolean;
	KeyX: boolean;
}

export interface score {
	player1: number;
	player2: number;
}

export interface    loadHtmlArg {
	roomId?:        number;
	started?:       boolean;
	tourId?:        number;
	roomLst?:       RoomInfo[];
	tourLst?:       TournamentInfo[];
	game?:          Game;
	tourName?:      string;
	winner?:        number;
	inviteCode?:    string;
}


export type loadPongHtmlType = "empty" | "logo" | "idle" | "match-found" | "tournament-found" | "board" | "confirm" | "tournament-name"
	| "spec-room-info" | "tour-info" | "list-rooms" | "list-tournaments" | "draw-game" | "tournament-end"
	| "priv-room-create" | "priv-room-code" | "nav-offline" | "nav-online" | "nav-tournament" | "nav-setting";

export const    boardWidth = 800;
export const    boardHeight = 400;
export const    paddleWidth = 10;
export const    paddleHeight = 80;
export const    ballSize = 10;
