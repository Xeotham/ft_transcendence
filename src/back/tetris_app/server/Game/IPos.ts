import {clamp} from "./utils";

export class IPos {
	private x: number;
	private y: number;

	constructor(x: number, y: number);
	constructor(pos: IPos);
	constructor(arg1: number | IPos, arg2?: number) {
		if (arg1 instanceof IPos) {
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

	public add(x: number, y: number): IPos;
	public add(pos: IPos): IPos;
	public add(arg1: number | IPos, arg2?: number): IPos {
		if (arg1 instanceof IPos)
			return new IPos(this.x + arg1.x, this.y + arg1.y);
		return new IPos(this.x + arg1, this.y + (arg2 || 0));
	}

	public subtract(x: number, y: number): IPos;
	public subtract(pos: IPos): IPos;
	public subtract(arg1: number | IPos, arg2?: number): IPos {
		if (arg1 instanceof IPos)
			return new IPos(this.x - arg1.x, this.y - arg1.y);
		return new IPos(this.x - arg1, this.y - (arg2 || 0));
	}

	public distanceTo(pos: IPos): number {
		return Math.sqrt(Math.pow(this.x - pos.x, 2) + Math.pow(this.y - pos.y, 2));
	}

	public distanceToIPos(pos:IPos): IPos {
		return new IPos(this.x - pos.x, this.y - pos.y);
	}

	public up(y: number = 1): IPos {
		return new IPos(this.x, this.y - y);
	}

	public down(y: number = 1): IPos {
		return new IPos(this.x, this.y + y);
	}

	public left(x: number = 1): IPos {
		return new IPos(this.x - x, this.y);
	}

	public right(x: number = 1): IPos {
		return new IPos(this.x + x, this.y);
	}

	public clamp(min: IPos, max: IPos): IPos {
		return new IPos(clamp(this.x, min.x, max.x), clamp(this.y, min.y, max.y));
	}

	public equals(pos: IPos): boolean {
		return this.x === pos.x && this.y === pos.y;
	}
}