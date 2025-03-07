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
	Ball:		{ x: number, y: number, size: number, orientation: number };
	Over:		boolean;
	Winner:		WebSocket | null;

	private readonly StartTime:	number;
	private LastTime:	number;

	constructor(id: number, player1: WebSocket, player2: WebSocket) {
		this.Id = id;
		this.Players = { player1, player2 };
		this.Score = { player1: 0, player2: 0 };
		this.Paddle1 = { x: Constants.PADDLE1_X, y: Constants.PADDLE_Y, x_size: Constants.PADDLE_WIDTH, y_size: Constants.PADDLE_HEIGHT };
		this.Paddle2 = { x: Constants.PADDLE2_X, y: Constants.PADDLE_Y, x_size: Constants.PADDLE_WIDTH, y_size: Constants.PADDLE_HEIGHT };
		this.Ball = { x: Constants.WIDTH / 2, y: Constants.HEIGHT / 2, size: Constants.BALL_SIZE, orientation: 45 };
		this.Over = false;
		this.Winner = null;

		this.StartTime = performance.now();
		this.LastTime = this.StartTime;

	}

	toJSON() {
		return {
			Score: this.Score,
			Paddle1: this.Paddle1,
			Paddle2: this.Paddle2,
			Ball: this.Ball,
			Over: this.Over,
		};
	}

	async GameLoop() {
		while (this.Score.player1 < 10 && this.Score.player2 < 10 && !this.Over) {
			// console.log("Game loop");
			this.MoveBall();
			// console.log(this);

			this.Players.player1.send(JSON.stringify({type: "GAME", data: this.toJSON()}));
			this.Players.player2.send(JSON.stringify({type: "GAME", data: this.toJSON()}));
			if (performance.now() - this.StartTime > 10000)
				break;
		}
		console.log("Game over");
		if (!this.Over)
			this.Winner = (this.Score.player1 >= 10) ? this.Players.player1 : this.Players.player2;
		this.Over = true;
	}

	MoveBall() {
		const now = performance.now();
		const delta = now - this.LastTime;
		this.LastTime = now;
		const speed = Constants.BALL_SPEED * delta / 1000;

		this.Ball.x += speed * Math.cos(this.Ball.orientation);
		this.Ball.y += speed * Math.sin(this.Ball.orientation);
		if (this.Ball.x - (this.Ball.size / 2) < 0 || this.Ball.x + (this.Ball.size / 2) >= Constants.WIDTH)
			this.Ball.orientation = Math.PI - this.Ball.orientation;
		if (this.Ball.y - (this.Ball.size / 2) < 0 || this.Ball.y + (this.Ball.size / 2) >= Constants.HEIGHT)
			this.Ball.orientation = -this.Ball.orientation;
	}

	MovePaddle(res: PongRequestBody) {
		console.log("Moving paddle");

		if (res.P === "P1")
			this.Paddle1.y += (res.key === "Up") ? -Constants.PADDLE_SPEED : Constants.PADDLE_SPEED;
		if (res.P === "P2")
			this.Paddle2.y += (res.key === "Up") ? -Constants.PADDLE_SPEED : Constants.PADDLE_SPEED;
		this.Players.player1.send(JSON.stringify({type: "GAME", data: this}));
		this.Players.player2.send(JSON.stringify({type: "GAME", data: this}));
	}

	Forfeit(player: string) {
		this.Over = true;
		if (player === "P1")
			this.Winner = this.Players.player2;
		else
			this.Winner = this.Players.player1;
	}
}
