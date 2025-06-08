import { Pos } from "./Pos";
import { clamp } from "./utils";

export const ROTATIONS: string[] = ["north", "east", "south", "west"];
export const NORTH = 0;
export const EAST = 1;
export const SOUTH = 2;
export const WEST = 3;

export const TETRIS_WIDTH: number = 10;
export const TETRIS_HEIGHT: number = 20;
export const BUFFER_WIDTH: number = TETRIS_WIDTH;
export const BUFFER_HEIGHT: number = 20;

export const MAX_LEVEL: number = 15;
export const MIN_LEVEL: number = 1;
export const FALL_SPEED = (level: number): number => {
	return Math.pow(0.8 - ((level - 1) * 0.007), level - 1) * 1000;
}
export const SOFT_DROP_SPEED = (level: number) => {
	return FALL_SPEED(level) / 20;
}
export const HARD_DROP_SPEED = 0.1;

export const SCORING: {[id:string]: number} = {
	"Zero" : 0,
	"Single" : 100,
	"Double" : 300,
	"Triple" : 500,
	"Quad" : 800,
	"Spin Zero": 400,
	"Spin Single" : 800,
	"Spin Double" : 1200,
	"Spin Triple" : 1600,
	"Spin Quad" : 1600,
	"Mini Spin Zero": 100,
	"Mini Spin Single": 200,
	"Mini Spin Double": 400,
	"Mini Spin Triple": 800,
	"Mini Spin Quad": 1600,
	"Perfect Clear" : 3500,
	"Back-to-Back Bonus" : 1.5,
	"Normal Drop" : 0,
	"Soft Drop" : 1,
	"Hard Drop" : 2,
}

export const SCORE_CALCULUS = (score: string, level: number, isB2B: boolean) => {
	// remove the "T-" / "Z-" / "L-" / "J-" / "S-" / "I-"
	if (score.includes("Spin"))
		score = score.substring(0, score.indexOf("Spin") - 2) + score.substring(score.indexOf("Spin"));
	if (SCORING[score] === undefined || score === "Zero")
		return 0;
	if (score === "Normal Drop" || score === "Soft Drop" || score === "Hard Drop")
		return SCORING[score];
	if (isB2B)
		return SCORING[score] * level * SCORING["Back-to-Back Bonus"];

	return SCORING[score] * level;
}

export const STANDARD_COMBO_SCORING = (combo: number, level: number) => {
	return 50 * (combo + 1) * level;
}

export const STANDARD_COMBO_TABLE: number[] = [
	0,
	0,
	1,
	1,
	2,
	2,
	3,
	3,
	4,
	4,
	4,
	5,
	5,
	5
];

export const B2B_EXTRA_GARBAGE = (B2B: number) => {
	if (B2B < 2)
		return 0;
	if (B2B < 4)
		return 1;
	if (B2B < 9)
		return 2;
	if (B2B < 25)
		return 3;
	if (B2B < 68)
		return 4;
	if (B2B < 185)
		return 5;
	if (B2B < 505)
		return 6;
	if (B2B < 1371)
		return 7;
	return 8;
}

export const MULTIPLIER_COMBO_GARBAGE_TABLE: {[key: string]: number[]} = {
	"Single":				[0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3],
	"Double":				[1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6],
	"Triple":				[2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12],
	"Quad":					[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
	"Mini Spin Single":		[0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3],
	"Mini Spin Double":		[1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6],
	"Mini Spin Triple":		[2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12],
	"Mini Spin Quad":		[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
	"T-Spin Single":		[2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10 ,10 ,11, 11, 12],
	"T-Spin Double":		[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
	"T-Spin Triple":		[6, 7, 9, 10, 12, 13, 15, 16, 18, 19, 21, 23, 24, 25, 27, 28, 30, 31, 33, 34, 36],
}

export const 	GARBAGE_CALCULUS = (clear: string, combo: number, B2B: number, table: {[key: string]: number[]}) => {
	if (clear.includes("Zero") || combo < 0)
		return 0;
	if (clear === "Perfect Clear")
		return 10;
	// remove the "Z-" / "L-" / "J-" / "S-" / "I-" / "Mini T-", not "T-Spin"
	if ((clear.includes("Mini") && !clear.includes("T-")) || clear.includes("Mini T-"))
		clear = clear.substring(0, clear.indexOf("Spin") - 2) + clear.substring(clear.indexOf("Spin"));
	if (!table[clear])
		return 0;
	return table[clear][clamp(combo, 0, table[clear].length - 1)] + B2B_EXTRA_GARBAGE(B2B);
}

export const VARIABLE_GOAL_SYSTEM: number[] = [
	0, // start at level 1 so we can use 1 as the index
	5,
	15,
	30,
	50,
	75,
	105,
	140,
	180,
	225,
	275,
	330,
	390,
	455,
	525,
	600
];

export const FIXED_GOAL_SYSTEM: number[] = [
	0, // start at level 1 so we can use 1 as the index
	10,
	20,
	30,
	40,
	50,
	60,
	70,
	80,
	90,
	100,
	110,
	120,
	130,
	140,
	150,
];

export interface linesCleared {
	[key: string]: number;
	"Single": number,
	"Double": number,
	"Triple": number,
	"Quad": number,
	"T-Spin Zero": number,
	"T-Spin Single" : number,
	"T-Spin Double" : number,
	"T-Spin Triple" : number,
	"T-Spin Quad" : number,
	"Mini T-Spin Zero": number,
	"Mini T-Spin Single" : number,
	"Mini Spin Zero": number,
	"Mini Spin Single": number,
	"Mini Spin Double": number,
	"Mini Spin Triple": number,
	"Mini Spin Quad": number,
}

export interface block {
	[key: string]: any;
	"blocks" : Pos[];
	"rotationPoints": Pos[];
	"rotationPoints180": Pos[];
}

export interface pieceStruct {
	[key: string]: any;
	"size": number;
	"nbBlocks": number,
	"north": block;
	"east": block;
	"south": block;
	"west": block;
}
