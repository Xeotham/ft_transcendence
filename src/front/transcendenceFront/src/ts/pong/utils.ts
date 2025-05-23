import {PongRoom} from "./game.ts";
import {Tournament} from "./tournament.ts";

class   sfxHandler {
	private readonly    sfx: {
		[key: string]:{
			[key: string]: HTMLAudioElement }
};
	private             pack: string;
	constructor(pack: string | null) {
		this.sfx = {
			"retro": {
				"hitPaddle": new Audio("/src/medias/sfx/pong/retro/hitPaddle.mp3"),
				"hitOpponentPaddle": new Audio("/src/medias/sfx/pong/retro/hitOpponentPaddle.mp3"),
				"goal": new Audio("/src/medias/sfx/pong/retro/goal.mp3"),
			},
		}
		if (pack !== null)
			this.pack = pack;
		else
			this.pack = "retro";
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
		else
			console.error("Sound pack not found: " + pack);
	}
}

export const pongSfxPlayer = new sfxHandler(null);

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

// Game.ts

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
	| "tour-rooms-list" | "priv-room-create" | "priv-room-code" | "nav-offline" | "nav-online" | "nav-tournament" | "nav-setting";

/*
export type loadPongHtmlType = 
"empty" | "logo" | "idle" | 
"pongSolo" | "pongVersus" | "pongTournament" | "pongSettings" | 
"pongDrawBoard" | "pongDrawGame" | 
"pongVersusJoin" | "pongVersusJoinConfirm" | "pongVersusJoinPrivRoom"| "pongVersusSpectate" | "pongVersusList" | "pongVersusPrivate" |
"pongTournamentInfo"  | "pongTournamentPlay" | "pongTournamentList" | "pongTournamentFound" | "pongTournamentName" | "pongTournamentEnd" |
"pongconfirm" | "list-rooms" | "tour-rooms-list" | "tournament-end";
*/

export const    boardWidth = 800;
export const    boardHeight = 400;
export const    paddleWidth = 10;
export const    paddleHeight = 80;
export const    ballSize = 10;
