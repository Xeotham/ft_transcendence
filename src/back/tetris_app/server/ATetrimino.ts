import * as tc from "./tetrisConstants";
import { IPos } from "./IPos";
import { Matrix } from "./Matrix";
import { mod } from "./utils";
import { Mino } from "./Mino";


export abstract class ATetrimino {
	protected name:					string;
	protected rotation:				number;
	protected coordinates:			IPos;
	protected texture:				string;

	protected static struct:	tc.pieceStruct;
	protected static SpinCheck:	number[][];

	protected constructor(name: string = "None",
				coordinates: IPos = new IPos(0, 0),
				texture: string = "Empty") {
		this.name = name;
		this.coordinates = coordinates;
		this.texture = texture;
		this.rotation = tc.NORTH;
	}

	protected abstract getSpinSpecific(major: number, minor: number, rotationPointUsed: number): string;

	public toJSON() {
		return {
			name: this.name,
			rotation: this.rotation,
			texture: this.texture
		};
	}

	protected static convertBlock(jsonBlock: any): tc.block {
		let blocks: IPos[] = [];
		for (let i = 0; i < jsonBlock.nbBlocks; ++i)
			blocks.push(new IPos(jsonBlock.blocks[i].x, jsonBlock.blocks[i].y));

		let rotationPoints: IPos[] = [];
		for (let i = 0; i < jsonBlock.nbRotationPoints; ++i)
			rotationPoints.push(new IPos(jsonBlock.rotationPoints[i].x, jsonBlock.rotationPoints[i].y));

		return ({
			nbBlocks: jsonBlock.nbBlocks,
			blocks: blocks,
			nbRotationPoints: jsonBlock.nbRotationPoints,
			rotationPoints: rotationPoints
		});
	};


	protected getStruct(): tc.pieceStruct {
		return (this.constructor as typeof ATetrimino).struct;
	}

	protected getSpinCheck(): number[][] {
		return (this.constructor as typeof ATetrimino).SpinCheck;
	}

	public rotate(direction: "clockwise" | "counter-clockwise" | "180", matrix: Matrix): string {
		// TODO : Play the sounds, send animations, etc.
		let rotationPointUsed: number = -1;
		const struct = this.getStruct();
		let start: tc.block = struct[tc.ROTATIONS[this.rotation]];
		let end: tc.block | null = null;

		if (direction === "clockwise")
			end = struct[tc.ROTATIONS[mod(this.rotation + 1, 4)]];
		else if (direction === "180")
			end = struct[tc.ROTATIONS[mod(this.rotation + 2, 4)]];
		else
			end = struct[tc.ROTATIONS[mod(this.rotation + 3, 4)]];
		if (!end)
			return "";

		this.remove(matrix, false);

		for (let i = 0; i < start.nbRotationPoints; ++i) {
			const startPos: IPos = start.rotationPoints[i];
			const endPos: IPos = end.rotationPoints[i];
			const dist = startPos.distanceToIPos(endPos);

			if (!matrix.isMinoAt(this.coordinates.add(end.blocks[0].add(dist))) &&
				!matrix.isMinoAt(this.coordinates.add(end.blocks[1].add(dist))) &&
				!matrix.isMinoAt(this.coordinates.add(end.blocks[2].add(dist))) &&
				!matrix.isMinoAt(this.coordinates.add(end.blocks[3].add(dist)))) {
				rotationPointUsed = i;
				this.coordinates = this.coordinates.add(dist);
				this.rotation = direction === "clockwise" ? mod(this.rotation + 1, 4) :
					direction === "180" ? mod(this.rotation + 2, 4) : mod(this.rotation + 3, 4);
				break ;
			}
		}
		this.place(matrix, false);
		return this.getSpin(matrix, rotationPointUsed);
	}

	protected getSpin(matrix: Matrix, rotationPointUsed: number): string {
		if (this.canFall(matrix))
			return "";
		let checks: number[][] = this.getSpinCheck();
		for (let i = 0; i < this.rotation; ++i)
			checks = checks[0].map((val, index) => checks.map(row => row[index]).reverse())

		let major: number = 0;
		let minor: number = 0;
		for (let i = 0; i < checks.length; ++i) {
			for (let j = 0; j < checks[i].length; ++j) {
				if (checks[i][j] === 2 && matrix.isMinoAt(this.coordinates.add(j, i)))
					++major;
				if (checks[i][j] === 3 && matrix.isMinoAt(this.coordinates.add(j, i)))
					++minor;
			}
		}
		return this.getSpinSpecific(major, minor, rotationPointUsed);
	}

	public isColliding(matrix: Matrix, offset: IPos = new IPos(0, 0)): boolean {
		const struct = this.getStruct();
		const block: tc.block = struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < 4; ++i) {
			const pos: IPos = this.coordinates.add(block?.blocks[i]).add(offset);
			if (matrix.isMinoAt(pos))
				return true;
		}
		return false;
	}

	public place(matrix: Matrix, isSolid: boolean = false, isShadow: boolean = false): void {
		const struct = this.getStruct();
		const block: tc.block = struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < block.nbBlocks; ++i) {
			const pos: IPos = this.coordinates.add(block?.blocks[i]);
			if (pos.getY() < 0) {
				// TODO : Top Out
				return ;
			}
			if (!isShadow || (isShadow && matrix.at(pos).isEmpty())) {
				matrix.setAt(pos, new Mino(this.texture, isSolid));
				if (isShadow)
					matrix.at(pos).setShadow(true);
			}
		}
	}

	public remove(matrix: Matrix, isShadow: boolean = false): void {
		const struct = this.getStruct();
		const block: tc.block = struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < block.nbBlocks; ++i) {
			const pos: IPos = this.coordinates.add(block?.blocks[i]);
			if (!isShadow || (isShadow && matrix.at(pos).getIsShadow()))
				matrix.setAt(pos, new Mino("Empty", false));
		}
	}

	public getCoordinates(): IPos				{ return this.coordinates; }
	public setCoordinates(pos: IPos): void		{ this.coordinates = pos; }

	public getTexture(): string					{ return this.texture; }
	public setTexture(texture: string): void	{ this.texture = texture; }

	public getName(): string					{ return this.name; }
	public setName(name: string): void			{ this.name = name; }

	public getRotation(): number				{ return this.rotation; }
	public setRotation(rotation: number): void	{ this.rotation = rotation; }


	public canFall(matrix: Matrix): boolean {
		return !this.isColliding(matrix, new IPos(0, 1));
	}

}
