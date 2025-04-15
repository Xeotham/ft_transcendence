import * as tc from "./tetrisConstants"
import { IPos } from "./IPos"

export class Mino {
	private texture:		string;
	private solid:			boolean;
	private isShadow:		boolean;
	private shouldRemove:	boolean;

	constructor(texture: string = "Empty",
				isSolid: boolean = false) {
		this.texture = texture;
		this.solid = isSolid;
		if (this.texture === "Empty")
			this.solid = false;
		this.isShadow = false;
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

	public getIsShadow(): boolean { return this.isShadow; }
	public setShadow(isShadow: boolean): void { this.isShadow = isShadow; }

	public isEmpty(): boolean { return this.texture === "Empty"; }

	public reset(): void {
		this.texture = "Empty";
		this.solid = false;
		this.isShadow = false;
		this.shouldRemove = false;
	}
}