
export class Mino {
	private texture:		string;
	private solid:			boolean;
	private isShadow:		boolean;
	private shouldRemove:	boolean;

	constructor(texture: string = "EMPTY",
				isSolid: boolean = false) {
		this.texture = texture;
		this.solid = isSolid;
		if (this.texture === "EMPTY")
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
		if (this.texture === "EMPTY")
			this.solid = false;
	}

	public isSolid(): boolean { return this.solid; }
	public setSolid(isSolid: boolean): void { this.solid = isSolid; }

	public getShouldRemove(): boolean { return this.shouldRemove; }
	public setShouldRemove(shouldRemove: boolean): void { this.shouldRemove = shouldRemove; }

	public getIsShadow(): boolean { return this.isShadow; }
	public setShadow(isShadow: boolean): void { this.isShadow = isShadow; }

	public isEmpty(): boolean { return this.texture === "EMPTY"; }

	public reset(): void {
		this.texture = "EMPTY";
		this.solid = false;
		this.isShadow = false;
		this.shouldRemove = false;
	}
}