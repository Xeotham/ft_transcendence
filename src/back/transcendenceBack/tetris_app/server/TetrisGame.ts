// @ts-ignore
import { WebSocket } from "ws";
import * as tc from "./tetrisConstants";
import { IPos } from "./IPos";
import { Matrix } from "./Matrix";
import { ATetrimino } from "./ATetrimino";
import { S } from "./Pieces/S";
import { T } from "./Pieces/T";
import { Z } from "./Pieces/Z";
import { L } from "./Pieces/L";
import { J } from "./Pieces/J";
import { O } from "./Pieces/O";
import { I } from "./Pieces/I";
import { delay, mod } from "./utils";
import { getRoomById, idGenerator } from "../../pong_app/utils";

const   idGen = idGenerator()

export class TetrisGame {
	private readonly player:	WebSocket;
	private readonly size:		IPos;
	private matrix:				Matrix;
	private currentPiece:		ATetrimino | null;
	private shadowPiece:		ATetrimino | null;
	private bags:				ATetrimino[][]; // 2 bags of 7 pieces each
	private hold:				ATetrimino | null;

	private score:				number;
	private level:				number;
	private dropType:			"Normal" | "Soft" | "Hard";
	private linesCleared:		number;
	private lineClearGoal:		number;
	private spinType:			string;
	private lastClear:			string;
	private B2B:				number;

	private	canSwap:			boolean;
	private shouldSpawn:		boolean;
	private	fallSpeed:			number;
	private	over:				boolean;

	private shouldLock:			boolean;
	private isInLockPhase:		boolean;
	private lockFrame:			boolean;
	private nbMoves:			number;
	private lowestReached:		number;
	private msSinceLockPhase:	number;

	private	fallInterval:		number;
	private	lockInterval:		number;
	private	sendInterval:		number;
	private gameId:             number;


	constructor(player: WebSocket) {
		this.player = player;
		this.size = new IPos(tc.TETRIS_WIDTH, tc.TETRIS_HEIGHT);
		this.matrix = new Matrix(this.size.add(0, tc.BUFFER_HEIGHT));
		this.currentPiece = null;
		this.shadowPiece = null;
		this.bags = [this.shuffleBag(), this.shuffleBag()];
		this.hold = null;

		this.score = 0;
		this.level = tc.MIN_LEVEL;
		this.dropType = "Normal";
		this.linesCleared = 0;
		this.lineClearGoal = tc.VARIABLE_GOAL_SYSTEM[this.level];
		this.spinType = "";
		this.lastClear = "";
		this.B2B = 0;

		this.canSwap = true;
		this.shouldSpawn = false;
		this.fallSpeed = tc.FALL_SPEED(this.level);
		this.over = false;

		this.shouldLock = false;
		this.isInLockPhase = false;
		this.lockFrame = false;
		this.nbMoves = 0;
		this.lowestReached = 0;
		this.msSinceLockPhase = 0;

		this.fallInterval = -1;
		this.lockInterval = -1;
		this.sendInterval = -1;
		this.gameId = idGen.next().value;
	}

	public toJSON() {
		const jsonBags: {texture: string}[][] = this.bags.map((bag) =>
			bag.map((piece) => piece.toJSON()));
		return {
			matrix: this.matrix.toJSON(),
			bags: jsonBags,
			hold: this.hold?.toJSON(),
			gameId: this.gameId,
			score: this.score,
			level: this.level,
			canSwap: this.canSwap,
		};
	}

	public getRoomId(): number { return this.gameId; }

	private shuffleBag(): ATetrimino[] {
		const pieces: ATetrimino[] = [new S(), new T(), new Z(), new L(), new J(), new O(), new I()];
		return pieces.sort(() => Math.random() - 0.5) as ATetrimino[];
	}

	private trySetInterval(interval: number = this.fallSpeed): void {
		if (this.fallInterval !== -1) {
			console.log("Fall interval already set, not launching another one");
			return ;
		}
		this.fallInterval = setInterval(() => this.fallPiece(), interval) as unknown as number;
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
		// console.log("spawnPiece, currentPiece: ", this.currentPiece);
		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		this.shouldLock = false;
		this.shouldSpawn = false;
		this.spinType = "";

		if (!this.canSwap) { // If swap was called, we are in hold phase
			// console.log("Hold phase");
 			if (this.hold && this.currentPiece) {
				this.currentPiece.remove(this.matrix);
				this.currentPiece.setRotation(tc.NORTH);
				const temp: ATetrimino = this.currentPiece;
				this.currentPiece = this.hold as ATetrimino;
				this.hold = temp;
			}
			else if (!this.hold && this.currentPiece) {
				this.currentPiece.remove(this.matrix);
				this.currentPiece.setRotation(tc.NORTH);
				this.hold = this.currentPiece;
				this.currentPiece = this.getNextPiece();
			}
			else {
				this.canSwap = true;
				this.currentPiece = this.getNextPiece();
			}
		}
		else {
			this.canSwap = true;
			this.currentPiece = this.getNextPiece();
		}

		// console.log("currentPiece after change: ", this.currentPiece);
		if (!this.currentPiece)
			return ;

		this.currentPiece.setCoordinates(new IPos(3 - 2, tc.BUFFER_HEIGHT - 2 - 2)); // -2 to take piece inner size into account
		this.currentPiece.place(this.matrix);
		this.placeShadow();
		// console.log("isColliding at spawn: ", this.currentPiece.isColliding(this.matrix, new IPos(0, 1)));
		if (this.currentPiece.isColliding(this.matrix, new IPos(0, 1))) {
			console.log("Piece is colliding at spawn, game over");
			this.over = true;
			return ;
		}

		await delay(150);
		this.dropType === "Hard" ? this.dropType = "Normal" : true;
		this.dropType === "Normal" ? this.fallSpeed = tc.FALL_SPEED(this.level) : tc.SOFT_DROP_SPEED(this.level);

	}

