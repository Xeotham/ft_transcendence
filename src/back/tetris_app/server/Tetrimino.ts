import * as tc from "./TetrisConstants";
import { IPos } from "./IPos";
import { Matrix } from "./Matrix";


export abstract class ATetrimino {
	private name:			string;
	private rotation:		number;
	private coordinates:	IPos;
	private inMatrix:		boolean;
	private texture:		string;
	private level:			number;
	private fallSpeed:		number;
	private innerMatrix:	Matrix;


	constructor(name: string = "None",
				coordinates: IPos = new IPos(0, 0),
				inMatrix: boolean = false,
				texture: string = "") {
		this.name = name;
		this.coordinates = coordinates;
		this.inMatrix = inMatrix;
		this.texture = texture;
		this.rotation = tc.NORTH;
		this.level = tc.MIN_LEVEL;
		this.fallSpeed = tc.FALL_SPEED(this.level);
		this.innerMatrix = new Matrix();
	}

	public abstract rotate(): void;
}
