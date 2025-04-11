import * as tc from "./tetrisConstants";
import { Mino } from "./Mino";
import { IPos } from "./IPos";
import { Matrix } from "./Matrix";
import { ATetrimino } from "./Tetrimino";
import { S } from "./Pieces/S";
import { WebSocket } from "ws";
// import { Z } from "./Pieces/Z";
// import { I } from "./Pieces/I";
// import { J } from "./Pieces/J";
// import { L } from "./Pieces/L";
// import { T } from "./Pieces/T";
// import { O } from "./Pieces/O";
import { delay, mod } from "./utils";
import {idGenerator} from "../../pong_app/utils";

const   idGen = idGenerator()

export class TetrisGame {
	private readonly player:	WebSocket;
	private readonly size:		IPos;
	private matrix:				Matrix;
	private currentPiece:		ATetrimino | null;
	private bags:				ATetrimino[][]; // 2 bags of 7 pieces each
	private hold:				ATetrimino | null;

	private score:				number;
	private level:				number;
	private dropType:			"normal" | "soft" | "hard";
	private linesCleared:		number;
	private lineClearGoal:		number;
	private lastClear:			string;
	private B2B:				number;

	private	canSwap:			boolean;
	private shouldLock:			boolean;
	private shouldSpawn:			boolean;
	private	fallSpeed:			number;
	private	over:				boolean;

	private	fallInterval:		number;
	private	sendInterval:		number;
	private gameId:             number;


	constructor(player: WebSocket) {
		this.player = player;
		this.size = new IPos(tc.TETRIS_WIDTH, tc.TETRIS_HEIGHT);
		this.matrix = new Matrix(this.size.add(tc.BUFFER_WIDTH, tc.BUFFER_HEIGHT));
		this.currentPiece = null;
		this.bags = [this.shuffleBag(), this.shuffleBag()];
		this.hold = null;

		this.score = 0;
		this.level = tc.MIN_LEVEL;
		this.dropType = "normal";
		this.linesCleared = 0;
		this.lineClearGoal = tc.VARIABLE_GOAL_SYSTEM[this.level];
		this.lastClear = "";
		this.B2B = 0;

		this.canSwap = true;
		this.shouldLock = false;
		this.shouldSpawn = false;
		this.fallSpeed = tc.FALL_SPEED(this.level);
		this.over = false;

		this.fallInterval = 0;
		this.sendInterval = 0;
		this.gameId = idGen.next().value;
	}

	public toJSON() {
		const jsonBags: {texture: string}[][] = this.bags.map((bag) =>
			bag.map((piece) => piece.toJSON()));
		return {
			matrix: this.matrix.toJSON(),
			bags: jsonBags,
			hold: this.hold?.toJSON(),
			score: this.score,
		};
	}

	private shuffleBag(): ATetrimino[] {
		const pieces: ATetrimino[] = [new S(), /*new Z(), new I(), new J(), new L(), new T(), new O()*/]; // TODO : add all pieces
		return pieces.sort(() => Math.random() - 0.5) as ATetrimino[];
	}

	private getNextPiece(): ATetrimino {
		const piece = this.bags[0].shift();
		if (this.bags[0].length === 0) {
			this.bags[0] = this.bags[1];
			this.bags[1] = this.shuffleBag();
		}
		return piece as ATetrimino;
	}

	private async spawnPiece() {
		clearInterval(this.fallInterval);
		if (!this.currentPiece)
			return ;
		this.shouldLock = false;

		if (!this.canSwap) {// If swap was called, we are in hold phase
			if (this.hold) {
				const temp: ATetrimino = this.currentPiece;
				this.currentPiece.remove(this.matrix);
				this.currentPiece = this.hold as ATetrimino;
				this.hold = temp;
			}
			else if (!this.hold) {
				this.hold = this.currentPiece;
				this.currentPiece.remove(this.matrix);
				this.currentPiece = this.getNextPiece();
			}
		}
		else {
			this.canSwap = true;
			this.currentPiece = this.getNextPiece();
		}

		this.currentPiece.setCoordinates(new IPos(4 - 2, tc.BUFFER_HEIGHT - 2 - 1)); // -2 to take piece inner size into account
		this.currentPiece.place(this.matrix, false);
		if (this.currentPiece.isColliding(this.matrix, new IPos(0, 0))) {
			this.over = true;
			return ;
		}
		this.fallSpeed = tc.FALL_SPEED(this.level);
		await delay(200);
	}

