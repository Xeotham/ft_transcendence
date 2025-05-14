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
import { getRoomById, idGenerator } from "../../../pong_app/utils";

const   idGen = idGenerator()

export class TetrisGame {
	private readonly player:			WebSocket;
	private readonly size:				IPos;
	private matrix:						Matrix;
	private currentPiece:				ATetrimino | null;
	private shadowPiece:				ATetrimino | null;
	private bags:						ATetrimino[][]; // 2 bags of 7 pieces each
	private hold:						ATetrimino | null;

	private level:						number;
	private dropType:					"Normal" | "Soft" | "Hard";
	private lineClearGoal:				number;
	private spinType:					string;
	private lastClear:					string;
	private B2B:						number;

	private	canSwap:					boolean;
	private holdPhase:					boolean;
	private shouldSpawn:				boolean;
	private	fallSpeed:					number;
	private	over:						boolean;

	private shouldLock:					boolean;
	private isInLockPhase:				boolean;
	private lockFrame:					boolean;
	private nbMoves:					number;
	private lowestReached:				number;
	private msSinceLockPhase:			number;

	private	fallInterval:				number;
	private	lockInterval:				number;
	private	sendInterval:				number;
	private readonly gameId:			number;

	// multiplayer

	private opponent:					TetrisGame | null;
	private awaitingGarbage:			number[];

	// statistics

	private beginningTime:				number;
	private gameTime:					number;
	private	combo:						number;
	private	maxCombo:					number;
	private piecesPlaced:				number;
	private piecesPerSecond:			number;
	private attacksSent:				number;
	private attacksSentPerMinute:		number;
	private attacksReceived:			number;
	private attacksReceivedPerMinute:	number;
	private keysPressed:				number;
	private keysPerPiece:				number;
	private keysPerSecond:				number;
	private holds:						number;
	private score:						number;
	private linesCleared:				number;
	private linesPerMinute:				number;
	private maxB2B:						number;
	private perfectClears:				number;
	private allLinesClear:				tc.linesCleared;

	// settings

	private showShadowPiece:			boolean;
	private showBags:					boolean;
	private holdAllowed:				boolean;
	private showHold:					boolean;
	private infiniteHold:				boolean;
	private infiniteMovement:			boolean;
	private ARE:						number;
	private spawnARE:					number;


	constructor(player: WebSocket) {
		this.player = player;
		this.size = new IPos(tc.TETRIS_WIDTH, tc.TETRIS_HEIGHT);
		this.matrix = new Matrix(this.size.add(0, tc.BUFFER_HEIGHT));
		this.currentPiece = null;
		this.shadowPiece = null;
		this.bags = [this.shuffleBag(), this.shuffleBag()];
		this.hold = null;

		this.level = tc.MIN_LEVEL;
		this.dropType = "Normal";
		this.lineClearGoal = tc.FIXED_GOAL_SYSTEM[this.level];
		this.spinType = "";
		this.lastClear = "";
		this.combo = -1;
		this.B2B = -1;

		this.canSwap = true;
		this.holdPhase = false;
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

		// multiplayer

		this.opponent = null;
		this.awaitingGarbage = [];

		// statistics

		this.beginningTime = Date.now();
		this.gameTime = 0;
		this.maxCombo = 0;
		this.piecesPlaced = 0;
		this.piecesPerSecond = 0;
		this.attacksSent = 0;
		this.attacksSentPerMinute = 0;
		this.attacksReceived = 0;
		this.attacksReceivedPerMinute = 0;
		this.keysPressed = 0;
		this.keysPerPiece = 0;
		this.keysPerSecond = 0;
		this.holds = 0;
		this.score = 0;
		this.linesCleared = 0;
		this.linesPerMinute = 0;
		this.maxB2B = 0;
		this.perfectClears = 0;
		this.allLinesClear = {
			"Single": 0,
			"Double": 0,
			"Triple": 0,
			"Quad": 0,
			"T-Spin Zero": 0,
			"T-Spin Single" : 0,
			"T-Spin Double" : 0,
			"T-Spin Triple" : 0,
			"T-Spin Quad" : 0,
			"Mini T-Spin Zero": 0,
			"Mini T-Spin Single" : 0,
			"Mini Spin Zero": 0,
			"Mini Spin Single": 0,
			"Mini Spin Double": 0,
			"Mini Spin Triple": 0,
			"Mini Spin Quad": 0,
		};

		// settings

		this.showShadowPiece = true;
		this.showBags = true;
		this.holdAllowed = true;
		this.showHold = true;
		this.infiniteHold = true; // TODO : set to false for real games
		this.infiniteMovement = true; // TODO : set to false for real games
		this.ARE = -1; // Amount of time in ms in between a piece reaching the ground and locking down // TODO : set to 500 for real games
		this.spawnARE = 0; // Amount of time in ms in between the piece spawning and starting to move // 250 in the guideline
	}

