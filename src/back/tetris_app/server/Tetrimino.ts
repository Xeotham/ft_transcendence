import * as tc from "./tetrisConstants";
import { IPos } from "./IPos";
import { Matrix } from "./Matrix";


export abstract class ATetrimino {
	protected name:					string;
	protected rotation:				number;
	protected coordinates:			IPos;
	protected texture:				string;

	protected static struct:	tc.pieceStruct;


	protected constructor(name: string = "None",
				coordinates: IPos = new IPos(0, 0),
				texture: string = "Empty") {
		this.name = name;
		this.coordinates = coordinates;
		this.texture = texture;
		this.rotation = tc.NORTH;
	}

	public toJSON() {
		return {
			name: this.name,
			rotation: this.rotation,
			texture: this.texture
		};
	}

	public abstract		rotate(direction: "clockwise" | "counter-clockwise", matrix: Matrix): void;
	public abstract		getSize(): number;
	public abstract		place(matrix: Matrix, isSolid: boolean): void;
	public abstract		remove(matrix: Matrix): void;
	public abstract		isColliding(matrix: Matrix, offset: IPos): boolean

	public getCoordinates(): IPos				{ return this.coordinates; }
	public setCoordinates(pos: IPos): void		{ this.coordinates = pos; }

	public getTexture(): string					{ return this.texture; }
	public setTexture(texture: string): void	{ this.texture = texture; }

	public getName(): string					{ return this.name; }
	public setRotation(name: string): void		{ this.name = name; }

	public shouldFall(matrix: Matrix): boolean {
		return !this.isColliding(matrix, new IPos(0, 1));
	}

}
