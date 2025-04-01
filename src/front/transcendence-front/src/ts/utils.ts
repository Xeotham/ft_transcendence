export interface responseFormat {
	type: string;
	data: any;
	message: string;
	player: string | null;
	tourPlacement: number | null;
	tourId: number | null;
	roomId: number | null;
	winner: number | null;
}

export interface Game {
	paddle1:	{ x: number, y: number, x_size: number, y_size: number };
	paddle2:	{ x: number, y: number, x_size: number, y_size: number };
	ball:		{ x: number, y: number, size: number, orientation: number, speed: number };
}

export interface	RoomInfo {
	id:		number;
	full:	boolean;
	isSolo:	boolean;
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
}

export type loadPongHtmlType = "idle" | "match-found" | "tournament-found" | "board" | "confirm" | "tournament-name" | "spec-room-info" | "tour-info" | "list-rooms" | "list-tournaments" | "draw-game" | "tournament-end" | "tour-rooms-list";