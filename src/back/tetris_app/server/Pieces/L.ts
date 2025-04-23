import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import LJson from "./LJson.json";
import {Matrix} from "../Matrix";

export class L extends ATetrimino {

	protected static readonly SpinCheck: number[][] = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 1, 0, 0],
		[0, 0, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
	]; // 2 major, 3 minor


	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: LJson.size,
			north: this.convertBlock(LJson.north),
			east: this.convertBlock(LJson.east),
			south: this.convertBlock(LJson.south),
			west: this.convertBlock(LJson.west)
		};
	})();

	constructor(coordinates: IPos = new IPos(0, 0), texture: string = "L") {
		super("L", coordinates, texture);
	}

	protected getSpinSpecific(major: number, minor: number, rotationPointUsed: number): string {
		if (rotationPointUsed === 4)
			return "Mini L-Spin";
		return "";
	}

	public getSize(): number { return L.struct.size; }

}
