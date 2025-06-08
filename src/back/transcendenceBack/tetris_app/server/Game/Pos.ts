import { clamp } from "./utils";

export class Pos {
	private x: number;
	private y: number;

	constructor(x: number, y: number);
	constructor(pos: Pos);
	constructor(arg1: number | Pos, arg2?: number) {
		if (arg1 instanceof Pos) {
			this.x = arg1.x;
			this.y = arg1.y;
		}
		else {
			this.x = arg1;
			this.y = (arg2 || 0);
		}
	}

	public getX(): number			{ return this.x; }
	public setX(x: number): void	{ this.x = x; }

	public getY(): number			{ return this.y; }
	public setY(y: number): void	{ this.y = y; }

	public add(x: number, y: number): Pos;
	public add(pos: Pos): Pos;
	public add(arg1: number | Pos, arg2?: number): Pos {
		if (arg1 instanceof Pos)
			return new Pos(this.x + arg1.x, this.y + arg1.y);
		return new Pos(this.x + arg1, this.y + (arg2 || 0));
	}

	public subtract(x: number, y: number): Pos;
	public subtract(pos: Pos): Pos;
	public subtract(arg1: number | Pos, arg2?: number): Pos {
		if (arg1 instanceof Pos)
			return new Pos(this.x - arg1.x, this.y - arg1.y);
		return new Pos(this.x - arg1, this.y - (arg2 || 0));
	}

	public distanceTo(pos: Pos): number {
		return Math.sqrt(Math.pow(this.x - pos.x, 2) + Math.pow(this.y - pos.y, 2));
	}

	public distanceToPos(pos:Pos): Pos {
		return new Pos(this.x - pos.x, this.y - pos.y);
	}

	public up(y: number = 1): Pos {
		return new Pos(this.x, this.y - y);
	}

	public down(y: number = 1): Pos {
		return new Pos(this.x, this.y + y);
	}

	public left(x: number = 1): Pos {
		return new Pos(this.x - x, this.y);
	}

	public right(x: number = 1): Pos {
		return new Pos(this.x + x, this.y);
	}

	public clamp(min: Pos, max: Pos): Pos {
		return new Pos(clamp(this.x, min.x, max.x), clamp(this.y, min.y, max.y));
	}

	public equals(pos: Pos): boolean {
		return this.x === pos.x && this.y === pos.y;
	}
}
