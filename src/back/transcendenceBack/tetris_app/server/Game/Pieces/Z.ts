import { ATetrimino } from "../ATetrimino";
import { Pos } from "../Pos";
import * as tc from "../tetrisConstants";
import ZJson from "./ZJson.json";
import { Matrix } from "../Matrix";

export class Z extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [[]]; // 2 major, 3 minor


	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: ZJson.size,
			nbBlocks: ZJson.nbBlocks,
			north: this.convertBlock(ZJson.north),
			east: this.convertBlock(ZJson.east),
			south: this.convertBlock(ZJson.south),
			west: this.convertBlock(ZJson.west)
		};
	})();

	constructor(coordinates: Pos = new Pos(0, 0), texture: string = "Z") {
		super("Z", coordinates, texture);
	}

	protected getSpinSpecific(matrix: Matrix, major: number, minor: number, rotationPointUsed: number): string {
		if (this.canSlide(matrix) || !this.isColliding(matrix, new Pos(0, -1)))
			return "";
		return "Mini Z-Spin";
	}

	public getSize(): number { return Z.struct.size; }

}
