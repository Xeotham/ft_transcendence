import * as tc from "./tetrisConstants";
import { IPos } from "./IPos";
import { Matrix } from "./Matrix";
import { mod } from "./utils";
import { Mino } from "./Mino";




/*
// TODO : remove comments
	x: -1 left, +1 right
	y: -1 down, +1 up
	DIRECTION_UP = 0, DIRECTION_RIGHT = 1, DIRECTION_DOWN = 2, DIRECTION_LEFT = 3, DIRECTION_RANDOM = 4;

	private static final int WALLKICK_I_180[][][] =
	{
		{{-1, 0},{-2, 0},{ 1, 0},{ 2, 0},{ 0, 1}},													// 0>>2─ ┐
		{{ 0, 1},{ 0, 2},{ 0,-1},{ 0,-2},{-1, 0}},													// 1>>3─ ┼ ┐
		{{ 1, 0},{ 2, 0},{-1, 0},{-2, 0},{ 0,-1}},													// 2>>0─ ┘ │
		{{ 0, 1},{ 0, 2},{ 0,-1},{ 0,-2},{ 1, 0}},													// 3>>1─ ─ ┘
	};
	private static final int WALLKICK_I_180[][][] =
	{
		{{ 1, 0},{ 2, 0},{-1, 0},{-2, 0},{ 0,-1}},													// 0>>2─ ┐
		{{ 0,-1},{ 0,-2},{ 0, 1},{ 0, 2},{ 1, 0}},													// 1>>3─ ┼ ┐
		{{-1, 0},{-2, 0},{ 1, 0},{ 2, 0},{ 0, 1}},													// 2>>0─ ┘ │
		{{ 0,-1},{ 0,-2},{ 0, 1},{ 0, 2},{-1, 0}},													// 3>>1─ ─ ┘
	};

	private static final int WALLKICK_I_180[][][] =
	{
		{{ 3, 3},{ 4, 0},{ 5, 0},{ 2, 0},{ 1, 0},{ 0, 2}},													// 0>>2─ ┐
		{{ 3, 3},{ 0, 2},{ 0, 1},{ 0, 4},{ 0, 5},{ 1, 0}},													// 1>>3─ ┼ ┐
		{{ 3, 3},{ 2, 0},{ 1, 0},{ 4, 0},{ 5, 0},{ 0, 4}},													// 2>>0─ ┘ │
		{{ 3, 3},{ 0, 2},{ 0, 1},{ 0, 4},{ 0, 5},{ 2, 0}},													// 3>>1─ ─ ┘
	};

	"rotation180": [
	  { "x": 3, "y": 3 },
	  { "x": 4, "y": 0 },
	  { "x": 5, "y": 0 },
	  { "x": 2, "y": 0 },
	  { "x": 1, "y": 0 },
	  { "x": 0, "y": 2 }
	],
	"rotation180": [
	  { "x": 3, "y": 3 },
	  { "x": 0, "y": 2 },
	  { "x": 0, "y": 1 },
	  { "x": 0, "y": 4 },
	  { "x": 0, "y": 5 },
	  { "x": 1, "y": 0 }
	],
	"rotation180": [
	  { "x": 3, "y": 3 },
	  { "x": 2, "y": 0 },
	  { "x": 1, "y": 0 },
	  { "x": 4, "y": 0 },
	  { "x": 5, "y": 0 },
	  { "x": 0, "y": 4 }
	],
	"rotation180": [
	  { "x": 3, "y": 3 },
	  { "x": 0, "y": 2 },
	  { "x": 0, "y": 1 },
	  { "x": 0, "y": 4 },
	  { "x": 0, "y": 5 },
	  { "x": 2, "y": 0 }
	]


	TAKE 2

	private static final int WALLKICK_I_180[][][] =
	{
		{{-1, 0},{-2, 0},{ 1, 0},{ 2, 0},{ 0, 1}},													// 0>>2─ ┐
		{{ 0, 1},{ 0, 2},{ 0,-1},{ 0,-2},{-1, 0}},													// 1>>3─ ┼ ┐
		{{ 1, 0},{ 2, 0},{-1, 0},{-2, 0},{ 0,-1}},													// 2>>0─ ┘ │
		{{ 0, 1},{ 0, 2},{ 0,-1},{ 0,-2},{ 1, 0}},													// 3>>1─ ─ ┘
	};

	private static final int WALLKICK_I_180[][][] =
	{
		{{ 3, 3},{ 2, 3},{ 1, 3},{ 4, 3},{ 5, 3},{ 3, 4}},													// 0>>2─ ┐
		{{ 3, 3},{ 3, 4},{ 3, 5},{ 3, 2},{ 3, 1},{ 2, 3}},													// 1>>3─ ┼ ┐
		{{ 3, 3},{ 4, 3},{ 5, 3},{ 2, 3},{ 1, 3},{ 3, 2}},													// 2>>0─ ┘ │
		{{ 3, 3},{ 3, 4},{ 3, 5},{ 3, 2},{ 3, 1},{ 4, 3}},													// 3>>1─ ─ ┘
	};

	rotation180: [
	  { "x": 3, "y": 3 },
	  { "x": 2, "y": 3 },
	  { "x": 1, "y": 3 },
	  { "x": 4, "y": 3 },
	  { "x": 5, "y": 3 },
	  { "x": 3, "y": 4 }
	],
	rotation180: [
	  { "x": 3, "y": 3 },
	  { "x": 3, "y": 4 },
	  { "x": 3, "y": 5 },
	  { "x": 3, "y": 2 },
	  { "x": 3, "y": 1 },
	  { "x": 2, "y": 3 }
	],
	rotation180: [
	  { "x": 3, "y": 3 },
	  { "x": 4, "y": 3 },
	  { "x": 5, "y": 3 },
	  { "x": 2, "y": 3 },
	  { "x": 1, "y": 3 },
	  { "x": 3, "y": 2 }
	],
	rotation180: [
	  { "x": 3, "y": 3 },
	  { "x": 3, "y": 4 },
	  { "x": 3, "y": 5 },
	  { "x": 3, "y": 2 },
	  { "x": 3, "y": 1 },
	  { "x": 4, "y": 3 }
	]


	NORMAL 180 :

	private static final int WALLKICK_NORMAL_180[][][] =
	{
		{{ 1, 0},{ 2, 0},{ 1, 1},{ 2, 1},{-1, 0},{-2, 0},{-1, 1},{-2, 1},{ 0,-1},{ 3, 0},{-3, 0}},	// 0>>2─ ┐
		{{ 0, 1},{ 0, 2},{-1, 1},{-1, 2},{ 0,-1},{ 0,-2},{-1,-1},{-1,-2},{ 1, 0},{ 0, 3},{ 0,-3}},	// 1>>3─ ┼ ┐
		{{-1, 0},{-2, 0},{-1,-1},{-2,-1},{ 1, 0},{ 2, 0},{ 1,-1},{ 2,-1},{ 0, 1},{-3, 0},{ 3, 0}},	// 2>>0─ ┘ │
		{{ 0, 1},{ 0, 2},{ 1, 1},{ 1, 2},{ 0,-1},{ 0,-2},{ 1,-1},{ 1,-2},{-1, 0},{ 0, 3},{ 0,-3}},	// 3>>1─ ─ ┘
	};

	private static final int WALLKICK_NORMAL_180[][][] =
	{
		{{-1, 0},{-2, 0},{-1,-1},{-2,-1},{ 1, 0},{ 2, 0},{ 1, 1},{ 2, 1},{ 0, 1},{-3, 0},{ 3, 0}},	// 0>>2─ ┐
		{{ 0,-1},{ 0,-2},{ 1,-1},{ 1,-2},{ 0, 1},{ 0, 2},{ 1, 1},{ 1, 2},{-1, 0},{ 0,-3},{ 0, 3}},	// 1>>3─ ┼ ┐
		{{ 1, 0},{ 2, 0},{ 1, 1},{ 2, 1},{-1, 0},{-2, 0},{-1, 1},{-2, 1},{ 0,-1},{ 3, 0},{-3, 0}},	// 2>>0─ ┘ │
		{{ 0,-1},{ 0,-2},{-1,-1},{-1,-2},{ 0, 1},{ 0, 2},{-1, 1},{-1, 2},{ 1, 0},{ 0,-3},{ 0, 3}},	// 3>>1─ ─ ┘
	};

	private static final int WALLKICK_NORMAL_180[][][] =
	{
		{{ 3, 3},{ 2, 3},{ 1, 3},{ 2, 2},{ 1, 2},{ 4, 3},{ 5, 3},{ 4, 4},{ 5, 4},{ 3, 4},{ 0, 3},{ 6, 3}},	// 0>>2─ ┐
		{{ 3, 3},{ 3, 2},{ 3, 1},{ 4, 2},{ 4, 1},{ 3, 4},{ 3, 5},{ 4, 4},{ 4, 5},{ 2, 3},{ 3, 0},{ 3, 6}},	// 1>>3─ ┼ ┐
		{{ 3, 3},{ 4, 3},{ 5, 3},{ 4, 4},{ 5, 4},{ 2, 3},{ 1, 3},{ 2, 4},{ 1, 4},{ 3, 2},{ 6, 3},{ 0, 3}},	// 2>>0─ ┘ │
		{{ 3, 3},{ 3, 2},{ 3, 1},{ 2, 2},{ 2, 1},{ 3, 4},{ 3, 5},{ 2, 4},{ 2, 5},{ 4, 3},{ 3, 0},{ 3, 6}},	// 3>>1─ ─ ┘
	};
	"rotation180": [
  [
    { "x": 3, "y": 3 },
    { "x": 2, "y": 3 },
    { "x": 1, "y": 3 },
    { "x": 2, "y": 2 },
    { "x": 1, "y": 2 },
    { "x": 4, "y": 3 },
    { "x": 5, "y": 3 },
    { "x": 4, "y": 4 },
    { "x": 5, "y": 4 },
    { "x": 3, "y": 4 },
    { "x": 0, "y": 3 },
    { "x": 6, "y": 3 }
  ],
  [
    { "x": 3, "y": 3 },
    { "x": 3, "y": 2 },
    { "x": 3, "y": 1 },
    { "x": 4, "y": 2 },
    { "x": 4, "y": 1 },
    { "x": 3, "y": 4 },
    { "x": 3, "y": 5 },
    { "x": 4, "y": 4 },
    { "x": 4, "y": 5 },
    { "x": 2, "y": 3 },
    { "x": 3, "y": 0 },
    { "x": 3, "y": 6 }
  ],
  [
    { "x": 3, "y": 3 },
    { "x": 4, "y": 3 },
    { "x": 5, "y": 3 },
    { "x": 4, "y": 4 },
    { "x": 5, "y": 4 },
    { "x": 2, "y": 3 },
    { "x": 1, "y": 3 },
    { "x": 2, "y": 4 },
    { "x": 1, "y": 4 },
    { "x": 3, "y": 2 },
    { "x": 6, "y": 3 },
    { "x": 0, "y": 3 }
  ],
  [
    { "x": 3, "y": 3 },
    { "x": 3, "y": 2 },
    { "x": 3, "y": 1 },
    { "x": 2, "y": 2 },
    { "x": 2, "y": 1 },
    { "x": 3, "y": 4 },
    { "x": 3, "y": 5 },
    { "x": 2, "y": 4 },
    { "x": 2, "y": 5 },
    { "x": 4, "y": 3 },
    { "x": 3, "y": 0 },
    { "x": 3, "y": 6 }
  ]
]

	SRSX: any ={kicks: {
		"01":[[-1,0],[-1,-1],[0,2],[-1,2]]
		},
		10:[[1,0],[1,1],[0,-2],[1,-2]],
		12:[[1,0],[1,1],[0,-2],[1,-2]],
		21:[[-1,0],[-1,-1],[0,2],[-1,2]],
		23:[[1,0],[1,-1],[0,2],[1,2]],
		32:[[-1,0],[-1,1],[0,-2],[-1,-2]],
		30:[[-1,0],[-1,1],[0,-2],[-1,-2]],
		"03":[[1,0],[1,-1],[0,2],[1,2]],
		"02":[[1,0],[2,0],[1,1],[2,1],[-1,0],[-2,0],[-1,1],[-2,1],[0,-1],[3,0],[-3,0]], // Same as nullpomino
		13:[[0,1],[0,2],[-1,1],[-1,2],[0,-1],[0,-2],[-1,-1],[-1,-2],[1,0],[0,3],[0,-3]], // Same as nullpomino
		20:[[-1,0],[-2,0],[-1,-1],[-2,-1],[1,0],[2,0],[1,-1],[2,-1],[0,1],[-3,0],[3,0]], // Same as nullpomino
		31:[[0,1],[0,2],[1,1],[1,2],[0,-1],[0,-2],[1,-1],[1,-2],[-1,0],[0,3],[0,-3]]}, // Same as nullpomino
	i_kicks:{
		"01":[[-2,0],[1,0],[-2,1],[1,-2]],
		10:[[2,0],[-1,0],[2,-1],[-1,2]],
		12:[[-1,0],[2,0],[-1,-2],[2,1]],
		21:[[1,0],[-2,0],[1,2],[-2,-1]],
		23:[[2,0],[-1,0],[2,-1],[-1,2]],
		32:[[-2,0],[1,0],[-2,1],[1,-2]],
		30:[[1,0],[-2,0],[1,2],[-2,-1]],
		"03":[[-1,0],[2,0],[-1,-2],[2,1]],
		"02":[[-1,0],[-2,0],[1,0],[2,0],[0,1]],
		13:[[0,1],[0,2],[0,-1],[0,-2],[-1,0]],
		20:[[1,0],[2,0],[-1,0],[-2,0],[0,-1]],
		31:[[0,1],[0,2],[0,-1],[0,-2],[1,0]]};

 */




