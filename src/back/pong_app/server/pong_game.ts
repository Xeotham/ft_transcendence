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
	PADDLE_SPEED
} from "./constants"
import { WebSocket } from "ws";
import {requestBody, delay, getRoomById} from "../utils";

export class Game {
	readonly id:number;
	players:	{ player1: WebSocket | null, player2: WebSocket | null };
	score:		{ player1: number, player2: number };
	paddle1:	{ x: number, y: number, x_size: number, y_size: number };
	paddle2:	{ x: number, y: number, x_size: number, y_size: number };
	ball:		{ x: number, y: number, size: number, orientation: number, speed: number };
	over:		boolean;
	winner:		WebSocket | null;
	isSolo:		boolean;
	spectators:	WebSocket[];

	private startTime:	number;
	private finishTime:	number;
	private lastTime:	number;

	constructor(id: number, player1: WebSocket | null, player2: WebSocket | null, isSolo: boolean, spectators: WebSocket[] = []) {
		this.id = id;
		this.players = { player1, player2 };
		this.score = { player1: 0, player2: 0 };
		this.paddle1 = { x: PADDLE1_X, y: PADDLE_Y, x_size: PADDLE_WIDTH, y_size: PADDLE_HEIGHT };
		this.paddle2 = { x: PADDLE2_X, y: PADDLE_Y, x_size: PADDLE_WIDTH, y_size: PADDLE_HEIGHT };
		this.ball = { x: WIDTH / 2, y: HEIGHT / 2, size: BALL_SIZE, orientation: 0, speed: BALL_SPEED };
		this.over = false;
		this.winner = null;
		this.isSolo = isSolo;
		this.spectators = spectators;

		this.startTime = performance.now();
		this.finishTime = this.startTime;
		this.lastTime = this.startTime;
	}

	toJSON() {
		return {
			paddle1: this.paddle1,
			paddle2: this.paddle2,
			ball: this.ball,
		};
	}

	isOver()	{ return this.over; }
	addSpectator(spectator: WebSocket) { this.spectators.push(spectator); }

	private sendData(data: any, toSpectators: boolean = true) {
		this.players.player1?.send(JSON.stringify(data));
		if (!this.isSolo)
			this.players.player2?.send(JSON.stringify(data));
		if (toSpectators)
			for (let spectator of this.spectators)
				spectator?.send(JSON.stringify(data));
	}

	private async spawnBall(side: string | "P1" | "P2") {
		this.sendData({ type: "GAME", data: this.score, message: "SCORE" });
		this.ball.y = Math.random() * HEIGHT / 2 + HEIGHT / 4;
		this.ball.x = WIDTH / 2;
		this.ball.orientation = Math.random() * Math.PI / 2 - Math.PI / 4;
		// this.ball.y = HEIGHT / 2; // TODO : Remove this line
		// this.ball.orientation = 0; // TODO : Remove this line
		if (side === "P1")
			this.ball.orientation += Math.PI;
		this.ball.speed = BALL_SPEED;
		this.paddle1.y = PADDLE_Y;
		this.paddle2.y = PADDLE_Y;
		if (this.score.player1 < 10 && this.score.player2 < 10)
			await delay(1250);
		this.lastTime = performance.now();
	}

	async gameLoop() {
		return new Promise<void>((resolve) => {

			this.startTime = performance.now();
			this.lastTime = this.startTime;
			const intervalId = setInterval(() => {
				this.sendData({ type: "GAME", data: this.toJSON() }, true);
			}, 1000 / 60); // 60 times per second

			const gameLoopIteration = async () => {
				if (this.score.player1 < 10 && this.score.player2 < 10 && !this.over) {
					await this.MoveBall();
					setTimeout(gameLoopIteration, 0); // Schedule the next iteration
					return
				}
				clearInterval(intervalId);
				this.finishTime = performance.now();
				if (!this.over) // If the game didn't end because of a forfeit
					this.winner = (this.score.player1 >= 10) ? this.players.player1 : this.players.player2;
				this.over = true;
				let winner = this.winner === this.players.player1 ? "P1" : "P2";
				if (this.isSolo)
					winner = this.score.player1 >= 10 ? "P1" : "P2";
				this.sendData({ type: "GAME", data: winner, message: "FINISH" }, true);
				console.log("The winner of the room " + this.id + " is " + winner);
				getRoomById(this.id)?.removeAllSpectators();
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
		}
		if (player === "P2" && this.ball.x + this.ball.size / 2 > paddle.x) {
			this.ball.x = paddle.x - this.ball.size;
			this.hitPaddle(player, paddle);
		}
	}

	private async MoveBall() {
		const now = performance.now();
		const delta = now - this.lastTime;
		this.lastTime = now;
		const speed = this.ball.speed * delta / 1000;

		this.paddleCollision("P1");
		this.paddleCollision("P2");
		if (this.ball.y - this.ball.size < 0 || this.ball.y + this.ball.size >= HEIGHT) {
			this.ball.speed += BALL_ACCELERATION_PER_BOUNCE;
			this.ball.orientation = -this.ball.orientation;
		}

		this.ball.x += speed * Math.cos(this.ball.orientation);
		this.ball.y += speed * Math.sin(this.ball.orientation);

		if (this.ball.y < 0)
			this.ball.y = this.ball.size;
		if (this.ball.y > HEIGHT)
			this.ball.y = HEIGHT - this.ball.size;

		if (this.ball.x - this.ball.size < 0) {
			this.score.player2++;
			await this.spawnBall("P1");
		}
		if (this.ball.x + this.ball.size >= WIDTH) {
			this.score.player1++;
			await this.spawnBall("P2");
		}
	}

	movePaddle(res: requestBody) {
		let paddle = res.P === "P1" ? this.paddle1 : this.paddle2;

		paddle.y += (res.key === "up") ? -PADDLE_SPEED : PADDLE_SPEED;
		if (paddle.y < 0)
			paddle.y = 0;
		if (paddle.y > HEIGHT - paddle.y_size)
			paddle.y = HEIGHT - paddle.y_size;
	}

	forfeit(player: string) {
		this.over = true;
		if (player === "P1")
			this.winner = this.players.player2;
		else
			this.winner = this.players.player1;
	}

	getWinner() : WebSocket | null {
		return this.winner;
	}
}
