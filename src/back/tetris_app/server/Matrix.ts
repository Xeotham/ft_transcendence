import { IPos } from "./IPos";
import { Mino } from "./Mino";
import { ATetrimino } from "./Tetrimino";
import * as tc from "./tetrisConstants";

export class Matrix {
	private readonly size : IPos;
	private matrix: Mino[][];

	constructor(matrix: Matrix);
	constructor(size: IPos);
	constructor(arg: Matrix | IPos) {
		if (arg instanceof Matrix)
			this.size = arg.size
		else
			this.size = arg;
		this.matrix = this.createEmptyMatrix();
		if (arg instanceof Matrix)
			this.matrix = arg.matrix.map((row) =>
				row.map((mino) =>
					new Mino(mino.getTexture(), mino.getCoordinates())));
	}

	public toJSON() {
		let newMatrix: {texture: string}[][];

		newMatrix = this.matrix.map((row) =>
			row.map((mino) => mino.toJSON()));
		return newMatrix;
	}

	private createEmptyMatrix(): Mino[][] {
		const matrix: Mino[][] = [[]];
		for (let y = 0; y < this.size.getY(); y++) {
			for (let x = 0; x < this.size.getX(); x++)
				matrix[y].push(new Mino("Empty", new IPos(x, y)));
			matrix.push([]);
		}
		return matrix;
	}

	public at(x: number, y: number): Mino;
	public at(pos: IPos): Mino;
	public at(arg1: number | IPos, arg2?: number): Mino {
		let pos: IPos;
		if (arg1 instanceof IPos)
			pos = new IPos(arg1);
		else
			pos = new IPos(arg1, arg2 as number);
		pos = pos.clamp(new IPos(0, 0), this.size.subtract(1, 1));
		return this.matrix[pos.getY()][pos.getX()];
	}

	public setAt(x: number, y: number, mino: Mino): void;
	public setAt(pos: IPos, mino: Mino): void;
	public setAt(arg1: number | IPos, arg2: number | Mino, arg3?: Mino): void {
		let pos: IPos;
		if (arg1 instanceof IPos)
			pos = new IPos(arg1);
		else
			pos = new IPos(arg1, arg2 as number);
		pos = pos.clamp(new IPos(0, 0), this.size.subtract(1, 1));
		this.matrix[pos.getY()][pos.getX()] = arg1 instanceof IPos ? arg2 as Mino : arg3 as Mino;
	}

	public isMinoAt(x: number, y: number): boolean;
	public isMinoAt(pos: IPos): boolean;
	public isMinoAt(arg1: number | IPos, arg2?: number): boolean {
		let pos: IPos;
		if (arg1 instanceof IPos)
			pos = new IPos(arg1);
		else
			pos = new IPos(arg1, arg2 as number);
		if (pos.getX() < 0 || pos.getX() >= this.size.getX() ||
			pos.getY() < 0 || pos.getY() >= this.size.getY())
			return true;
		return (!this.matrix[pos.getY()][pos.getX()].isEmpty() && !this.matrix[pos.getY()][pos.getX()].isSolid());
	}

	public getSize(): IPos { return this.size; }

	public reset(): void {
		for (let y = 0; y < this.size.getY(); y++) {
			for (let x = 0; x < this.size.getX(); x++)
				this.matrix[y][x].reset();
		}
	}
}