export abstract class ATetrimino {

	protected name:					string;
	protected rotation:				number;
	protected coordinates:			IPos;
	protected texture:				string;

	protected static struct:	tc.pieceStruct;
	protected static SpinCheck:	number[][];

	protected constructor(name: string = "None",
				coordinates: IPos = new IPos(0, 0),
				texture: string = "Empty") {
		this.name = name;
		this.coordinates = coordinates;
		this.texture = texture;
		this.rotation = tc.NORTH;
	}

	protected abstract getSpinSpecific(matrix: Matrix, major: number, minor: number, rotationPointUsed: number): string;

	public toJSON() {
		return {
			name: this.name,
			rotation: this.rotation,
			texture: this.texture
		};
	}

	protected static convertBlock(jsonBlock: any): tc.block {
		let blocks: IPos[] = [];
		for (let i = 0; i < jsonBlock.blocks?.length || 0; ++i)
			blocks.push(new IPos(jsonBlock.blocks[i].x, jsonBlock.blocks[i].y));

		let rotationPoints: IPos[] = [];
		for (let i = 0; i < jsonBlock.rotationPoints?.length || 0; ++i)
			rotationPoints.push(new IPos(jsonBlock.rotationPoints[i].x, jsonBlock.rotationPoints[i].y));

		let rotationPoints180: IPos[] = [];
		for (let i = 0; i < jsonBlock.rotationPoints180?.length || 0; ++i)
			rotationPoints180.push(new IPos(jsonBlock.rotationPoints180[i].x, jsonBlock.rotationPoints180[i].y));

		return ({
			nbBlocks: jsonBlock.nbBlocks,
			blocks: blocks,
			rotationPoints: rotationPoints,
			rotationPoints180: rotationPoints180
		});
	};


