import * as tc from "./tetrisConstants"
import { IPos } from "./IPos"

export class Mino {
	private texture: string;
	private coordinates: IPos;
	private inMatrix: boolean;

	constructor(texture: string = "Empty",
				coordinates: IPos = new IPos(0, 0),
				inMatrix: boolean = false) {
		this.texture = texture;
		this.coordinates = coordinates;
		this.inMatrix = inMatrix;
	}

	public  getTexture(): string { return this.texture; }
	public  setTexture(texture: string): void { this.texture = texture; }

	public  getCoordinates(): IPos { return this.coordinates; }
	public  setCoordinates(coordinates: IPos): void { this.coordinates = coordinates; }

	public  isInMatrix(): boolean { return this.inMatrix; }
	public  setInMatrix(inMatrix: boolean): void { this.inMatrix = inMatrix; }

	public isEmpty(): boolean { return this.texture === "Empty"; }

	public reset(): void {
		this.texture = "Empty";
		this.inMatrix = false;
	}
}