import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import JJson from "./JJson.json";
import {Matrix} from "../Matrix";

export class J extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
	]; // 2 major, 3 minor


	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: JJson.size,
			north: this.convertBlock(JJson.north),
			east: this.convertBlock(JJson.east),
			south: this.convertBlock(JJson.south),
			west: this.convertBlock(JJson.west)
		};
	})();

	constructor(coordinates: IPos = new IPos(0, 0), texture: string = "J") {
		super("J", coordinates, texture);
	}

	protected getSpinSpecific(matrix: Matrix, major: number, minor: number, rotationPointUsed: number): string {
		if (this.canSlide(matrix) || !this.isColliding(matrix, new IPos(0, -1)))
			return "";
		return "Mini J-Spin";
	}

	public getSize(): number { return J.struct.size; }

}
