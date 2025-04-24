import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import SJson from "./SJson.json";
import {Matrix} from "../Matrix";

export class S extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 3, 3, 0, 0],
		[0, 0, 2, 1, 1, 0, 0],
		[0, 3, 1, 1, 2, 0, 0],
		[0, 0, 0, 3, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
	]; // 2 major, 3 minor


	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: SJson.size,
			north: this.convertBlock(SJson.north),
			east: this.convertBlock(SJson.east),
			south: this.convertBlock(SJson.south),
			west: this.convertBlock(SJson.west)
		};
	})();

	constructor(coordinates: IPos = new IPos(0, 0), texture: string = "S") {
		super("S", coordinates, texture);
	}

	protected getSpinSpecific(matrix: Matrix, major: number, minor: number, rotationPointUsed: number): string {
		if (rotationPointUsed === -1 || this.canSlide(matrix) || !this.isColliding(matrix, new IPos(0, -1)))
			return "";
		return "Mini S-Spin";
		// if (major >= 2 ||
		// 	(major >= 1 && minor >= 2))
		// 	return "Mini S-Spin";
		// return "";
	}

	public getSize(): number { return S.struct.size; }

}