	protected getStruct(): tc.pieceStruct {
		return (this.constructor as typeof ATetrimino).struct;
	}

	protected getSpinCheck(): number[][] {
		return (this.constructor as typeof ATetrimino).SpinCheck;
	}

	public rotate(direction: "clockwise" | "counter-clockwise" | "180", matrix: Matrix): string {
		let rotationPointUsed: number = -1;
		const struct = this.getStruct();
		let start: tc.block = struct[tc.ROTATIONS[this.rotation]];
		let end: tc.block | null = null;

		if (direction === "clockwise")
			end = struct[tc.ROTATIONS[mod(this.rotation + 1, 4)]];
		else if (direction === "180")
			end = struct[tc.ROTATIONS[mod(this.rotation + 2, 4)]];
		else
			end = struct[tc.ROTATIONS[mod(this.rotation + 3, 4)]];
		if (!end)
			return "";

		this.remove(matrix, false);

		for (let i = 0; i < (direction === "180" ? start.rotationPoints180.length : start.rotationPoints.length); ++i) {
			const startPos: IPos = (direction === "180" ? new IPos(3, 3) : start.rotationPoints[i]);
			const endPos: IPos = (direction === "180" ? end.rotationPoints180[i] : end.rotationPoints[i]);
			const dist = startPos.distanceToIPos(endPos);

			// if (direction === "180") {
			// 	console.log("startPos: " + startPos, ", endPos: " + endPos, ", dist: " + dist);
			// }
			const collides = () => {
				for (let j = 0; j < struct.nbBlocks; ++j)
					if (matrix.isMinoAt(this.coordinates.add(end.blocks[j]).add(dist)))
						return true;
				return false;
			}
			if (!collides()) {
				rotationPointUsed = i;
				this.coordinates = this.coordinates.add(dist);
				this.rotation = direction === "clockwise" ? mod(this.rotation + 1, 4) :
					direction === "180" ? mod(this.rotation + 2, 4) : mod(this.rotation + 3, 4);
				break ;
			}
		}
		this.place(matrix, false);
		return this.getSpin(matrix, rotationPointUsed);
	}

