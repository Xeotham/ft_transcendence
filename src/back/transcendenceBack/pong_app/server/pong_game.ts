import {
	PADDLE1_X,
	PADDLE2_X,
	PADDLE_Y,
	PADDLE_WIDTH,
	PADDLE_HEIGHT,
	WIDTH,
	HEIGHT,
	BALL_SIZE,
	BALL_SPEED,
	BALL_ACCELERATION_PER_BOUNCE,
	PADDLE_SPEED,
	WIN_GOAL
} from "./constants"
import { WebSocket } from "ws";
import { delay, getRoomById, player } from "../utils";
import { botLogic, resetBot } from "./bot";
import { createPongGame } from "../../user_management/api/controllers";

interface   playerScore {
	username:   string;
	score:      number;
}

export class Game {
	readonly id:number;
	players:	{ player1: player | null, player2: player | null };
	score:		{ player1: playerScore, player2: playerScore };
	paddle1:	{ x: number, y: number, x_size: number, y_size: number };
	paddle2:	{ x: number, y: number, x_size: number, y_size: number };
	ball:		{ x: number, y: number, size: number, orientation: number, speed: number };
	over:		boolean;
	winner:		player | null;
	isSolo:		boolean;
	isBot:		boolean;
	spectators:	WebSocket[];

	private startTime:	number;
	private finishTime:	number;
	private lastTime:	number;

	constructor(id: number, player1: player | null, player2: player | null, isSolo: boolean, spectators: WebSocket[] = [], isBot: boolean = false) {
		this.id = id;
		this.players = { player1, player2 };
		this.score = { player1: {username: player1?.username!, score: 0}, player2: {username: player2?.username!, score: 0} };
		this.paddle1 = { x: PADDLE1_X, y: PADDLE_Y, x_size: PADDLE_WIDTH, y_size: PADDLE_HEIGHT };
		this.paddle2 = { x: PADDLE2_X, y: PADDLE_Y, x_size: PADDLE_WIDTH, y_size: PADDLE_HEIGHT };
		this.ball = { x: WIDTH / 2, y: HEIGHT / 2, size: BALL_SIZE, orientation: 0, speed: BALL_SPEED };
		this.over = false;
		this.winner = null;
		this.isSolo = isSolo;
		this.isBot = isBot;
		this.spectators = spectators;

		this.startTime = performance.now();
		this.finishTime = this.startTime;
		this.lastTime = this.startTime;
	}

	public 	toJSON() {
		return {
			paddle1: { ...this.paddle1 },
			paddle2: { ...this.paddle2 },
			ball: { ...this.ball},
			score: this.score,
		};
	}

	public isOver()	{ return this.over; }
	public addSpectator(spectator: WebSocket) { this.spectators.push(spectator); }
	// getter

	private sendData(data: any, toSpectators: boolean = true) {
		this.players.player1?.socket.send(JSON.stringify(data));
		if (!this.isSolo)
			this.players.player2?.socket.send(JSON.stringify(data));
		if (toSpectators)
			for (let spectator of this.spectators)
				spectator?.send(JSON.stringify(data));
	}

	private sendSpectator(data: any) {
		for (let spectator of this.spectators)
			spectator?.send(JSON.stringify(data));
	}

	private async spawnBall(side: string | "P1" | "P2") {
		resetBot(this.id, 0);
		this.ball.y = Math.random() * HEIGHT / 2 + HEIGHT / 4;
		this.ball.x = WIDTH / 2;
		this.ball.orientation = Math.random() * Math.PI / 2 - Math.PI / 4;
		if (side === "P1")
			this.ball.orientation += Math.PI;
		this.ball.speed = BALL_SPEED;
		this.paddle1.y = PADDLE_Y;
		this.paddle2.y = PADDLE_Y;
		if (this.score.player1.score < WIN_GOAL && this.score.player2.score < WIN_GOAL)
			await delay(1250);
		this.lastTime = performance.now();
	}

	public 	async gameLoop() {
		return new Promise<void>((resolve) => {

			this.startTime = performance.now();
			this.lastTime = this.startTime;
			const intervalId = setInterval(() => {
				this.sendData({ type: "GAME", data: this.toJSON() }, true);
			}, 1000 / 60); // 60 times per second
			let botInterval: number = 0;
			if (this.isBot)
				botInterval = setInterval(() => {
				botLogic(this.toJSON(), this.id);
			}, 1000) as unknown as number; // once per second

			const gameLoopIteration = async () => {
				if (this.score.player1.score < WIN_GOAL && this.score.player2.score < WIN_GOAL && !this.over) {
					await this.MoveBall();
					setTimeout(gameLoopIteration, 0); // Schedule the next iteration
					return ;
				}
				// Game Over
				clearInterval(intervalId);
				clearInterval(botInterval);
				this.finishTime = performance.now();
				if (!this.over) // If the game didn't end because of a forfeit
					this.winner = (this.score.player1.score >= WIN_GOAL) ? this.players.player1 : this.players.player2;
				this.over = true;
				let winner = this.winner?.username;
				this.sendData({ type: "GAME", data: this.toJSON() }, true);
				this.sendData({ type: "GAME", data: winner, message: "FINISH" }, true);
				console.log("The winner of the room " + this.id + " is " + winner);
				getRoomById(this.id)?.removeAllSpectators();
				resetBot(this.id, 1);
 				createPongGame(this.players, this.score, this.winner, this.isSolo, this.isBot);
				resolve();
			};

			gameLoopIteration(); // Start the game loop
		});
	}

