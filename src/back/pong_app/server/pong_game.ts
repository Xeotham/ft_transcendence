import { Rooms } from "../../api/pong/controllers";
import * as Constants from "./constants"
import { WebSocket } from "ws";
import { PongRequestBody } from "../../api/pong/controllers";

export class Game {
	Id:			number;
	Players:	{ player1: WebSocket, player2: WebSocket };
	Score:		{ player1: number, player2: number };
	Paddle1:	{ x: number, y: number, x_size: number, y_size: number };
	Paddle2:	{ x: number, y: number, x_size: number, y_size: number };
	Ball:		{ x: number, y: number, size: number, orientation: number, speed: number };
	Over:		boolean;
	Winner:		WebSocket | null;

	private StartTime:	number;
	private FinishTime:	number;
	private LastTime:	number;

	constructor(id: number, player1: WebSocket, player2: WebSocket) {
		this.Id = id;
		this.Players = { player1, player2 };
		this.Score = { player1: 0, player2: 0 };
		this.Paddle1 = { x: Constants.PADDLE1_X, y: Constants.PADDLE_Y, x_size: Constants.PADDLE_WIDTH, y_size: Constants.PADDLE_HEIGHT };
		this.Paddle2 = { x: Constants.PADDLE2_X, y: Constants.PADDLE_Y, x_size: Constants.PADDLE_WIDTH, y_size: Constants.PADDLE_HEIGHT };
		this.Ball = { x: Constants.WIDTH / 2, y: Constants.HEIGHT / 2, size: Constants.BALL_SIZE, orientation: 0, speed: Constants.BALL_SPEED };
		this.Over = false;
		this.Winner = null;

		this.StartTime = performance.now();
		this.FinishTime = this.StartTime;
		this.LastTime = this.StartTime;

	}

	toJSON() {
		return {
			Paddle1: this.Paddle1,
			Paddle2: this.Paddle2,
			Ball: this.Ball,
		};
	}

	SpawnBall(side: string | "P1" | "P2") {
		this.Players.player1.send(JSON.stringify({ type: "GAME", data: this.Score, message: "SCORE" }));
		this.Players.player2.send(JSON.stringify({ type: "GAME", data: this.Score, message: "SCORE" }));
		this.Ball.y = Math.random() * Constants.HEIGHT / 4 + Constants.HEIGHT * 3 / 8;
		this.Ball.x = Constants.WIDTH / 2;
		this.Ball.orientation = Math.random() * Math.PI / 2 - Math.PI / 4;
		// this.Ball.y = Constants.HEIGHT / 2; // TODO : Remove this line
		// this.Ball.orientation = 0; // TODO : Remove this line
		if (side === "P1")
			this.Ball.orientation += Math.PI;
		this.Ball.speed = Constants.BALL_SPEED;
	}

	async GameLoop() {
		const gameLoopIteration = async () => {
			if (this.Score.player1 < 10 && this.Score.player2 < 10 && !this.Over) {
				this.MoveBall();
				setTimeout(gameLoopIteration, 0); // Schedule the next iteration
				return ;
			}
			clearInterval(intervalId);
			console.log("Game over");
			this.FinishTime = performance.now();
			if (!this.Over) // If the game didn't ended because of a forfeit
				this.Winner = (this.Score.player1 >= 10) ? this.Players.player1 : this.Players.player2;
			this.Over = true;
			const winner = this.Winner === this.Players.player1 ? "P1" : "P2";
			this.Players.player1.send(JSON.stringify({ type: "GAME", data: winner, message: "FINISH" }));
			this.Players.player2.send(JSON.stringify({ type: "GAME", data: winner, message: "FINISH" }));
			console.log("The winner of the room " + this.Id + " is " + winner);
			// TODO : Save game in database
		};
		const sendGameInfo = () => {
			this.Players.player1.send(JSON.stringify({ type: "GAME", data: this.toJSON() }));
			this.Players.player2.send(JSON.stringify({ type: "GAME", data: this.toJSON() }));
		};

		const updateInterval = 1000 / 60; // 60 times per second
		const intervalId = setInterval(sendGameInfo, updateInterval);
		this.StartTime = performance.now();
		this.LastTime = this.StartTime;
		gameLoopIteration(); // Start the game loop
	}

	HitPaddle(player: string | "P1" | "P2", paddle: { x: number, y: number, x_size: number, y_size: number }) {
		let ratio = (this.Ball.y - paddle.y) / (paddle.y_size / 2) - 1; // -1 to 1, based on the distance from the center of the paddle
		let angle = 45 * ratio; // -45 to 45 degrees
		if (player === "P2")
			angle = 180 - angle;
		this.Ball.orientation = angle * Math.PI / 180;
		this.Ball.speed *= Constants.BALL_ACCELERATION_PER_BOUNCE_RATIO;
	}

	PaddleCollision(player: string | "P1" | "P2") {
		const paddle = player === "P1" ? this.Paddle1 : this.Paddle2;

		if (this.Ball.y + this.Ball.size < paddle.y ||
			this.Ball.y - this.Ball.size > paddle.y + paddle.y_size)
			return ;
		if (player === "P1" && this.Ball.x - this.Ball.size / 2 < paddle.x + paddle.x_size) {
			this.Ball.x = paddle.x + paddle.x_size + this.Ball.size;
			this.HitPaddle(player, paddle);
		}
		if (player === "P2" && this.Ball.x + this.Ball.size / 2 > paddle.x) {
			this.Ball.x = paddle.x - this.Ball.size;
			this.HitPaddle(player, paddle);
		}
	}

	MoveBall() {
		const now = performance.now();
		const delta = now - this.LastTime;
		this.LastTime = now;
		const speed = this.Ball.speed * delta / 1000;

		this.PaddleCollision("P1");
		this.PaddleCollision("P2");
		if (this.Ball.y - this.Ball.size < 0 || this.Ball.y + this.Ball.size >= Constants.HEIGHT) {
			this.Ball.speed *= Constants.BALL_ACCELERATION_PER_BOUNCE_RATIO;
			this.Ball.orientation = -this.Ball.orientation;
		}

		this.Ball.x += speed * Math.cos(this.Ball.orientation);
		this.Ball.y += speed * Math.sin(this.Ball.orientation);

		if (this.Ball.y < 0)
			this.Ball.y = this.Ball.size;
		if (this.Ball.y > Constants.HEIGHT)
			this.Ball.y = Constants.HEIGHT - this.Ball.size;

		if (this.Ball.x - this.Ball.size < 0) {
			this.Score.player2++;
			this.SpawnBall("P1");
		}
		if (this.Ball.x + this.Ball.size >= Constants.WIDTH) {
			this.Score.player1++;
			this.SpawnBall("P2");
		}
	}

	MovePaddle(res: PongRequestBody) {
		let paddle = res.P === "P1" ? this.Paddle1 : this.Paddle2;

		paddle.y += (res.key === "ArrowUp") ? -Constants.PADDLE_SPEED : Constants.PADDLE_SPEED;
		if (paddle.y < 0)
			paddle.y = 0;
		if (paddle.y > Constants.HEIGHT - paddle.y_size)
			paddle.y = Constants.HEIGHT - paddle.y_size;
	}

	Forfeit(player: string) {
		this.Over = true;
		if (player === "P1")
			this.Winner = this.Players.player2;
		else
			this.Winner = this.Players.player1;
	}
}