	protected getSpin(matrix: Matrix, rotationPointUsed: number): string {
		if (rotationPointUsed === -1)
			return "-1";
		if (this.canFall(matrix))
			return "";
		let checks: number[][] = this.getSpinCheck();
		if (checks.length > 1)
			for (let i = 0; i < this.rotation; ++i)
				checks = checks[0].map((val, index) => checks.map(row => row[index]).reverse())

		let major: number = 0;
		let minor: number = 0;
		for (let i = 0; i < checks.length; ++i) {
			for (let j = 0; j < checks[i].length; ++j) {
				if (checks[i][j] === 2 && matrix.isMinoAt(this.coordinates.add(j, i)))
					++major;
				if (checks[i][j] === 3 && matrix.isMinoAt(this.coordinates.add(j, i)))
					++minor;
			}
		}
		return this.getSpinSpecific(matrix, major, minor, rotationPointUsed);
	}

	public isColliding(matrix: Matrix, offset: IPos = new IPos(0, 0)): boolean {
		const struct = this.getStruct();
		// console.log("Struct: ", struct);
		const block: tc.block = struct[tc.ROTATIONS[this.rotation]];
		// console.log("Block: ", block);
		for (let i = 0; i < struct.nbBlocks; ++i) {
			const pos: IPos = this.coordinates.add(block?.blocks[i]).add(offset);
			if (matrix.isMinoAt(pos))
				return true;
		}
		return false;
	}