	public toJSON() {
		let jsonBags: { texture: string }[][] | undefined;
		this.showBags ? jsonBags = this.bags.map((bag) =>
			bag.map((piece) => piece.toJSON())) :
			jsonBags = undefined;
		return {
			matrix: this.matrix.toJSON(),
			bags: jsonBags,
			hold: this.showHold ? this.hold?.toJSON() : undefined,
			gameId: this.gameId,
			score: this.score,
			level: this.level,
			time: this.gameTime,
			linesCleared: this.linesCleared,
			lineClearGoal: this.lineClearGoal,
			piecesPlaced: this.piecesPlaced,
			piecesPerSecond: this.piecesPerSecond,
		};
	}

	public getGameId(): number { return this.gameId; }
	public isOver(): boolean { return this.over; }
	public setOver(over: boolean): void { this.over = over; }
	public getPlayer(): WebSocket { return this.player; }
	public setOpponent(opponent: TetrisGame): void { this.opponent = opponent; }

	public setSettings(settings: any): void {
		if (!settings)
			return ;
		Object.keys(settings).forEach((key) => {
			console.log("Setting " + key + " to " + settings[key]);
			if (key in this && settings[key] !== undefined) {
				(this as any)[key] = settings[key];
			}
		});
	}

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

		if (this.holdPhase) { // If swap was called, we are in hold phase
			this.holdPhase = false;
			// console.log("Hold phase");
			this.currentPiece?.remove(this.matrix);
			this.currentPiece?.setRotation(tc.NORTH);
 			if (this.hold && this.currentPiece) {
				const temp: ATetrimino = this.currentPiece;
				this.currentPiece = this.hold as ATetrimino;
				this.hold = temp;
			}
			else if (!this.hold && this.currentPiece) {
				this.hold = this.currentPiece;
				this.currentPiece = this.getNextPiece();
			}
		}
		else {
			this.canSwap = true;
			this.currentPiece = this.getNextPiece();
		}
		if (!this.currentPiece)
			return ;

		this.currentPiece.setCoordinates(new IPos(3 - 2, tc.BUFFER_HEIGHT - 3 - 2)); // -2 to take piece inner size into account
		if (this.currentPiece.isColliding(this.matrix, new IPos(0, 0))) {
			console.log("Piece is colliding at spawn, game over");
			this.over = true;
			return ;
		}
		this.currentPiece.place(this.matrix);
		this.placeShadow();

		this.dropType === "Hard" ? this.dropType = "Normal" : true;
		this.dropType === "Normal" ? this.fallSpeed = tc.FALL_SPEED(this.level) : tc.SOFT_DROP_SPEED(this.level);

