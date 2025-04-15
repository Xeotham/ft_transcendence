import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import LJson from "./LJson.json";

export class L extends ATetrimino {

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

	public getSize(): number { return L.struct.size; }

}
