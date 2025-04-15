import { IPos } from "./IPos";

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
	"Normal Drop" : 0,
	"Soft Drop" : 1,
	"Hard Drop" : 2,
}

export const SCORE_CALCULUS = (score: string, level: number, isB2B: boolean) => {
	if (SCORING[score] === undefined)
		return 0;
	if (score === "Normal Drop" || score === "Soft Drop" || score === "Hard Drop")
		return SCORING[score];
	if (isB2B)
		return SCORING[score] * level * SCORING["Back-to-Back Bonus"];
	return SCORING[score] * level;
}

export const TETRIS_WIDTH: number = 10;
export const TETRIS_HEIGHT: number = 20;
export const BUFFER_WIDTH: number = 10;
export const BUFFER_HEIGHT: number = 20;

export const VARIABLE_GOAL_SYSTEM: number[] = [
	0, // start at level 1 so we can use 1 as the index
	10,
	15,
	20,
	25,
	30,
	35,
	40,
	45,
	50,
	55,
	60,
	65,
	70,
	75,
	80,
];

export interface block {
	[key: string]: any;
	"blocks" : {
		[key: string]: any;
		"0": IPos;
		"1": IPos;
		"2": IPos;
		"3": IPos;
	};
	"rotationPoints": {
		[key: string]: any;
		"1": IPos;
		"2": IPos;
		"3": IPos;
		"4": IPos;
		"5": IPos;
	};
}

export interface pieceStruct {
	[key: string]: any;
	"size": number;
	"north": block;
	"east": block;
	"south": block;
	"west": block;
}
