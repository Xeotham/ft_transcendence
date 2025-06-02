import { ATetrimino } from "../ATetrimino";
import { Pos } from "../Pos";
import * as tc from "../tetrisConstants";
import JJson from "./JJson.json";
import { Matrix } from "../Matrix";

export class J extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [[]]; // 2 major, 3 minor


	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: JJson.size,
			nbBlocks: JJson.nbBlocks,
			north: this.convertBlock(JJson.north),
			east: this.convertBlock(JJson.east),
			south: this.convertBlock(JJson.south),
			west: this.convertBlock(JJson.west)
		};
	})();

	constructor(coordinates: Pos = new Pos(0, 0), texture: string = "J") {
		super("J", coordinates, texture);
	}

	protected getSpinSpecific(matrix: Matrix, major: number, minor: number, rotationPointUsed: number): string {
		if (this.canSlide(matrix) || !this.isColliding(matrix, new Pos(0, -1)))
			return "";
		return "Mini J-Spin";
	}

	public getSize(): number { return J.struct.size; }

}
