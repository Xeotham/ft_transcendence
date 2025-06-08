import { WebSocket } from "ws";
import * as tc from "./tetrisConstants";
import { Pos } from "./Pos";
import { Matrix } from "./Matrix";
import { ATetrimino } from "./ATetrimino";
import { S } from "./Pieces/S";
import { T } from "./Pieces/T";
import { Z } from "./Pieces/Z";
import { L } from "./Pieces/L";
import { J } from "./Pieces/J";
import { O } from "./Pieces/O";
import { I } from "./Pieces/I";
import { clamp, delay, mod } from "./utils";
import { idGenerator } from "../../../pong_app/utils";
import { createTetrisGame } from "../../../user_management/api/controllers";

const   idGen = idGenerator()

export class TetrisGame {
	private readonly player:			WebSocket;
	private readonly username:			string;
	private readonly size:				Pos;
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
	private hasForfeit:					boolean;

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

	private opponent:					TetrisGame | undefined;
	private awaitingGarbage:			number[];
	private garbageRespite:				boolean;
	private isInRoom:					boolean;

	// statistics

	private beginningTime:				number;
	private totalTime:					number;
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
	private lockTime:					number;
	private spawnARE:					number;
	private softDropAmp:				number;
	private isLevelling:				boolean;
	private canRetry:					boolean;

	private initialState:				TetrisGame;

