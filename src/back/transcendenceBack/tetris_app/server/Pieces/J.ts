import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import JJson from "./JJson.json";
import {Matrix} from "../Matrix";

export class J extends ATetrimino {

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

	protected getSpin(matrix: Matrix, rotationPointUsed: number): string {
		return "";
	}

	public getSize(): number { return J.struct.size; }

}
