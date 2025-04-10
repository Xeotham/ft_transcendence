import * as tc from "./tetrisConstants"
import { IPos } from "./IPos"

export class Mino {
	private texture: string;
	private coordinates: IPos;
	private solid: boolean;

	constructor(texture: string = "Empty",
				coordinates: IPos = new IPos(0, 0),
				isSolid: boolean = false) {
		this.texture = texture;
		this.coordinates = coordinates;
		this.solid = isSolid;
		if (this.texture === "Empty")
			this.solid = false;
	}

	public toJSON(){
		 return { texture: this.texture };
	}

	public  getTexture(): string { return this.texture; }
	public  setTexture(texture: string): void {
		this.texture = texture;
		if (this.texture === "Empty")
			this.solid = false;
	}

	public  getCoordinates(): IPos { return this.coordinates; }
	public  setCoordinates(coordinates: IPos): void { this.coordinates = coordinates; }

	public isSolid(): boolean { return this.solid; }
	public setSolid(isSolid: boolean): void { this.solid = isSolid; }

	public isEmpty(): boolean { return this.texture === "Empty"; }

	public reset(): void {
		this.texture = "Empty";
	}
}