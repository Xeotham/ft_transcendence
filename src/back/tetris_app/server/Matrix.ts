import { IPos } from "./IPos";
import { Mino } from "./Mino";

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
			this.matrix = arg.matrix.map((row) => row.map((mino) => new Mino(mino.getTexture(), mino.getCoordinates(), mino.isInMatrix())));
	}

	private createEmptyMatrix(): Mino[][] {
		const matrix: Mino[][] = [];
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
		if (arg1 instanceof IPos)
			return this.matrix[arg1.getY()][arg1.getX()];
		return this.matrix[arg2 as number][arg1];
	}

	public setAt(x: number, y: number, mino: Mino): void;
	public setAt(pos: IPos, mino: Mino): void;
	public setAt(arg1: number | IPos, arg2: number | Mino, arg3?: Mino): void {
		if (arg1 instanceof IPos)
			this.matrix[arg1.getY()][arg1.getX()] = arg2 as Mino;
		else
			this.matrix[arg2 as number][arg1 as number] = arg3 as Mino;
	}

	public getSize(): IPos { return this.size; }

	public reset(): void {
		for (let y = 0; y < this.size.getY(); y++) {
			for (let x = 0; x < this.size.getX(); x++)
				this.matrix[y][x].reset();
		}
	}
}
