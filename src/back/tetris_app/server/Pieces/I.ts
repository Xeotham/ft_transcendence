import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import IJson from "./IJson.json";

export class I extends ATetrimino {

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

	public getSize(): number { return I.struct.size; }

}
