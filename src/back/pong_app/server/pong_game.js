"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        this.Ball = { x: Constants.WIDTH / 2, y: Constants.HEIGHT / 2, size: Constants.BALL_SIZE, orientation: 0, speed: Constants.BALL_SPEED };
        this.Over = false;
        this.Winner = null;
        this.StartTime = performance.now();
        this.FinishTime = this.StartTime;
        this.LastTime = this.StartTime;
    }
    Game.prototype.toJSON = function () {
        return {
            Paddle1: this.Paddle1,
            Paddle2: this.Paddle2,
            Ball: this.Ball,
        };
    };
    Game.prototype.SpawnBall = function (side) {
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
    };
    Game.prototype.GameLoop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameLoopIteration, sendGameInfo, updateInterval, intervalId;
            var _this = this;
            return __generator(this, function (_a) {
                gameLoopIteration = function () { return __awaiter(_this, void 0, void 0, function () {
                    var winner;
                    return __generator(this, function (_a) {
                        if (this.Score.player1 < 10 && this.Score.player2 < 10 && !this.Over) {
                            this.MoveBall();
                            setTimeout(gameLoopIteration, 0); // Schedule the next iteration
                            return [2 /*return*/];
                        }
                        clearInterval(intervalId);
                        console.log("Game over");
                        this.FinishTime = performance.now();
                        if (!this.Over) // If the game didn't ended because of a forfeit
                            this.Winner = (this.Score.player1 >= 10) ? this.Players.player1 : this.Players.player2;
                        this.Over = true;
                        winner = this.Winner === this.Players.player1 ? "P1" : "P2";
                        this.Players.player1.send(JSON.stringify({ type: "GAME", data: winner, message: "FINISH" }));
                        this.Players.player2.send(JSON.stringify({ type: "GAME", data: winner, message: "FINISH" }));
                        console.log("The winner of the room " + this.Id + " is " + winner);
                        return [2 /*return*/];
                    });
                }); };
                sendGameInfo = function () {
                    _this.Players.player1.send(JSON.stringify({ type: "GAME", data: _this.toJSON() }));
                    _this.Players.player2.send(JSON.stringify({ type: "GAME", data: _this.toJSON() }));
                };
                updateInterval = 1000 / 60;
                intervalId = setInterval(sendGameInfo, updateInterval);
                this.StartTime = performance.now();
                this.LastTime = this.StartTime;
                gameLoopIteration(); // Start the game loop
                return [2 /*return*/];
            });
        });
    };
    Game.prototype.HitPaddle = function (player, paddle) {
        var ratio = (this.Ball.y - paddle.y) / (paddle.y_size / 2) - 1; // -1 to 1, based on the distance from the center of the paddle
        var angle = 45 * ratio; // -45 to 45 degrees
        if (player === "P2")
            angle = 180 - angle;
        this.Ball.orientation = angle * Math.PI / 180;
        this.Ball.speed *= Constants.BALL_ACCELERATION_PER_BOUNCE_RATIO;
    };
    Game.prototype.PaddleCollision = function (player) {
        var paddle = player === "P1" ? this.Paddle1 : this.Paddle2;
        if (this.Ball.y + this.Ball.size < paddle.y ||
            this.Ball.y - this.Ball.size > paddle.y + paddle.y_size)
            return;
        if (player === "P1" && this.Ball.x - this.Ball.size / 2 < paddle.x + paddle.x_size) {
            this.Ball.x = paddle.x + paddle.x_size + this.Ball.size;
            this.HitPaddle(player, paddle);
        }
        if (player === "P2" && this.Ball.x + this.Ball.size / 2 > paddle.x) {
            this.Ball.x = paddle.x - this.Ball.size;
            this.HitPaddle(player, paddle);
        }
    };
    Game.prototype.MoveBall = function () {
        var now = performance.now();
        var delta = now - this.LastTime;
        this.LastTime = now;
        var speed = this.Ball.speed * delta / 1000;
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
    };
    Game.prototype.MovePaddle = function (res) {
        var paddle = res.P === "P1" ? this.Paddle1 : this.Paddle2;
        paddle.y += (res.key === "ArrowUp") ? -Constants.PADDLE_SPEED : Constants.PADDLE_SPEED;
        if (paddle.y < 0)
            paddle.y = 0;
        if (paddle.y > Constants.HEIGHT - paddle.y_size)
            paddle.y = Constants.HEIGHT - paddle.y_size;
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
