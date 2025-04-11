import * as tc from "./tetrisConstants"
import { IPos } from "./IPos"

export class Mino {
	private texture:		string;
	private solid:			boolean;
	private shouldRemove:	boolean;

	constructor(texture: string = "Empty",
				isSolid: boolean = false) {
		this.texture = texture;
		this.solid = isSolid;
		if (this.texture === "Empty")
			this.solid = false;
		this.shouldRemove = false;
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

	public isSolid(): boolean { return this.solid; }
	public setSolid(isSolid: boolean): void { this.solid = isSolid; }

	public getShouldRemove(): boolean { return this.shouldRemove; }
	public setShouldRemove(shouldRemove: boolean): void { this.shouldRemove = shouldRemove; }

	public isEmpty(): boolean { return !this.solid; }

	public reset(): void {
		this.texture = "Empty";
		this.solid = false;
		this.shouldRemove = false;
	}
}