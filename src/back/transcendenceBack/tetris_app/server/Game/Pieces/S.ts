import { ATetrimino } from "../ATetrimino";
import { Pos } from "../Pos";
import * as tc from "../tetrisConstants";
import SJson from "./SJson.json";
import { Matrix } from "../Matrix";

export class S extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [[]]; // 2 major, 3 minor


	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: SJson.size,
			nbBlocks: SJson.nbBlocks,
			north: this.convertBlock(SJson.north),
			east: this.convertBlock(SJson.east),
			south: this.convertBlock(SJson.south),
			west: this.convertBlock(SJson.west)
		};
	})();

	constructor(coordinates: Pos = new Pos(0, 0), texture: string = "S") {
		super("S", coordinates, texture);
	}

	protected getSpinSpecific(matrix: Matrix, major: number, minor: number, rotationPointUsed: number): string {
		if (this.canSlide(matrix) || !this.isColliding(matrix, new Pos(0, -1)))
			return "";
		return "Mini S-Spin";
	}

	public getSize(): number { return S.struct.size; }

}
