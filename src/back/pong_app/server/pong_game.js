var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Constants from "./constants";
export class Game {
    constructor(id, player1, player2, isSolo, spectators = []) {
        this.id = id;
        this.players = { player1, player2 };
        this.score = { player1: 0, player2: 0 };
        this.paddle1 = { x: Constants.PADDLE1_X, y: Constants.PADDLE_Y, x_size: Constants.PADDLE_WIDTH, y_size: Constants.PADDLE_HEIGHT };
        this.paddle2 = { x: Constants.PADDLE2_X, y: Constants.PADDLE_Y, x_size: Constants.PADDLE_WIDTH, y_size: Constants.PADDLE_HEIGHT };
        this.ball = { x: Constants.WIDTH / 2, y: Constants.HEIGHT / 2, size: Constants.BALL_SIZE, orientation: 0, speed: Constants.BALL_SPEED };
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
    isOver() {
        return this.over;
    }
    addSpectator(spectator) {
        this.spectators.push(spectator);
    }
    sendData(data, toSpectators = true) {
        this.players.player1.send(JSON.stringify(data));
        if (!this.isSolo)
            this.players.player2.send(JSON.stringify(data));
        if (toSpectators)
            for (let spectator of this.spectators)
                spectator.send(JSON.stringify(data));
    }
    spawnBall(side) {
        this.sendData({ type: "GAME", data: this.score, message: "SCORE" });
        this.ball.y = Math.random() * Constants.HEIGHT / 4 + Constants.HEIGHT * 3 / 8;
        this.ball.x = Constants.WIDTH / 2;
        this.ball.orientation = Math.random() * Math.PI / 2 - Math.PI / 4;
        // this.ball.y = Constants.HEIGHT / 2; // TODO : Remove this line
        // this.ball.orientation = 0; // TODO : Remove this line
        if (side === "P1")
            this.ball.orientation += Math.PI;
        this.ball.speed = Constants.BALL_SPEED;
    }
    gameLoop() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.startTime = performance.now();
                this.lastTime = this.startTime;
                const intervalId = setInterval(() => {
                    this.sendData({ type: "GAME", data: this.toJSON() });
                }, 1000 / 60); // 60 times per second
                const gameLoopIteration = () => __awaiter(this, void 0, void 0, function* () {
                    if (this.score.player1 < 10 && this.score.player2 < 10 && !this.over) {
                        this.MoveBall();
                        setTimeout(gameLoopIteration, 0); // Schedule the next iteration
                        return;
                    }
                    clearInterval(intervalId);
                    this.finishTime = performance.now();
                    if (!this.over) // If the game didn't end because of a forfeit
                        this.winner = (this.score.player1 >= 10) ? this.players.player1 : this.players.player2;
                    this.over = true;
                    let winner = this.winner === this.players.player1 ? "P1" : "P2";
                    if (this.isSolo)
                        winner = this.score.player1 >= 10 ? "P1" : "P2";
                    this.sendData({ type: "GAME", data: winner, message: "FINISH" });
                    console.log("The winner of the room " + this.id + " is " + winner);
                    resolve();
                });
                gameLoopIteration(); // Start the game loop
            });
        });
    }
    hitPaddle(player, paddle) {
        let ratio = (this.ball.y - paddle.y) / (paddle.y_size / 2) - 1; // -1 to 1, based on the distance from the center of the paddle
        let angle = 45 * ratio; // -45 to 45 degrees
        if (player === "P2")
            angle = 180 - angle;
        this.ball.orientation = angle * Math.PI / 180;
        this.ball.speed *= Constants.BALL_ACCELERATION_PER_BOUNCE_RATIO;
    }
    paddleCollision(player) {
        const paddle = player === "P1" ? this.paddle1 : this.paddle2;
        if (this.ball.y + this.ball.size < paddle.y ||
            this.ball.y - this.ball.size > paddle.y + paddle.y_size)
            return;
        if (player === "P1" && this.ball.x - this.ball.size / 2 < paddle.x + paddle.x_size) {
            this.ball.x = paddle.x + paddle.x_size + this.ball.size;
            this.hitPaddle(player, paddle);
        }
        if (player === "P2" && this.ball.x + this.ball.size / 2 > paddle.x) {
            this.ball.x = paddle.x - this.ball.size;
            this.hitPaddle(player, paddle);
        }
    }
    MoveBall() {
        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;
        const speed = this.ball.speed * delta / 1000;
        this.paddleCollision("P1");
        this.paddleCollision("P2");
        if (this.ball.y - this.ball.size < 0 || this.ball.y + this.ball.size >= Constants.HEIGHT) {
            this.ball.speed *= Constants.BALL_ACCELERATION_PER_BOUNCE_RATIO;
            this.ball.orientation = -this.ball.orientation;
        }
        this.ball.x += speed * Math.cos(this.ball.orientation);
        this.ball.y += speed * Math.sin(this.ball.orientation);
        if (this.ball.y < 0)
            this.ball.y = this.ball.size;
        if (this.ball.y > Constants.HEIGHT)
            this.ball.y = Constants.HEIGHT - this.ball.size;
        if (this.ball.x - this.ball.size < 0) {
            this.score.player2++;
            this.spawnBall("P1");
        }
        if (this.ball.x + this.ball.size >= Constants.WIDTH) {
            this.score.player1++;
            this.spawnBall("P2");
        }
    }
    movePaddle(res) {
        let paddle = res.P === "P1" ? this.paddle1 : this.paddle2;
        paddle.y += (res.key === "up") ? -Constants.PADDLE_SPEED : Constants.PADDLE_SPEED;
        if (paddle.y < 0)
            paddle.y = 0;
        if (paddle.y > Constants.HEIGHT - paddle.y_size)
            paddle.y = Constants.HEIGHT - paddle.y_size;
    }
    forfeit(player) {
        this.over = true;
        if (player === "P1")
            this.winner = this.players.player2;
        else
            this.winner = this.players.player1;
    }
}
