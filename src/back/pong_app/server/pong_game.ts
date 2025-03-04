// import { Rooms } from "../../api/pong/controllers";
import * as Constants from "./constants"

export class Game {
	Score:		{ player1: number, player2: number };
	Paddle1:	{ x: number, y: number, x_size: number, y_size: number };
	Paddle2:	{ x: number, y: number, x_size: number, y_size: number };
	Ball:		{ x: number, y: number, size: number, orientation: number };

	constructor() {
		this.Score = { player1: 0, player2: 0 };
		this.Paddle1 = { x: Constants.PADDLE1_X, y: Constants.PADDLE_Y, x_size: Constants.PADDLE_WIDTH, y_size: Constants.PADDLE_HEIGHT };
		this.Paddle2 = { x: Constants.PADDLE2_X, y: Constants.PADDLE_Y, x_size: Constants.PADDLE_WIDTH, y_size: Constants.PADDLE_HEIGHT };
		this.Ball = { x: Constants.WIDTH / 2, y: Constants.HEIGHT / 2, size: Constants.BALL_SIZE, orientation: 0 };
	}
}