	private resetLockPhase(): void {
		clearInterval(this.lockInterval);
		this.lockInterval = -1;
		this.isInLockPhase = false;
		this.shouldLock = false;
		this.msSinceLockPhase = 0;
		this.nbMoves = 0;
		this.lowestReached = this.currentPiece?.getCoordinates().getY() || 0;
		// console.log("Stopping countdown for lock phase");
	}

	private async extendedLockDown(lowestReached: number) {
		++this.msSinceLockPhase;
		// console.log("msSinceLockPhase: ", this.msSinceLockPhase);
		if (lowestReached < this.lowestReached)
			return this.resetLockPhase();
		if (this.nbMoves > 14 || this.msSinceLockPhase >= 500) {
			// console.log("Lock phase reached, locking piece at " + this.msSinceLockPhase + " ms");
			// this.nbMoves >= 500 ? console.log("Max time reached") : console.log("Max moves reached");
			this.shouldLock = true;
			this.resetLockPhase();
			this.shouldLock = true;
			clearInterval(this.fallInterval);
			this.fallInterval = -1;
			this.trySetInterval(1);
		}
	}

	private async fallPiece(): Promise<void> {
		if (!this.currentPiece)
			return ;
		if (this.currentPiece.shouldFall(this.matrix)) {
			this.spinType = "";
			this.currentPiece.remove(this.matrix);
			this.currentPiece.setCoordinates(this.currentPiece.getCoordinates().down());
			this.currentPiece.place(this.matrix);
			if (this.currentPiece.getCoordinates().getY() > this.lowestReached) {
				if (this.isInLockPhase)
					this.resetLockPhase();
				this.lowestReached = this.currentPiece.getCoordinates().getY();
			}
		}
		if (!this.currentPiece.shouldFall(this.matrix)) {
			if (this.shouldLock) {
				// console.log("Fall piece is locked");
				clearInterval(this.fallInterval);
				this.lockFrame = true;
				this.fallInterval = -1;
				this.currentPiece.remove(this.matrix);
				this.currentPiece.setTexture(this.currentPiece.getTexture() + "_LOCKED")
				this.currentPiece.place(this.matrix, true);
				this.currentPiece = null;
				this.shouldSpawn = true;
				this.isInLockPhase = false;
			}
			else if (!this.isInLockPhase) {
				this.isInLockPhase = true;
				if (this.lockInterval === -1) {
					this.lockInterval = setInterval(() => this.extendedLockDown(this.lowestReached), 1) as unknown as number;
				}
			}
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
		if (this.lockFrame) {
			const nbClear: number = this.matrix.shiftDown();
			this.lastClear = this.scoreName(nbClear);
			this.linesCleared += nbClear;
		}
		this.completionPhase();
		return ;
	}

	private async completionPhase() {
		this.score += tc.SCORE_CALCULUS(this.dropType + " Drop", 0, false);

		if (this.lockFrame) {
			this.updateB2B("pre");
			if (this.lastClear !== "") {
				console.log("lastClear: " + this.lastClear + ", B2B: " + this.B2B);
				this.player.send(JSON.stringify({type: "EFFECT", arguments: this.lastClear}));
			}
			this.score += tc.SCORE_CALCULUS(this.lastClear, this.level, this.B2B > 0);
			if (this.matrix.isEmpty()) {
				this.score += tc.SCORE_CALCULUS("PerfectClear", this.level, this.B2B > 0);
				this.player.send(JSON.stringify({type: "EFFECT", arguments: "PerfectClear"}));
			}
			this.updateB2B("post");
			this.lockFrame = false;
		}

 		if (this.level < tc.MAX_LEVEL && this.linesCleared >= this.lineClearGoal) {
			++this.level;
			this.lineClearGoal = tc.VARIABLE_GOAL_SYSTEM[this.level];
		}
		if (this.shouldSpawn) {
			await this.spawnPiece();
			this.trySetInterval();
			// ^^^ restart the loop starting in fallPiece
		}
		this.placeShadow();
	}

	private placeShadow(): void {
		if (!this.currentPiece)
			return ;
		this.shadowPiece?.remove(this.matrix, true);
		this.shadowPiece = new (this.currentPiece!.constructor as { new (coordinates: IPos, texture: string): ATetrimino })(
			this.currentPiece.getCoordinates(), this.currentPiece.getTexture() + "_SHADOW");
		this.shadowPiece.setCoordinates(this.currentPiece.getCoordinates());
		this.shadowPiece.setRotation(this.currentPiece.getRotation());
		while (this.shadowPiece.shouldFall(this.matrix))
			this.shadowPiece.setCoordinates(this.shadowPiece.getCoordinates().down());

		this.shadowPiece.place(this.matrix, false, true);
	}

	private scoreName(nbClear: number): string {
		let name: string = "";
		// console.log("Getting score name");

		if (this.spinType !== "")
			name = this.spinType + " ";

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

	private updateB2B(moment: "pre" | "post"): void {
		const isIgnored = (): boolean => {
			return this.lastClear === "" || this.lastClear === "PerfectClear" || this.lastClear === "Mini T-Spin" || this.lastClear === "T-Spin";
		}
		const isB2B = (): boolean => {
			return this.lastClear.includes("Tetris") || this.lastClear.includes("T-Spin") || this.lastClear.includes("Mini T-Spin");
		}

		if (isIgnored())
			return ;
		if (moment === "pre" && !isB2B())
			this.B2B = 0;
		else if (moment === "post" && isB2B())
			++this.B2B;
	}

	public async swap() {
		if (!this.canSwap || this.over || this.fallInterval === -1)
			return ;
		// console.log("Holding piece");
		this.canSwap = false;
		// this.shouldSpawn = true;

		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		this.resetLockPhase();
		await this.spawnPiece();
		this.trySetInterval();
	}

	public changeFallSpeed(type: "Normal" | "Soft" | "Hard"): void {
		if (this.over || type === this.dropType || this.fallInterval === -1)
			return ;
		// this.shouldChangeSpeed = true;

		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		this.resetLockPhase();
		this.dropType = type;
		switch (type) {
			case "Normal":
				this.fallSpeed = tc.FALL_SPEED(this.level);
				break;
			case "Soft":
				this.fallSpeed = tc.SOFT_DROP_SPEED(this.level);
				break;
			case "Hard":
				this.fallSpeed = tc.HARD_DROP_SPEED;
				this.shouldLock = true;
				break;
		}
		this.trySetInterval();
	}

	public rotate(direction: "clockwise" | "counter-clockwise" | "180"): void {
		if (!this.currentPiece)
			return ;
		if (this.isInLockPhase) {
			++this.nbMoves;
			this.msSinceLockPhase = 0;
		}
		this.spinType = this.currentPiece.rotate(direction, this.matrix);
		if (this.spinType !== "") {
			console.log("Spin type: " + this.spinType);
			// this.player.send(JSON.stringify({type: "EFFECT", arguments: this.spinType}))
		}
		this.placeShadow();
	}

	public move(direction: "left" | "right"): void {
		if (!this.currentPiece)
			return ;
		if (this.isInLockPhase) {
			++this.nbMoves;
			this.msSinceLockPhase = 0;
		}

		const offset: IPos = direction === "left" ? new IPos(-1, 0) : new IPos(1, 0);
		if (this.currentPiece.isColliding(this.matrix, offset))
			// console.log("Collision detected");
			return ;
		this.currentPiece.remove(this.matrix);
		this.currentPiece.setCoordinates(this.currentPiece.getCoordinates().add(offset));
		this.currentPiece.place(this.matrix);
		this.placeShadow();
	}

	private async gameLoopIteration() {
		return new Promise<void>((resolve) => {
			const Iteration = async () => {
				if (!this.over) {
					setTimeout(Iteration, 0); // Schedule the next iteration
					return;
				}
				resolve();
			}
			Iteration();
			});
	}

	public async gameLoop() {
		this.sendInterval = setInterval(() => {
			this.player.send(JSON.stringify({type: "GAME", game: this.toJSON()})) // TODO : adapt to the new format
		}, 1000 / 60) as unknown as number; // 60 times per second

		await this.spawnPiece();
		this.placeShadow();
		this.trySetInterval();
		await this.gameLoopIteration();

		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		clearInterval(this.sendInterval);
		this.sendInterval = -1;
		this.player.send(JSON.stringify({type: "GAME", game: this.toJSON()})) // TODO : adapt to the new format
		console.log("Game Over");
		this.player.send(JSON.stringify({type: "FINISH"}))
	}

	public forfeit() {
		this.over = true;
	}
}
