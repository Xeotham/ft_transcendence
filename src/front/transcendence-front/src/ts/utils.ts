export interface responseFormat {
	type: string;
	data: any;
	message: string;
	player: string | null;
	tourPlacement: number | null;
	tourId: number | null;
	roomId: number | null;
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
	started:	boolean;
}

// Game.ts

export interface intervals {
	ArrowUp: NodeJS.Timeout | null;
	ArrowDown: NodeJS.Timeout | null;
	KeyS: NodeJS.Timeout | null;
	KeyX: NodeJS.Timeout | null;
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