	public place(matrix: Matrix, isSolid: boolean = false, isShadow: boolean = false): void {
		const struct = this.getStruct();
		const block: tc.block = struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < struct.nbBlocks; ++i) {
			const pos: IPos = this.coordinates.add(block?.blocks[i]);
			if (pos.getY() < 0)
				return ;
			if (!isShadow || (isShadow && matrix.at(pos).isEmpty())) {
				matrix.setAt(pos, new Mino(this.texture, isSolid));
				if (isShadow)
					matrix.at(pos).setShadow(true);
			}
		}
	}

	public remove(matrix: Matrix, isShadow: boolean = false): void {
		const struct = this.getStruct();
		const block: tc.block = struct[tc.ROTATIONS[this.rotation]];
		for (let i = 0; i < struct.nbBlocks; ++i) {
			const pos: IPos = this.coordinates.add(block?.blocks[i]);
			if (!isShadow || (isShadow && matrix.at(pos).getIsShadow()))
				matrix.setAt(pos, new Mino("EMPTY", false));
		}
	}

	public getCoordinates(): IPos				{ return this.coordinates; }
	public setCoordinates(pos: IPos): void		{ this.coordinates = pos; }

	public getTexture(): string					{ return this.texture; }
	public setTexture(texture: string): void	{ this.texture = texture; }

	public getName(): string					{ return this.name; }
	public setName(name: string): void			{ this.name = name; }

	public getRotation(): number				{ return this.rotation; }
	public setRotation(rotation: number): void	{ this.rotation = rotation; }


	public canFall(matrix: Matrix): boolean {
		return !this.isColliding(matrix, new IPos(0, 1));
	}

	public canSlide(matrix: Matrix) {
		// console.log("Can slide on left: " + !this.isColliding(matrix, new IPos(-1, 0)) + " and right: " + !this.isColliding(matrix, new IPos(1, 0)));
		return !this.isColliding(matrix, new IPos(1, 0)) || !this.isColliding(matrix, new IPos(-1, 0));
	}

}
