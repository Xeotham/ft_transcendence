import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import ZJson from "./ZJson.json";

export class Z extends ATetrimino {

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

	public getSize(): number { return Z.struct.size; }

}
