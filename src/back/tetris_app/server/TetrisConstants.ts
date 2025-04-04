export const ROTATIONS: string[] = ["WEST", "NORTH", "EAST", "SOUTH"];
export const WEST = 0;
export const NORTH = 1;
export const EAST = 2;
export const SOUTH = 3;

export const MAX_LEVEL: number = 15;
export const MIN_LEVEL: number = 1;
export const FALL_SPEED = (level: number): number => {
	return Math.pow(0.8 - ((level - 1) * 0.007), level - 1);
}

export const SCORING: {[id:string]: number} = {
	"Single" : 100,
	"Double" : 300,
	"Triple" : 500,
	"Tetris" : 800,
	"PerfectClear" : 1200,
	"Mini T-Spin" : 100,
	"T-Spin Single" : 800,
	"T-Spin Double" : 1200,
	"T-Spin Triple" : 1600,
	"Back-to-Back Bonus" : 1.5,
	"Soft Drop" : 1,
	"Hard Drop" : 2,
}

export const SCORE_CALCULUS = (score: string, level: number, type: string = "") => {
	if (score === "Soft Drop" || score === "Hard Drop")
		return SCORING[type];
	if (type === "Back-to-Back Bonus")
		return SCORING[score] * level * SCORING[type];
	return SCORING[score] * level;
}

export const TETRIS_WIDTH: number = 10;
export const TETRIS_HEIGHT: number = 20;
export const BUFFER_WIDTH: number = 10;
export const BUFFER_HEIGHT: number = 20;

