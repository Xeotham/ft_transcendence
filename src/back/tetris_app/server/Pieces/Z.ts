import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import ZJson from "./ZJson.json";
import {Matrix} from "../Matrix";

export class Z extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 3, 3, 0, 0, 0],
		[0, 0, 1, 1, 2, 0, 0],
		[0, 0, 2, 1, 1, 3, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
	]; // 2 major, 3 minor


	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: ZJson.size,
			north: this.convertBlock(ZJson.north),
			east: this.convertBlock(ZJson.east),
			south: this.convertBlock(ZJson.south),
			west: this.convertBlock(ZJson.west)
		};
	})();

	constructor(coordinates: IPos = new IPos(0, 0), texture: string = "Z") {
		super("Z", coordinates, texture);
	}

	protected getSpinSpecific(major: number, minor: number, rotationPointUsed: number): string {
		if (major >= 2 ||
			(major >= 1 && minor >= 2))
			return "Mini Z-Spin";
		return "";
	}

	public getSize(): number { return Z.struct.size; }

}
