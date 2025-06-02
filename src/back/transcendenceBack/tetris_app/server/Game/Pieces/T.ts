import { ATetrimino } from "../ATetrimino";
import { Pos } from "../Pos";
import * as tc from "../tetrisConstants";
import TJson from "./TJson.json";
import { Matrix } from "../Matrix";

export class T extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 2, 1, 2, 0, 0],
		[0, 0, 1, 1, 1, 0, 0],
		[0, 0, 3, 0, 3, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
	]; // 2 : Major for T-Spin, 3 : Minor

	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: TJson.size,
			nbBlocks: TJson.nbBlocks,
			north: this.convertBlock(TJson.north),
			east: this.convertBlock(TJson.east),
			south: this.convertBlock(TJson.south),
			west: this.convertBlock(TJson.west)
		};
	})();

	constructor(coordinates: Pos = new Pos(0, 0), texture: string = "T") {
		super("T", coordinates, texture);
	}

	protected getSpinSpecific(matrix: Matrix, major: number, minor: number, rotationPointUsed: number): string {
		if (major >= 2 && minor >= 1)
			return "T-Spin";
		if (minor >= 2 && minor >= 1 && rotationPointUsed === 4)
			return "T-Spin";
		if (minor >= 2 && major >= 1)
			return "Mini T-Spin";
		if (minor >= 1 && major >= 1 && !this.canSlide(matrix) && this.isColliding(matrix, new Pos(0, -1)))
			return "Mini T-Spin";
		return "";
	}

	public getSize(): number { return T.struct.size; }

}
