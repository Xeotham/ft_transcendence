import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import OJson from "./OJson.json";
import {Matrix} from "../Matrix";

export class O extends ATetrimino {

	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: OJson.size,
			north: this.convertBlock(OJson.north),
			east: this.convertBlock(OJson.east),
			south: this.convertBlock(OJson.south),
			west: this.convertBlock(OJson.west)
		};
	})();

	constructor(coordinates: IPos = new IPos(0, 0), texture: string = "O") {
		super("O", coordinates, texture);
	}

	protected getSpin(matrix: Matrix, rotationPointUsed: number): string {
		return "";
	}

	public getSize(): number { return O.struct.size; }

}
