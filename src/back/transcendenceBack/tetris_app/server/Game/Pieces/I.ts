import { ATetrimino } from "../ATetrimino";
import { Pos } from "../Pos";
import * as tc from "../tetrisConstants";
import IJson from "./IJson.json";
import { Matrix } from "../Matrix";

export class I extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [[]]; // 2 major, 3 minor

	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: IJson.size,
			nbBlocks: IJson.nbBlocks,
			north: this.convertBlock(IJson.north),
			east: this.convertBlock(IJson.east),
			south: this.convertBlock(IJson.south),
			west: this.convertBlock(IJson.west)
		};
	})();

	constructor(coordinates: Pos = new Pos(0, 0), texture: string = "I") {
		super("I", coordinates, texture);
	}

	protected getSpinSpecific(matrix: Matrix, major: number, minor: number, rotationPointUsed: number): string {
		if (this.canSlide(matrix) || !this.isColliding(matrix, new Pos(0, -1)))
			return "";
		return "Mini I-Spin";
	}

	public getSize(): number { return I.struct.size; }

}