		await delay(this.spawnARE);

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
		if ((!this.infiniteMovement && this.nbMoves > 14) ||
			(this.ARE >= 0 && this.msSinceLockPhase >= this.ARE)) {
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
		if (this.currentPiece.canFall(this.matrix)) {
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
		else {
			if (this.shouldLock) {
				// console.log("Fall piece is locked");
				clearInterval(this.fallInterval);
				this.fallInterval = -1;
				this.currentPiece.remove(this.matrix);
				this.currentPiece.setTexture(this.currentPiece.getTexture() + "_LOCKED")
				this.currentPiece.place(this.matrix, true);
				this.currentPiece = null;
				this.lockFrame = true;
				this.shouldSpawn = true;
				this.isInLockPhase = false;
				++this.piecesPlaced;
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
		if (this.currentPiece?.canFall(this.matrix))
			this.score += tc.SCORE_CALCULUS(this.dropType + " Drop", 0, false);

		if (this.lockFrame) {
			this.lockFramePhase();
			this.lockFrame = false;
		}

 		if (this.level < tc.MAX_LEVEL && this.linesCleared >= this.lineClearGoal) {
			++this.level;
			this.lineClearGoal = tc.FIXED_GOAL_SYSTEM[this.level];
		}
		if (this.shouldSpawn) {
			await this.spawnPiece();
			this.trySetInterval();
			// ^^^ restart the loop starting in fallPiece
		}
		this.placeShadow();
	}

	private lockFramePhase(): void {
		this.updateB2B();
		if (this.lastClear.includes("Zero")) {
			if (this.combo >= 1)
				this.player.send(JSON.stringify({type: "EFFECT", argument: "COMBO", prefix: "break"}))
			this.combo = -1;
		}
		else
			++this.combo;
		if (this.combo > this.maxCombo)
			this.maxCombo = this.combo;
		if (this.combo >= 1)
			this.score += tc.STANDARD_COMBO_SCORING(this.combo, this.level);
		if (this.lastClear !== "Zero") {
			if (this.lastClear.includes("-Spin") && !this.lastClear.includes("T")) // Register T-Spin and Mini T-Spin uniquely
				// remove the "Z-" / "L-" / "J-" / "S-" / "I-". Not "T-"
				++this.allLinesClear[this.lastClear.substring(0, this.lastClear.indexOf("Spin") - 2) + this.lastClear.substring(this.lastClear.indexOf("Spin"))];
			else
				++this.allLinesClear[this.lastClear];
			// console.log("lastClear: " + this.lastClear + ", B2B: " + this.B2B);
			this.player.send(JSON.stringify({type: "EFFECT", argument: "SPECIAL_LOCK", prefix: this.lastClear}));
			if (this.combo > 0)
				this.player.send(JSON.stringify({type: "EFFECT", argument: "COMBO", prefix: this.combo}));
		}
		this.sendGarbage(this.lastClear);
		if (this.matrix.isEmpty()) {
			++this.perfectClears;
			this.sendGarbage("Perfect Clear");
			this.player.send(JSON.stringify({type: "EFFECT", argument: "SPECIAL_LOCK", prefix: "Perfect Clear"}));
		}
		if (this.lastClear !== "Zero" && this.B2B > 0)
			this.player.send(JSON.stringify({type: "EFFECT", argument: "B2B", prefix: this.B2B}));
		if (this.awaitingGarbage.length > 0) {
			if (this.matrix.addGarbage(this.awaitingGarbage[0]) === "Top Out")
				this.over = true;
			this.awaitingGarbage.shift();
		}
	}

	private placeShadow(): void {
		if (!this.currentPiece || !this.showShadowPiece)
			return ;
		this.shadowPiece?.remove(this.matrix, true);
		this.shadowPiece = new (this.currentPiece!.constructor as { new (coordinates: IPos, texture: string): ATetrimino })(
			this.currentPiece.getCoordinates(), this.currentPiece.getTexture() + "_SHADOW");
		this.shadowPiece.setCoordinates(this.currentPiece.getCoordinates());
		this.shadowPiece.setRotation(this.currentPiece.getRotation());
		while (this.shadowPiece.canFall(this.matrix))
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
				name += "Quad";
				break ;
			default:
				name += "Zero";
				break ;
		}

		return name;
	}

	private updateB2B(): void {
		if (this.lastClear.includes("Zero") || this.lastClear === "Perfect Clear")
			return ;
		if (this.lastClear.includes("Quad") || this.lastClear.includes("Spin"))
			++this.B2B;
		else {
			if (this.B2B >= 1)
				this.player.send(JSON.stringify({type: "EFFECT", argument: "B2B", prefix: "break"}));
			this.B2B = -1;
		}
		if (this.B2B > this.maxB2B)
			this.maxB2B = this.B2B;
	}

	private sendGarbage(clear: string): void {
		const sending: number = tc.GARBAGE_CALCULUS(clear, this.combo, this.B2B, tc.MULTIPLIER_COMBO_GARBAGE_TABLE);
		this.score += tc.SCORE_CALCULUS(clear, this.level, this.B2B > 0);
		if (sending <= 0)
			return ;
		this.attacksSent += sending;
		// console.log("Sending " + sending + " lines of garbage");
		this.opponent?.receiveGarbage(sending);
	}

	private receiveGarbage(lines: number): void {
		if (this.over)
			return ;
		// console.log("Received" + lines + " lines of Garbage");
		this.attacksReceived += lines;
		this.awaitingGarbage.push(lines);
	}

	public async swap() {
		if (!this.holdAllowed || !this.canSwap || this.over || this.fallInterval === -1)
			return ;

		++this.keysPressed;
		++this.holds;
		this.holdPhase = true;
		if (!this.infiniteHold)
			this.canSwap = false;

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
		console.log("rotate received");
		++this.keysPressed;
		if (this.isInLockPhase) {
			if (!this.infiniteMovement)
				++this.nbMoves;
			this.msSinceLockPhase = 0;
		}
		this.spinType = this.currentPiece.rotate(direction, this.matrix);
		if (this.spinType !== "") {
			console.log("Spin type: " + this.spinType);
			this.player.send(JSON.stringify({type: "EFFECT", argument: "SPIN", prefix: this.spinType}))
		}
		this.placeShadow();
	}

	public move(direction: "left" | "right"): void {
		if (!this.currentPiece)
			return ;

		++this.keysPressed;
		const offset: IPos = direction === "left" ? new IPos(-1, 0) : new IPos(1, 0);
		if (this.currentPiece.isColliding(this.matrix, offset))
			// console.log("Collision detected");
			return ;
		if (this.isInLockPhase) {
			if (!this.infiniteMovement)
				++this.nbMoves;
			this.msSinceLockPhase = 0;
		}
		this.currentPiece.remove(this.matrix);
		this.currentPiece.setCoordinates(this.currentPiece.getCoordinates().add(offset));
		this.currentPiece.place(this.matrix);
		this.placeShadow();
	}

	private async gameLoopIteration() {
		return new Promise<void>((resolve) => {
			const Iteration = async () => {
				if (!this.over) {

					this.gameTime = Date.now() - this.beginningTime;
					this.piecesPerSecond = parseFloat((this.piecesPlaced / (this.gameTime / 1000)).toFixed(2));

					setTimeout(Iteration, 1); // Schedule the next iteration
					return;
				}

				this.keysPerSecond = parseFloat((this.keysPressed / (this.gameTime / 1000)).toFixed(2));
				this.keysPerPiece = parseFloat((this.keysPressed / this.piecesPlaced).toFixed(2));
				this.linesPerMinute = parseFloat((this.linesCleared / (this.gameTime / 1000 / 60)).toFixed(2));
				this.attacksSentPerMinute = parseFloat((this.attacksSent / (this.gameTime / 1000 / 60)).toFixed(2));
				this.attacksReceivedPerMinute = parseFloat((this.attacksReceived / (this.gameTime / 1000 / 60)).toFixed(2));
				resolve();
			}
			Iteration();
			});
	}

	public async gameLoop() {
		this.sendInterval = setInterval(() => {
			this.player.send(JSON.stringify({type: "GAME", game: this.toJSON()}))
		}, 1000 / 60) as unknown as number; // 60 times per second

		await this.spawnPiece();
		this.placeShadow();
		this.trySetInterval();
		await this.gameLoopIteration();

		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		clearInterval(this.sendInterval);
		this.sendInterval = -1;
		this.player.send(JSON.stringify({type: "GAME", game: this.toJSON()}));
		this.sendStats();
		// console.log("Game Over");
		this.player.send(JSON.stringify({type: "FINISH"}));
	}

	private sendStats() {
		this.player.send(JSON.stringify({type: "STATS", argument: {
			gameTime: this.gameTime,
			piecesPlaced: this.piecesPlaced,
			piecesPerSecond: this.piecesPerSecond,
			attacksSent: this.attacksSent,
			attacksSentPerMinute: this.attacksSentPerMinute,
			attacksReceived: this.attacksReceived,
			attacksReceivedPerMinute: this.attacksReceivedPerMinute,
			keysPressed: this.keysPressed,
			keysPerPiece: this.keysPerPiece,
			keysPerSecond: this.keysPerSecond,
			holds: this.holds,
			score: this.score,
			linesCleared: this.linesCleared,
			linesPerMinute: this.linesPerMinute,
			maxB2B: this.maxB2B,
			PerfectClears: this.perfectClears,
			...this.allLinesClear,
		}}));
	}

	public forfeit() {
		this.over = true;
	}
}