	private async fallPiece(): Promise<void> {
		if (!this.currentPiece)
			return ;
		this.shouldSpawn = false;
		if (this.currentPiece.shouldFall(this.matrix)) {
			this.currentPiece.remove(this.matrix);
			this.currentPiece.setCoordinates(this.currentPiece.getCoordinates().down());
			this.currentPiece.place(this.matrix, false);
		}
		else {
			clearInterval(this.fallInterval);
			this.currentPiece.remove(this.matrix);
			this.currentPiece.setTexture(this.currentPiece.getTexture() + "_LOCKED")
			this.currentPiece.place(this.matrix, true);
			this.currentPiece = null;
			this.shouldSpawn = true;
		}
		this.patternPhase();
	}

	private patternPhase(): void {
		for (let y = this.matrix.getSize().getY() - 1; y >= 0; --y)
			if (this.matrix.isRowFull(y))
				this.matrix.markRow(y);

		return this.iteratePhase();
	}

	private iteratePhase(): void {

		return this.animatePhase();
	}

	private animatePhase(): void {

		return this.eliminatePhase();
	}

	private eliminatePhase(): void {
		// TODO : Special Moves score Points
		const nbClear: number = this.matrix.shiftDown();
		this.lastClear = this.scoreName(nbClear);
		this.completionPhase();
		return ;
	}

	private async completionPhase() {
		this.score += tc.SCORE_CALCULUS(this.dropType + " Drop", 0, false);
		this.score += tc.SCORE_CALCULUS(this.lastClear, this.level, this.B2B > 0);
		this.linesCleared += tc.LINES_CLEAR_CALCULUS(this.lastClear, this.B2B > 0);
		if (this.matrix.isEmpty()) {
			this.score += tc.SCORE_CALCULUS("PerfectClear", this.level, this.B2B > 0);
			this.linesCleared += tc.LINES_CLEAR_CALCULUS("PerfectClear", this.B2B > 0);
		}
		this.updateB2B();
		if (this.level < tc.MAX_LEVEL && this.linesCleared >= this.lineClearGoal) {
			++this.level;
			this.lineClearGoal = tc.VARIABLE_GOAL_SYSTEM[this.level];
		}
		if (this.shouldSpawn)
			await this.spawnPiece();
		this.fallInterval = setInterval(() => this.fallPiece(), this.fallSpeed);
		// ^^^ restart the loop starting in fallPiece
	}

	private scoreName(nbClear: number): string {
		let name: string = "";
		// TODO : T-Spin, , etc.

		switch (nbClear) {
			case 1:
				name += "Single";
				break ;
			case 2:
				name += "Double";
				break ;
			case 3:
				name += "Triple";
				break ;
			case 4:
				name += "Tetris";
				break ;
			default:
				name += "";
				break ;
		}

		return name;
	}

	private updateB2B(): void {
		if (this.lastClear === "" || this.lastClear === "PerfectClear" || this.lastClear === "Mini T-Spin")
			return ;
		if (this.lastClear === "Single" || this.lastClear === "Double" || this.lastClear === "Triple")
			this.B2B = 0;
		else
			++this.B2B;
	}

	public swap(): void {
		if (!this.canSwap)
			return ;
		this.canSwap = false;
		this.shouldSpawn = true;
	}

	public changeFallSpeed(type: "normal" | "soft" | "hard"): void {
		clearInterval(this.fallInterval);
		this.dropType = type;
		switch (type) {
			case "normal":
				this.fallSpeed = tc.FALL_SPEED(this.level);
				break;
			case "soft":
				this.fallSpeed = tc.SOFT_DROP_SPEED(this.level);
				break;
			case "hard":
				this.fallSpeed = tc.HARD_DROP_SPEED;
				this.shouldLock = true;
				break;
		}
		this.fallInterval = setInterval(() => this.fallPiece(), this.fallSpeed) as unknown as number;
	}

	private async gameLoopIteration() {
		if (this.over)
			return ;

		setTimeout(() => this.gameLoopIteration(), 0);
	}

	public async gameLoop() {
		this.sendInterval = setInterval(() => {
			this.player.send(JSON.stringify({message: this.toJSON()})) // TODO : adapt to the new format
		}, 1000 / 60) as unknown as number; // 60 times per second

		await this.spawnPiece();
		await this.gameLoopIteration();

		clearInterval(this.fallInterval);
		clearInterval(this.sendInterval);
	}
}
