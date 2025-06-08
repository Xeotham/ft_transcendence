import { Pos } from "./Pos";
import { Mino } from "./Mino";

export class Matrix {

	private static readonly full: Mino = new Mino("Full", true);

	private readonly size : Pos;
	private matrix: Mino[][];

	constructor(matrix: Matrix);
	constructor(size: Pos);
	constructor(arg: Matrix | Pos) {
		if (arg instanceof Matrix)
			this.size = arg.size
		else
			this.size = arg;
		this.matrix = this.createEmptyMatrix();
		if (arg instanceof Matrix)
			this.matrix = arg.matrix.map((row) =>
				row.map((mino) =>
					new Mino(mino.getTexture(), mino.isSolid())));
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
				matrix[y].push(new Mino("EMPTY"));
			matrix.push([]);
		}
		return matrix;
	}

	public at(x: number, y: number): Mino;
	public at(pos: Pos): Mino;
	public at(arg1: number | Pos, arg2?: number): Mino {
		let pos: Pos;
		if (arg1 instanceof Pos)
			pos = arg1;
		else
			pos = new Pos(arg1, arg2 as number);
		if (!pos.equals(pos.clamp(new Pos(0, 0), this.size.subtract(1, 1))))
			return Matrix.full;
		return this.matrix[pos.getY()][pos.getX()];
	}

	public setAt(x: number, y: number, mino: Mino): void;
	public setAt(pos: Pos, mino: Mino): void;
	public setAt(arg1: number | Pos, arg2: number | Mino, arg3?: Mino): void {
		let pos: Pos;
		if (arg1 instanceof Pos)
			pos = arg1;
		else
			pos = new Pos(arg1, arg2 as number);
		if (!pos.equals(pos.clamp(new Pos(0, 0), this.size.subtract(1, 1))))
			return ;
		this.matrix[pos.getY()][pos.getX()] = arg1 instanceof Pos ? arg2 as Mino : arg3 as Mino;
	}

	public isMinoAt(x: number, y: number): boolean;
	public isMinoAt(pos: Pos): boolean;
	public isMinoAt(arg1: number | Pos, arg2?: number): boolean {
		let pos: Pos;
		if (arg1 instanceof Pos)
			pos = new Pos(arg1);
		else
			pos = new Pos(arg1, arg2 as number);
		if (pos.getX() < 0 || pos.getX() >= this.size.getX() ||
			pos.getY() < 0 || pos.getY() >= this.size.getY())
			return true;
		return (!this.matrix[pos.getY()][pos.getX()].isEmpty() && this.matrix[pos.getY()][pos.getX()].isSolid());
	}

	public getSize(): Pos { return this.size; }

	public reset(): void {
		for (let y = this.size.getY() - 1; y >= 0; --y) {
			for (let x = this.size.getX() - 1; x >= 0; --x)
				this.matrix[y][x].reset();
		}
	}

	public isRowFull(row: number): boolean {
		for (let x = this.size.getX() - 1; x >= 0 ; --x) {
			if (!this.isMinoAt(x, row))
				return false;
		}
		return true;
	}

	public isRowEmpty(row: number): boolean {
		for (let x = this.size.getX() - 1; x >= 0 ; --x) {
			if (this.isMinoAt(x, row))
				return false;
		}
		return true;
	}

	public markRow(row: number): void {
		for (let x = this.size.getX() - 1; x >= 0 ; --x)
			this.matrix[row][x].setShouldRemove(true);
	}

	public shiftDown(): number {
		let lineRemoved = 0;

		for (let y = 0; y < this.size.getY(); ++y) {
			if (this.matrix[y][0].getShouldRemove()) {
				for (let x = 0 ; x < this.size.getX(); ++x) {
					for (let i = y; i > 0; --i)
						this.matrix[i][x] = this.matrix[i - 1][x];
					this.matrix[0][x] = new Mino("EMPTY");
				}
				++lineRemoved;
			}
		}
		return lineRemoved;
	}

	public shiftUp(lines: number = 1): string {
		if (lines < 1)
			return "";
		for (let i = 0; i < lines; ++i)
			if (!this.isRowEmpty(i))
				return "Top Out";
		for (let x = 0; x < this.size.getX(); ++x)
			for (let y = lines; y < this.size.getY(); ++y)
				this.matrix[y - lines][x] = this.matrix[y][x];
		return "";
	}

	public isEmpty(): boolean {
		for (let y = 0; y < this.size.getY(); ++y) {
			for (let x = 0; x < this.size.getX(); ++x) {
				if (!this.matrix[y][x].isEmpty())
					return false;
			}
		}
		return true;
	}

	public addGarbage(lines: number): string {
		if (this.shiftUp(lines) === "Top Out")
			return "Top Out";
		const hole: number = Math.floor(Math.random() * this.size.getX());
		for (let y = this.size.getY() - lines; y < this.size.getY(); ++y) {
			for (let x = 0; x < this.size.getX(); ++x) {
				if (x === hole)
					this.matrix[y][x] = new Mino("EMPTY");
				else
					this.matrix[y][x] = new Mino("GARBAGE", true);
			}
		}
		return "";
	}
}
