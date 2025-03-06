"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var Constants = require("./constants");
var Game = /** @class */ (function () {
    function Game(id, player1, player2) {
        this.Id = id;
        this.Players = { player1: player1, player2: player2 };
        this.Score = { player1: 0, player2: 0 };
        this.Paddle1 = { x: Constants.PADDLE1_X, y: Constants.PADDLE_Y, x_size: Constants.PADDLE_WIDTH, y_size: Constants.PADDLE_HEIGHT };
        this.Paddle2 = { x: Constants.PADDLE2_X, y: Constants.PADDLE_Y, x_size: Constants.PADDLE_WIDTH, y_size: Constants.PADDLE_HEIGHT };
        this.Ball = { x: Constants.WIDTH / 2, y: Constants.HEIGHT / 2, size: Constants.BALL_SIZE, orientation: 0 };
        this.Over = false;
        this.Winner = null;
    }
    Game.prototype.GameLoop = function () {
        while ((this.Score.player1 < 10 && this.Score.player2 < 10) || this.Over) {
            this.MoveBall();
            this.Players.player1.send(JSON.stringify({ type: "GAME", data: this }));
            this.Players.player2.send(JSON.stringify({ type: "GAME", data: this }));
        }
        if (!this.Over) {
            this.Winner = (this.Score.player1 === 10) ? this.Players.player1 : this.Players.player2;
            this.Over = true;
        }
    };
    Game.prototype.MoveBall = function () {
        this.Ball.x += Constants.BALL_SPEED * Math.cos(this.Ball.orientation);
        this.Ball.y += Constants.BALL_SPEED * Math.sin(this.Ball.orientation);
        if (this.Ball.x - (this.Ball.size / 2) < 0 || this.Ball.x + (this.Ball.size / 2) >= Constants.WIDTH)
            this.Ball.orientation = Math.PI - this.Ball.orientation;
        if (this.Ball.y - (this.Ball.size / 2) < 0 || this.Ball.y + (this.Ball.size / 2) >= Constants.HEIGHT)
            this.Ball.orientation = -this.Ball.orientation;
    };
    Game.prototype.MovePaddle = function (res) {
        console.log("Moving paddle");
        if (res.side === "left")
            this.Paddle1.y += (res.key === "Up") ? -Constants.PADDLE_SPEED : Constants.PADDLE_SPEED;
        if (res.side === "right")
            this.Paddle2.y += (res.key === "Up") ? -Constants.PADDLE_SPEED : Constants.PADDLE_SPEED;
        this.Players.player1.send(JSON.stringify({ type: "GAME", data: this }));
        this.Players.player2.send(JSON.stringify({ type: "GAME", data: this }));
    };
    Game.prototype.Forfeit = function (player) {
        this.Over = true;
        if (player === "P1")
            this.Winner = this.Players.player2;
        else
            this.Winner = this.Players.player1;
    };
    return Game;
}());
exports.Game = Game;
