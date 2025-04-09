import { Mino } from "../Mino";
import { ATetrimino } from "../Tetrimino";
import { IPos } from "../IPos";
import { Matrix } from "../Matrix";
import * as tc from "../tetrisConstants";
import SJson from "./S.json";
import { mod } from "../utils"

export class S extends ATetrimino {

	// Load the JSON file and convert it to the pieceStruct
	protected static struct: tc.pieceStruct = (() => {
		const convertBlock = (jsonBlock: any): tc.block => ({
			blocks: {
				0: new IPos(jsonBlock.blocks[0].x, jsonBlock.blocks[0].y),
				1: new IPos(jsonBlock.blocks[1].x, jsonBlock.blocks[1].y),
				2: new IPos(jsonBlock.blocks[2].x, jsonBlock.blocks[2].y),
				3: new IPos(jsonBlock.blocks[3].x, jsonBlock.blocks[3].y)
			},
			rotationPoints: {
				1: new IPos(jsonBlock.rotationPoints[1].x, jsonBlock.rotationPoints[1].y),
				2: new IPos(jsonBlock.rotationPoints[2].x, jsonBlock.rotationPoints[2].y),
				3: new IPos(jsonBlock.rotationPoints[3].x, jsonBlock.rotationPoints[3].y),
				4: new IPos(jsonBlock.rotationPoints[4].x, jsonBlock.rotationPoints[4].y),
				5: new IPos(jsonBlock.rotationPoints[5].x, jsonBlock.rotationPoints[5].y)
			}
		});

		return {
			size: SJson.size,
			north: convertBlock(SJson.north),
			east: convertBlock(SJson.east),
			south: convertBlock(SJson.south),
			west: convertBlock(SJson.west)
		};
	})();

	constructor(coordinates: IPos = new IPos(0, 0),
				level: number = 1,
				inMatrix: boolean = false,
				texture: string = "S") {
		super("S", level, coordinates, inMatrix, texture);

		this.innerMatrix = new Matrix(new IPos(S.struct.size, S.struct.size));

		const block: tc.block = S.struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < 4; ++i) {
			const pos: IPos = block?.blocks[i];
			this.innerMatrix.setAt(pos, new Mino(this.texture, new IPos(pos)));
		}
	}

	public getSize(): number { return S.struct.size; }

	public rotate(direction: "clockwise" | "counterClockwise", matrix: Matrix): void {
		// TODO : Play the sounds, send animations, etc.


		let start: tc.block = S.struct[tc.ROTATIONS[this.rotation]];
		let end: tc.block | null = null;

		if (direction === "clockwise")
			end = S.struct[tc.ROTATIONS[mod(this.rotation + 1, 4)]];
		else
			end = S.struct[tc.ROTATIONS[mod(this.rotation + 3, 4)]];

		if (!end)
			return ;

		for (let i = 0; i < 4; ++i)
			this.innerMatrix.at(start.blocks[i]).reset();

		for (let i = 1; i <= 5; ++i) {
			const startPos: IPos = start.rotationPoints[i];
			const endPos: IPos = end.rotationPoints[i];
			const dist = startPos.distanceToIPos(endPos);

			if (matrix.at(this.coordinates.add(end.blocks[0].add(dist))).isEmpty() &&
				matrix.at(this.coordinates.add(end.blocks[1].add(dist))).isEmpty() &&
				matrix.at(this.coordinates.add(end.blocks[2].add(dist))).isEmpty() &&
				matrix.at(this.coordinates.add(end.blocks[3].add(dist))).isEmpty()) {
				for (let j = 0; i < 4; ++j)
					this.innerMatrix.setAt(end.blocks[j].add(dist), new Mino(this.texture, new IPos(end.blocks[j].add(dist))));
				return ;
			}
		}

		// No rotation possible, so we set the blocks back to their original position
		for (let i = 0; i < 4; ++i)
			this.innerMatrix.setAt(start.blocks[i], new Mino(this.texture, new IPos(start.blocks[i])));
	}
}
