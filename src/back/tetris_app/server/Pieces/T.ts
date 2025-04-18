import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import TJson from "./TJson.json";
import { Matrix } from "../Matrix";

export class T extends ATetrimino {

	private static readonly TSpinCheck: number[][] = [
		[1, 0, 1],
		[0, 0, 0],
		[2, 0, 2]
	]; // 1 : Major for T-Spin, 2 : Major for Mini T-Spin

	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: TJson.size,
			north: this.convertBlock(TJson.north),
			east: this.convertBlock(TJson.east),
			south: this.convertBlock(TJson.south),
			west: this.convertBlock(TJson.west)
		};
	})();

	constructor(coordinates: IPos = new IPos(0, 0), texture: string = "T") {
		super("T", coordinates, texture);
	}

	protected getSpin(matrix: Matrix, rotationPointUsed: number): string {
		if (rotationPointUsed === 4)
			return "T-Spin";
		let checks: number[][] = T.TSpinCheck;
		for (let i = 0; i < this.rotation; ++i)
			checks = checks[0].map((val, index) => checks.map(row => row[index]).reverse())
		// console.log("T Piece checks : " + JSON.stringify(checks));

		let major: number = 0;
		let minor: number = 0;
		// console.log(this.coordinates);
		for (let i = 0; i < checks.length; ++i) {
			for (let j = 0; j < checks[i].length; ++j) {
				if (checks[i][j] === 1 && matrix.isMinoAt(this.coordinates.add(j + 2, i + 2)))
					++major;
				if (checks[i][j] === 2 && matrix.isMinoAt(this.coordinates.add(j + 2, i + 2)))
					++minor;
			}
		}
		// console.log("Major : " + major + ", Minor : " + minor);
		if (major >= 2 && minor >= 1)
			return "T-Spin";
		if (minor >= 2 && major >= 1)
			return "Mini T-Spin";
		return "";
	}

	public getSize(): number { return T.struct.size; }

}
