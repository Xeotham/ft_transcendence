import { ATetrimino } from "../Tetrimino";
import { IPos } from "../IPos";

export class I extends ATetrimino {
	constructor(coordinates: IPos = new IPos(0, 0),
				inMatrix: boolean = false,
				texture: string = "I") {
		super("I", coordinates, inMatrix, texture);
	}

	public rotate(): void {
	}
}