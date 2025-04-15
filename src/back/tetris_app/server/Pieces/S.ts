import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import SJson from "./SJson.json";

export class S extends ATetrimino {

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

	public getSize(): number { return S.struct.size; }

}
