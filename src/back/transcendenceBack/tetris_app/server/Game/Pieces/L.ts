import { ATetrimino } from "../ATetrimino";
import { Pos } from "../Pos";
import * as tc from "../tetrisConstants";
import LJson from "./LJson.json";
import { Matrix } from "../Matrix";

export class L extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [[]]; // 2 major, 3 minor


	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: LJson.size,
			nbBlocks: LJson.nbBlocks,
			north: this.convertBlock(LJson.north),
			east: this.convertBlock(LJson.east),
			south: this.convertBlock(LJson.south),
			west: this.convertBlock(LJson.west)
		};
	})();

	constructor(coordinates: Pos = new Pos(0, 0), texture: string = "L") {
		super("L", coordinates, texture);
	}

	protected getSpinSpecific(matrix: Matrix, major: number, minor: number, rotationPointUsed: number): string {
		if (this.canSlide(matrix) || !this.isColliding(matrix, new Pos(0, -1)))
			return "";
		return "Mini L-Spin";
	}

	public getSize(): number { return L.struct.size; }

}