	private hitPaddle(player: string | "P1" | "P2", paddle: { x: number, y: number, x_size: number, y_size: number }) {
		let ratio = (this.ball.y - paddle.y) / (paddle.y_size / 2) - 1; // -1 to 1, based on the distance from the center of the paddle
		let angle = 45 * ratio; // -45 to 45 degrees
		if (player === "P2")
			angle = 180 - angle;
		this.ball.orientation = angle * Math.PI / 180;
		this.ball.speed += BALL_ACCELERATION_PER_BOUNCE;
	}

	private paddleCollision(player: string | "P1" | "P2") {
		const paddle = player === "P1" ? this.paddle1 : this.paddle2;

		if (this.ball.y + this.ball.size < paddle.y ||
			this.ball.y - this.ball.size > paddle.y + paddle.y_size)
			return ;
		if (player === "P1" && this.ball.x - this.ball.size / 2 < paddle.x + paddle.x_size) {
			this.ball.x = paddle.x + paddle.x_size + this.ball.size;
			this.hitPaddle(player, paddle);
			if (this.isSolo || this.isBot)
				this.players.player1?.socket.send(JSON.stringify({ type: "GAME", message: "EFFECT", data: "hitPaddle" }));
			else {
				this.players.player1?.socket.send(JSON.stringify({ type: "GAME", message: "EFFECT", data: "hitPaddle" }));
				this.sendSpectator({ type: "GAME", message: "EFFECT", data: "hitPaddle" });
				this.players.player2?.socket.send(JSON.stringify({ type: "GAME", message: "EFFECT", data: "hitOpponentPaddle" }))
			}
		}
		if (player === "P2" && this.ball.x + this.ball.size / 2 > paddle.x) {
			this.ball.x = paddle.x - this.ball.size;
			this.hitPaddle(player, paddle);
			if (this.isSolo || this.isBot) {
				this.players.player1?.socket.send(JSON.stringify({ type: "GAME", message: "EFFECT", data: "hitOpponentPaddle" }));
			} else {
				this.players.player1?.socket.send(JSON.stringify({ type: "GAME", message: "EFFECT", data: "hitOpponentPaddle" }));
				this.sendSpectator({ type: "GAME", message: "EFFECT", data: "hitOpponentPaddle" })
				this.players.player2?.socket.send(JSON.stringify({ type: "GAME", message: "EFFECT", data: "hitPaddle" }));
			}
		}
	}

	private async MoveBall() {
		const now = performance.now();
		const delta = now - this.lastTime;
		this.lastTime = now;
		const speed = this.ball.speed * delta / 1000;

		this.paddleCollision("P1");
		this.paddleCollision("P2");
		if (this.ball.y < 0 || this.ball.y + this.ball.size >= HEIGHT)
			this.ball.orientation = -this.ball.orientation;

		if (this.ball.y < 0)
			this.ball.y = this.ball.size;
		if (this.ball.y + this.ball.size > HEIGHT)
			this.ball.y = HEIGHT - this.ball.size - 1;

		this.ball.x += speed * Math.cos(this.ball.orientation);
		this.ball.y += speed * Math.sin(this.ball.orientation);

		if (this.ball.x < 0) {
			this.score.player2.score++;
			this.sendData({type: "GAME", message: "EFFECT", data: "goal"}, true);
			await this.spawnBall("P1");
		}
		if (this.ball.x + this.ball.size >= WIDTH) {
			this.score.player1.score++;
			this.sendData({type: "GAME", message: "EFFECT", data: "goal"}, true);
			await this.spawnBall("P2");
		}
	}

	public movePaddle(player: string | "P1" | "P2", key: string | "up" | "down") {
		let paddle = player === "P1" ? this.paddle1 : this.paddle2;

		paddle.y += (key === "up") ? -PADDLE_SPEED : PADDLE_SPEED;
		if (paddle.y < 0)
			paddle.y = 0;
		if (paddle.y > HEIGHT - paddle.y_size)
			paddle.y = HEIGHT - paddle.y_size;
	}

	public forfeit(player: string) {
		if (this.over)
			return ;
		if (player === "P1")
			this.winner = this.players.player2;
		else
			this.winner = this.players.player1;
		this.over = true;
	}

	public getWinner() : player | null {
		return this.winner;
	}
}
