import { ATetrimino } from "../ATetrimino";
import { IPos } from "../IPos";
import * as tc from "../tetrisConstants";
import TJson from "./TJson.json";

export class T extends ATetrimino {

	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		return {
			size: TJson.size,
			north: this.convertBlock(TJson.north),
			east: this.convertBlock(TJson.east),
			south: this.convertBlock(TJson.south),
			west: this.convertBlock(TJson.west)
		};
	})();

	constructor(coordinates: IPos = new IPos(0, 0), texture: string = "T") {
		super("T", coordinates, texture);
	}

	public getSize(): number { return T.struct.size; }

}
