import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import IJson from "./IJson.json";
import {Matrix} from "../Matrix";

export class I extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
	]; // 2 major, 3 minor


	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: IJson.size,
			north: this.convertBlock(IJson.north),
			east: this.convertBlock(IJson.east),
			south: this.convertBlock(IJson.south),
			west: this.convertBlock(IJson.west)
		};
	})();

	constructor(coordinates: IPos = new IPos(0, 0), texture: string = "I") {
		super("I", coordinates, texture);
	}

	protected getSpinSpecific(major: number, minor: number, rotationPointUsed: number): string {
		if (rotationPointUsed === 3)
			return "Mini I-Spin";
		return "";
	}

	public getSize(): number { return I.struct.size; }

}
