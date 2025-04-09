import * as tc from "./tetrisConstants";
import { IPos } from "./IPos";
import { Matrix } from "./Matrix";


export abstract class ATetrimino {
	protected name:					string;
	protected rotation:				number;
	protected coordinates:			IPos;
	protected inMatrix:				boolean;
	protected texture:				string;
	protected fallSpeed:			number;
	protected innerMatrix:			Matrix;

	protected static struct:	tc.pieceStruct;


	protected constructor(name: string = "None",
				level: number = 1,
				coordinates: IPos = new IPos(0, 0),
				inMatrix: boolean = false,
				texture: string = "Empty") {
		this.name = name;
		this.coordinates = coordinates;
		this.inMatrix = inMatrix;
		this.texture = texture;
		this.rotation = tc.NORTH;
		this.fallSpeed = tc.FALL_SPEED(level);
		this.innerMatrix = new Matrix(new IPos(7, 7));
	}

	public abstract		rotate(direction: "clockwise" | "counterClockwise", matrix: Matrix): void;

	public getCoordinates(): IPos	{ return this.coordinates; }
}
