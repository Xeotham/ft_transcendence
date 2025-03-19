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
    function Game(id, player1, player2, isSolo, spectators) {
        if (spectators === void 0) { spectators = []; }
        this.id = id;
        this.players = { player1: player1, player2: player2 };
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
    Game.prototype.toJSON = function () {
        return {
            paddle1: this.paddle1,
            paddle2: this.paddle2,
            ball: this.ball,
        };
    };
    Game.prototype.isOver = function () {
        return this.over;
    };
    Game.prototype.addSpectator = function (spectator) {
        this.spectators.push(spectator);
    };
    Game.prototype.sendData = function (data) {
        this.players.player1.send(JSON.stringify(data));
        if (!this.isSolo)
            this.players.player2.send(JSON.stringify(data));
        for (var _i = 0, _a = this.spectators; _i < _a.length; _i++) {
            var spectator = _a[_i];
            spectator.send(JSON.stringify(data));
        }
    };
    Game.prototype.spawnBall = function (side) {
        this.sendData({ type: "GAME", data: this.score, message: "SCORE" });
        this.ball.y = Math.random() * Constants.HEIGHT / 4 + Constants.HEIGHT * 3 / 8;
        this.ball.x = Constants.WIDTH / 2;
        this.ball.orientation = Math.random() * Math.PI / 2 - Math.PI / 4;
        // this.ball.y = Constants.HEIGHT / 2; // TODO : Remove this line
        // this.ball.orientation = 0; // TODO : Remove this line
        if (side === "P1")
            this.ball.orientation += Math.PI;
        this.ball.speed = Constants.BALL_SPEED;
    };
    Game.prototype.gameLoop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameLoopIteration, updateInterval, intervalId;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gameLoopIteration = function () { return __awaiter(_this, void 0, void 0, function () {
                            var winner;
                            return __generator(this, function (_a) {
                                if (this.score.player1 < 10 && this.score.player2 < 10 && !this.over) {
                                    this.MoveBall();
                                    setTimeout(gameLoopIteration, 0); // Schedule the next iteration
                                    return [2 /*return*/];
                                }
                                console.log("Game over");
                                clearInterval(intervalId);
                                this.finishTime = performance.now();
                                if (!this.over) // If the game didn't ended because of a forfeit
                                    this.winner = (this.score.player1 >= 10) ? this.players.player1 : this.players.player2;
                                this.over = true;
                                winner = this.winner === this.players.player1 ? "P1" : "P2";
                                if (this.isSolo)
                                    winner = this.score.player1 >= 10 ? "P1" : "P2";
                                this.sendData({ type: "GAME", data: winner, message: "FINISH" });
                                console.log("The winner of the room " + this.id + " is " + winner);
                                return [2 /*return*/];
                            });
                        }); };
                        updateInterval = 1000 / 60;
                        intervalId = setInterval(function () {
                            return _this.sendData({ type: "GAME", data: _this.toJSON() });
                        }, updateInterval);
                        this.startTime = performance.now();
                        this.lastTime = this.startTime;
                        return [4 /*yield*/, gameLoopIteration()];
                    case 1:
                        _a.sent(); // Start the game loop
                        console.log("Want to see when that is called");
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.hitPaddle = function (player, paddle) {
        var ratio = (this.ball.y - paddle.y) / (paddle.y_size / 2) - 1; // -1 to 1, based on the distance from the center of the paddle
        var angle = 45 * ratio; // -45 to 45 degrees
        if (player === "P2")
            angle = 180 - angle;
        this.ball.orientation = angle * Math.PI / 180;
        this.ball.speed *= Constants.BALL_ACCELERATION_PER_BOUNCE_RATIO;
    };
    Game.prototype.paddleCollision = function (player) {
        var paddle = player === "P1" ? this.paddle1 : this.paddle2;
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
    };
    Game.prototype.MoveBall = function () {
        var now = performance.now();
        var delta = now - this.lastTime;
        this.lastTime = now;
        var speed = this.ball.speed * delta / 1000;
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
    };
    Game.prototype.movePaddle = function (res) {
        var paddle = res.P === "P1" ? this.paddle1 : this.paddle2;
        paddle.y += (res.key === "up") ? -Constants.PADDLE_SPEED : Constants.PADDLE_SPEED;
        if (paddle.y < 0)
            paddle.y = 0;
        if (paddle.y > Constants.HEIGHT - paddle.y_size)
            paddle.y = Constants.HEIGHT - paddle.y_size;
    };
    Game.prototype.forfeit = function (player) {
        this.over = true;
        if (player === "P1")
            this.winner = this.players.player2;
        else
            this.winner = this.players.player1;
    };
    return Game;
}());
exports.Game = Game;
