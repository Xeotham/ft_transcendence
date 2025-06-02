import { ATetrimino } from "../ATetrimino";
import { Pos } from "../Pos";
import * as tc from "../tetrisConstants";
import OJson from "./OJson.json";
import { Matrix } from "../Matrix";

export class O extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [[]]; // 2 major, 3 minor


	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: OJson.size,
			nbBlocks: OJson.nbBlocks,
			north: this.convertBlock(OJson.north),
			east: this.convertBlock(OJson.east),
			south: this.convertBlock(OJson.south),
			west: this.convertBlock(OJson.west)
		};
	})();

	constructor(coordinates: Pos = new Pos(0, 0), texture: string = "O") {
		super("O", coordinates, texture);
	}

	protected getSpinSpecific(matrix: Matrix, major: number, minor: number, rotationPointUsed: number): string {
		return "";
	}

	public getSize(): number { return O.struct.size; }

}
