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
	private	canSwap:			boolean;
	private score:				number;
	private level:				number;
	private linesCleared:		number;
	private	over:				boolean;
	private	fallSpeed:			number;
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
		this.canSwap = true;
		this.score = 0;
		this.level = tc.MIN_LEVEL;
		this.linesCleared = 0;
		this.over = false;
		this.fallSpeed = tc.FALL_SPEED(this.level);
		this.fallInterval = 0;
		this.sendInterval = 0;
		this.gameId = idGen.next().value;
	}

	private toJSON() {
		const jsonBags: {texture: string}[][] = this.bags.map((bag) =>
			bag.map((piece) => piece.toJSON()));
		return {
			matrix: this.matrix.toJSON(),
			bags: jsonBags,
			hold: this.hold?.toJSON(),
			score: this.score,
		};
	}

	public getMatrix(): Matrix { return this.matrix; }
	public getCurrentPiece(): ATetrimino | null { return this.currentPiece; }
	public getScore(): number { return this.score; }
	public getLevel(): number { return this.level; }
	public getLinesCleared(): number { return this.linesCleared; }
	public getGameId(): number { return this.gameId; }

	public setCurrentPiece(piece: ATetrimino): void { this.currentPiece = piece; }
	public setScore(score: number): void { this.score = score; }
	public setLevel(level: number): void { this.level = level; }
	public setLinesCleared(linesCleared: number): void { this.linesCleared = linesCleared; }
	public setGameId(gameId: number): void { this.gameId = gameId; }

	private shuffleBag(): ATetrimino[] {
		const pieces: ATetrimino[] = [new S()]; // TODO : add all pieces
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

	private async fallPiece(): Promise<void> {
		if (!this.currentPiece)
			return ;
		if (this.currentPiece.shouldFall(this.matrix)) {
			this.currentPiece.remove(this.matrix);
			this.currentPiece.setCoordinates(this.currentPiece.getCoordinates().down());
			this.currentPiece.place(this.matrix, false);
		}
		else {
			this.currentPiece.remove(this.matrix);
			this.currentPiece.setTexture(this.currentPiece.getTexture() + "_LOCKED")
			this.currentPiece.place(this.matrix, true);
			this.currentPiece = null;
			this.spawnPiece();
		}
	}

	private async spawnPiece(isHold: boolean = false) {
		clearInterval(this.fallInterval);
		if (!this.currentPiece || (isHold && !this.hold))
			return ;
		await delay(200);
		if (isHold) {
			const temp: ATetrimino = this.currentPiece;
			this.currentPiece.remove(this.matrix);
			this.currentPiece = this.hold as ATetrimino;
			this.hold = temp;
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
		this.fallInterval = setInterval(() => this.fallPiece(), this.fallSpeed) as unknown as number;
	}

	public swap(): void {
		if (!this.canSwap || !this.currentPiece)
			return ;
		this.canSwap = false;
		if (!this.hold) {
			clearInterval(this.fallInterval);
			this.hold = this.currentPiece;
			this.currentPiece.remove(this.matrix);
			this.spawnPiece(false);
			return ;
		}
		this.spawnPiece(true);
	}

	public changeFallSpeed(type: "normal" | "soft" | "hard"): void {
		clearInterval(this.fallInterval);
		switch (type) {
			case "normal":
				this.fallSpeed = tc.FALL_SPEED(this.level);
				break;
			case "soft":
				this.fallSpeed = tc.SOFT_DROP_SPEED(this.level);
				break;
			case "hard":
				this.fallSpeed = tc.HARD_DROP_SPEED;
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