	constructor(player: WebSocket, username: string) {
		this.player = player;
		this.username = username;
		this.size = new Pos(tc.TETRIS_WIDTH, tc.TETRIS_HEIGHT);
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
		this.hasForfeit = false;

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

		this.opponent = undefined;
		this.awaitingGarbage = [];
		this.garbageRespite = false;
		this.isInRoom = false;

		// statistics

		this.beginningTime = Date.now();
		this.totalTime = this.beginningTime;
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
		this.infiniteHold = false;
		this.infiniteMovement = false;
		this.lockTime = 500; // Amount of time in ms in between a piece reaching the ground and locking down
		this.spawnARE = 0; // Amount of time in ms in between the piece spawning and starting to move // 250 in the guideline
		this.softDropAmp = 1;
		this.isLevelling = true;
		this.canRetry = true;

		this.initialState = JSON.parse(JSON.stringify(this));
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
			canSwap: this.canSwap,
			gameId: this.gameId,
			score: this.score,
			level: this.level,
			time: this.gameTime,
			awaitingGarbage: this.awaitingGarbage,
			linesCleared: this.linesCleared,
			lineClearGoal: this.lineClearGoal,
			piecesPlaced: this.piecesPlaced,
			piecesPerSecond: this.piecesPerSecond,
		};
	}

	public getGameId(): number { return this.gameId; }
	public isOver(): boolean { return this.over; }
	public getUsername(): string { return this.username; }
	public getHasForfeit(): boolean { return this.hasForfeit; }
	public getScore(): number { return this.score; }

	public setOver(over: boolean): void { this.over = over; }
	public setOpponent(opponent: TetrisGame): void { this.opponent = opponent; }
	public setSettings(settings: any): void {
		if (!settings || this.fallInterval !== -1)
			return ;
		Object.keys(settings).forEach((key) => {
			// console.log("Setting " + key + " to " + settings[key]);
			if (key in this && settings[key] !== undefined) {
				(this as any)[key] = settings[key];
			}
		});
		this.initialState = JSON.parse(JSON.stringify(this));
	}

	private shuffleBag(): ATetrimino[] {
		const pieces: ATetrimino[] = [new S(), new T(), new Z(), new L(), new J(), new O(), new I()];
		return pieces.sort(() => Math.random() - 0.5) as ATetrimino[];
	}

	private trySetInterval(interval: number = this.fallSpeed): void {
		if (this.over)
			return console.log("Game is over, not launching fall interval");
		if (this.fallInterval !== -1)
			return console.log("Fall interval already set, not launching another one");
		if (interval < 0)
			return console.log("interval is negative, not launching");
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

		this.currentPiece.setCoordinates(new Pos(3 - 2, tc.BUFFER_HEIGHT - 3 - 2)); // -2 to take piece inner size into account
		if (this.currentPiece.isColliding(this.matrix)) {
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
			(this.lockTime >= 0 && this.msSinceLockPhase >= this.lockTime)) {
			// console.log("Lock phase reached, locking piece at " + this.msSinceLockPhase + " ms");
			// this.lockTime >= 500 ? console.log("Max time reached") : console.log("Max moves reached");
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
			if (this.dropType === "Soft")
				this.player.send(JSON.stringify({type: "EFFECT", argument: "USER_EFFECT", value: "softdrop" }));
			this.spinType = "";
			this.currentPiece.remove(this.matrix);
			this.currentPiece.setCoordinates(this.currentPiece.getCoordinates().down());
			this.currentPiece.place(this.matrix);
			if (this.currentPiece.getCoordinates().getY() > this.lowestReached) {
				if (this.isInLockPhase)
					this.resetLockPhase();
				this.lowestReached = this.currentPiece.getCoordinates().getY();
			}
			if (this.dropType !== "Hard" && !this.currentPiece.canFall(this.matrix))
				this.player.send(JSON.stringify({type: "EFFECT", argument: "BOARD", value: "floor" }));
		}
		else {
			if (this.shouldLock) {
				clearInterval(this.fallInterval);
				if (this.dropType === "Hard")
					this.player.send(JSON.stringify({type: "EFFECT", argument: "USER_EFFECT", value: "harddrop" }));
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
			if (nbClear >= 1)
				this.garbageRespite = true;
			this.lastClear = this.scoreName(nbClear);
			this.linesCleared += nbClear;
			this.updateB2B();
			if (this.lastClear.includes("Zero")) {
				if (this.combo >= 3)
					this.player.send(JSON.stringify({type: "EFFECT", argument: "COMBO", value: "break" }));
				this.combo = -1;
			}
			else
				++this.combo;
			if (this.lastClear !== "Zero") {
				if (this.lastClear.includes("-Spin") && !this.lastClear.includes("T")) // Register T-Spin and Mini T-Spin uniquely
					// remove the "Z-" / "L-" / "J-" / "S-" / "I-". Not "T-"
					++this.allLinesClear[this.lastClear.substring(0, this.lastClear.indexOf("Spin") - 2) + this.lastClear.substring(this.lastClear.indexOf("Spin"))];
				else
					++this.allLinesClear[this.lastClear];

				if (this.lastClear.includes("Spin Zero"))
					this.player.send(JSON.stringify({type: "EFFECT", argument: "LOCK", value: "spinend"}));
				else if (this.lastClear.includes("Spin"))
					this.player.send(JSON.stringify({type: "EFFECT", argument: "CLEAR", value: "spin"}));
				else if (this.B2B > 0)
					this.player.send(JSON.stringify({type: "EFFECT", argument: "CLEAR", value: "btb" }));
				else
 					this.player.send(JSON.stringify({type: "EFFECT", argument: "CLEAR", value: "line"}));

				if (this.combo >= 1) {
					this.score += tc.STANDARD_COMBO_SCORING(this.combo, this.level);
					this.player.send(JSON.stringify({type: "EFFECT", argument: "COMBO", value: this.combo }));
				}
				if (this.combo > this.maxCombo)
					this.maxCombo = this.combo;
			}
			else
				this.player.send(JSON.stringify({type: "EFFECT", argument: "LOCK", value: "lock"}));
		}
		this.completionPhase();
		return ;
	}

	private async completionPhase() {
		if (this.currentPiece?.canFall(this.matrix))
			this.score += tc.SCORE_CALCULUS(this.dropType + " Drop", 0, false);
		if (this.lockFrame) {
			this.sendGarbage(this.lastClear);
			if (this.matrix.isEmpty()) {
				++this.perfectClears;
				this.sendGarbage("Perfect Clear");
				this.player.send(JSON.stringify({type: "EFFECT", argument: "CLEAR", value: "all" }));
			}
			if (this.lastClear !== "Zero" && this.B2B > 0)
				this.player.send(JSON.stringify({type: "EFFECT", argument: "BTB", value: this.B2B }));
			if (!this.garbageRespite && this.awaitingGarbage.length > 0) {
				if (this.matrix.addGarbage(this.awaitingGarbage[0]) === "Top Out") {
					this.player.send(JSON.stringify({type: "EFFECT", argument: "BOARD", value: "topout"}));
					this.over = true;
					return ;
				}
				if (this.awaitingGarbage[0] <= 2)
					this.player.send(JSON.stringify({type: "EFFECT", argument: "GARBAGE", value: "damage_small"}));
				else if (this.awaitingGarbage[0] <= 4)
					this.player.send(JSON.stringify({type: "EFFECT", argument: "GARBAGE", value: "damage_medium"}));
				else
					this.player.send(JSON.stringify({type: "EFFECT", argument: "GARBAGE", value: "damage_large"}));
				this.awaitingGarbage.shift();
			}
			this.garbageRespite = false;
			this.lockFrame = false;
		}
 		if (this.isLevelling && this.level < tc.MAX_LEVEL && this.linesCleared >= this.lineClearGoal) {
			++this.level;
			this.lineClearGoal = tc.FIXED_GOAL_SYSTEM[this.level];
			if (this.level % 5 === 0)
				this.player.send(JSON.stringify({type: "EFFECT", argument: "LEVEL", value: this.level.toString()}));
			else
				this.player.send(JSON.stringify({type: "EFFECT", argument: "LEVEL", value: "up"}));
		}
		if (this.shouldSpawn) {
			await this.spawnPiece();
			this.trySetInterval();
			// ^^^ restart the loop starting in fallPiece
		}
		this.placeShadow();
	}

	private placeShadow(): void {
		if (!this.currentPiece || !this.showShadowPiece)
			return ;
		this.shadowPiece?.remove(this.matrix, true);
		this.shadowPiece = new (this.currentPiece!.constructor as { new (coordinates: Pos, texture: string): ATetrimino })(
			this.currentPiece.getCoordinates(), this.currentPiece.getTexture() + "_SHADOW");
		this.shadowPiece.setCoordinates(this.currentPiece.getCoordinates());
		this.shadowPiece.setRotation(this.currentPiece.getRotation());
		while (this.shadowPiece.canFall(this.matrix))
			this.shadowPiece.setCoordinates(this.shadowPiece.getCoordinates().down());

		this.shadowPiece.place(this.matrix, false, true);
	}

	private scoreName(nbClear: number, withSpin: boolean = true): string {
		let name: string = "";
		if (withSpin && this.spinType !== "")
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
			if (this.B2B >= 4)
				this.player.send(JSON.stringify({type: "EFFECT", argument: "BTB", value: "break" }));
			this.B2B = -1;
		}
		if (this.B2B > this.maxB2B)
			this.maxB2B = this.B2B;
	}

	private sendGarbage(clear: string): void {
		let sendSound: boolean = false;
		let sending: number = tc.GARBAGE_CALCULUS(clear, this.combo, this.B2B, tc.MULTIPLIER_COMBO_GARBAGE_TABLE);
		this.score += tc.SCORE_CALCULUS(clear, this.level, this.B2B > 0);
		sending = Math.floor(sending);
		while (this.awaitingGarbage.length > 0 && sending > 0) {
			sendSound = true;
			if (this.awaitingGarbage[0] > sending) {
				this.awaitingGarbage[0] -= sending;
				sending = 0;
			}
			else
				sending -= this.awaitingGarbage.shift()!;
		}
		if (sendSound)
			this.player.send(JSON.stringify({type: "EFFECT", argument: "GARBAGE", value: "counter"}));
		if (sending <= 0 || !this.opponent)
			return ;
		else if (sending <= 2)
			this.player.send(JSON.stringify({type: "EFFECT", argument: "GARBAGE", value: "garbage_out_small"}));
		else if (sending <= 4)
			this.player.send(JSON.stringify({type: "EFFECT", argument: "GARBAGE", value: "garbage_out_medium"}));
		else
			this.player.send(JSON.stringify({type: "EFFECT", argument: "GARBAGE", value: "garbage_out_large"}));
		this.attacksSent += sending;
		this.opponent?.receiveGarbage(sending);
	}

	private receiveGarbage(lines: number): void {
		if (this.over || lines <= 0)
			return ;
		else if (lines <= 2)
			this.player.send(JSON.stringify({type: "EFFECT", argument: "GARBAGE", value: "garbage_in_small"}));
		else if (lines <= 4)
			this.player.send(JSON.stringify({type: "EFFECT", argument: "GARBAGE", value: "garbage_in_medium"}));
		else
			this.player.send(JSON.stringify({type: "EFFECT", argument: "GARBAGE", value: "garbage_in_large"}));
		this.attacksReceived += lines;
		this.awaitingGarbage.push(lines);
	}

	public changeFallSpeed(type: "Normal" | "Soft" | "Hard"): void {
		if (this.over || type === this.dropType || this.fallInterval === -1)
			return ;

		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		this.resetLockPhase();
		this.dropType = type;
		switch (type) {
			case "Normal":
				this.fallSpeed = tc.FALL_SPEED(this.level);
				// console.log("Changing fall speed to Normal: " + this.fallSpeed);
				break;
			case "Soft":
				this.fallSpeed = tc.SOFT_DROP_SPEED(this.level) / this.softDropAmp;
				// console.log("soft drop speed: " + tc.SOFT_DROP_SPEED(this.level) + " / " + this.softDropAmp + " = " + this.fallSpeed);
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
		let rotation: string = this.currentPiece.rotate(direction, this.matrix);
		// console.log("rotation: " + rotation);
		if (rotation !== "-1") {
			++this.keysPressed;
			if (this.isInLockPhase) {
				if (!this.infiniteMovement)
					++this.nbMoves;
				// console.log("nbMoves: " + this.nbMoves);
				this.msSinceLockPhase = 0;
			}
			this.spinType = rotation;
			if (this.spinType !== "") {
				// console.log("Spin type: '" + this.spinType + "'");
				this.player.send(JSON.stringify({type: "EFFECT", argument: "SPIN", value: this.spinType}))
			}
			else
				this.player.send(JSON.stringify({type: "EFFECT", argument: "USER_EFFECT", value: "rotate" }));
		}
		this.placeShadow();
	}

	public move(direction: "left" | "right"): void {
		if (!this.currentPiece)
			return ;

		++this.keysPressed;
		const offset: Pos = direction === "left" ? new Pos(-1, 0) : new Pos(1, 0);
		if (this.currentPiece.isColliding(this.matrix, offset))
			return;
		if (this.isInLockPhase) {
			if (!this.infiniteMovement)
				++this.nbMoves;
			// console.log("nbMoves: " + this.nbMoves);
			this.msSinceLockPhase = 0;
		}
		this.currentPiece.remove(this.matrix);
		this.currentPiece.setCoordinates(this.currentPiece.getCoordinates().add(offset));
		this.currentPiece.place(this.matrix);

		if (this.currentPiece.isColliding(this.matrix, offset))
			this.player.send(JSON.stringify({type: "EFFECT", argument: "BOARD", value: "sidehit"}));
		else
			this.player.send(JSON.stringify({type: "EFFECT", argument: "USER_EFFECT", value: "move"}));

		this.placeShadow();
	}

	public async swap() {
		if (!this.holdAllowed || !this.canSwap || this.over || this.fallInterval === -1)
			return ;

		this.player.send(JSON.stringify({type: "EFFECT", argument: "USER_EFFECT", value: "hold"}));
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
				this.totalTime = Date.now() - this.beginningTime;
				resolve();
			}
			Iteration();
			});
	}

	public async gameLoop() {
		// console.log("Starting game loop");
		this.player.send(JSON.stringify({type: "GAME_START", game: this.toJSON()}));
		this.sendInterval = setInterval(() => {
			this.player.send(JSON.stringify({type: "GAME", game: this.toJSON()}));
		}, 1000 / 60) as unknown as number; // 60 times per second

		await this.spawnPiece();
		this.placeShadow();
		this.trySetInterval();

		await this.gameLoopIteration();

		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		clearInterval(this.sendInterval);
		this.sendInterval = -1;
		this.player.send(JSON.stringify({type: "EFFECT", argument: "BOARD", value: "gameover"}));
		this.player.send(JSON.stringify({type: "GAME", game: this.toJSON()}));
		this.player.send(JSON.stringify({type: "STATS", argument: this.getStats()}));
		createTetrisGame(this);
		// console.log("isInRoom: ", this.isInRoom);
		if (!this.isInRoom)
			this.player.send(JSON.stringify({type: "GAME_FINISH"}));
	}

	getStats() {
		const   stats: {[key: string]: any} = {
			level: this.level,
			isInRoom: this.isInRoom,
			gameTime: this.gameTime,
			totalTime: (new Date(this.totalTime || 0).toISOString().substring(14, 23)),
			maxCombo: this.maxCombo,
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
			perfectClears: this.perfectClears,
			single: this.allLinesClear.Single,
			double: this.allLinesClear.Double,
			triple: this.allLinesClear.Triple,
			quad: this.allLinesClear.Quad,
			tspinZero: this.allLinesClear["T-Spin Zero"],
			tspinSingle: this.allLinesClear["T-Spin Single"],
			tspinDouble: this.allLinesClear["T-Spin Double"],
			tspinTriple: this.allLinesClear["T-Spin Triple"],
			miniTspinZero: this.allLinesClear["Mini T-Spin Zero"],
			miniTspinSingle: this.allLinesClear["Mini T-Spin Single"],
			miniSpinZero: this.allLinesClear["Mini Spin Zero"],
			miniSpinSingle: this.allLinesClear["Mini Spin Single"],
			miniSpinDouble: this.allLinesClear["Mini Spin Double"],
			miniSpinTriple: this.allLinesClear["Mini Spin Triple"],
			miniSpinQuad: this.allLinesClear["Mini Spin Quad"],
			}

		return stats;
	}

	public forfeit() {
		this.over = true;
		this.hasForfeit = true;
	}

	public async retry() {
		if (this.isOver() || !this.canRetry)
			return ;
		clearInterval(this.fallInterval);
		this.fallInterval = -1;
		clearInterval(this.lockInterval);
		this.lockInterval = -1;

		// console.log("Retrying game");

		const matrix = this.matrix;
		const restoredState: TetrisGame = JSON.parse(JSON.stringify(this.initialState));
		Object.assign(this, restoredState);
		this.matrix = matrix;
		this.matrix.reset();
		this.bags = [this.shuffleBag(), this.shuffleBag()];
		await this.spawnPiece();
		this.placeShadow();
		this.trySetInterval();
		this.hold = null;
		this.beginningTime = Date.now();
	}
}
