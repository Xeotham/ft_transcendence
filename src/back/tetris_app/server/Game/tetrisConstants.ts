import { IPos } from "./IPos";
import { clamp } from "./utils";

export const ROTATIONS: string[] = ["north", "east", "south", "west"];
export const NORTH = 0;
export const EAST = 1;
export const SOUTH = 2;
export const WEST = 3;

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
	// console.log("score name in score calculus: " + score);
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

export const 	EXTRA_GARBAGE_COMBO_CALCULUS = (combo: number, table: number[]) => {
	return table[clamp(combo, 0, table.length)];
}

export const TETRIS_WIDTH: number = 10;
export const TETRIS_HEIGHT: number = 20;
export const BUFFER_WIDTH: number = TETRIS_WIDTH;
export const BUFFER_HEIGHT: number = 20;

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
	"nbBlocks": number,
	"blocks" : IPos[];
	"nbRotationPoints": number,
	"rotationPoints": IPos[];
}

export interface pieceStruct {
	[key: string]: any;
	"size": number;
	"north": block;
	"east": block;
	"south": block;
	"west": block;
}
