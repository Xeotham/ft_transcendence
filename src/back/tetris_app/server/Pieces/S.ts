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

	constructor(coordinates: IPos = new IPos(0, 0), texture: string = "S") {
		super("S", coordinates, texture);
	}

	public getSize(): number { return S.struct.size; }

	public rotate(direction: "clockwise" | "counter-clockwise", matrix: Matrix): void {
		// TODO : Play the sounds, send animations, etc.

		let start: tc.block = S.struct[tc.ROTATIONS[this.rotation]];
		let end: tc.block | null = null;

		if (direction === "clockwise")
			end = S.struct[tc.ROTATIONS[mod(this.rotation + 1, 4)]];
		else
			end = S.struct[tc.ROTATIONS[mod(this.rotation + 3, 4)]];
		if (!end)
			return ;

		this.remove(matrix);

		for (let i = 1; i <= 5; ++i) {
			const startPos: IPos = start.rotationPoints[i];
			const endPos: IPos = end.rotationPoints[i];
			const dist = startPos.distanceToIPos(endPos);

			if (matrix.at(this.coordinates.add(end.blocks[0].add(dist))).isEmpty() &&
				matrix.at(this.coordinates.add(end.blocks[1].add(dist))).isEmpty() &&
				matrix.at(this.coordinates.add(end.blocks[2].add(dist))).isEmpty() &&
				matrix.at(this.coordinates.add(end.blocks[3].add(dist))).isEmpty()) {
				this.coordinates = this.coordinates.add(dist);
				this.rotation = direction === "clockwise" ? mod(this.rotation + 1, 4) : mod(this.rotation + 3, 4);
				break ;
			}
		}
		this.place(matrix, false);
	}

	public isColliding(matrix: Matrix, offset: IPos = new IPos(0, 0)): boolean {
		const block: tc.block = S.struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < 4; ++i) {
			const pos: IPos = this.coordinates.add(block?.blocks[i]).add(offset);
			if (matrix.isMinoAt(pos))
				return true;
		}
		return false;
	}

	public place(matrix: Matrix, isSolid: boolean): void {
		const block: tc.block = S.struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < 4; ++i) {
			const pos: IPos = this.coordinates.add(block?.blocks[i]);
			matrix.setAt(pos, new Mino(this.texture, new IPos(pos), isSolid));
		}
	}

	public remove(matrix: Matrix): void {
		const block: tc.block = S.struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < 4; ++i) {
			const pos: IPos = this.coordinates.add(block?.blocks[i]);
			matrix.setAt(pos, new Mino("Empty", new IPos(pos), false));
		}
	}
}
