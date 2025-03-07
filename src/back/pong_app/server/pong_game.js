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
        this.Ball = { x: Constants.WIDTH / 2, y: Constants.HEIGHT / 2, size: Constants.BALL_SIZE, orientation: 45 };
        this.Over = false;
        this.Winner = null;
        this.StartTime = performance.now();
        this.LastTime = this.StartTime;
    }
    Game.prototype.toJSON = function () {
        return {
            Score: this.Score,
            Paddle1: this.Paddle1,
            Paddle2: this.Paddle2,
            Ball: this.Ball,
            Over: this.Over,
        };
    };
    Game.prototype.GameLoop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                while (this.Score.player1 < 10 && this.Score.player2 < 10 && !this.Over) {
                    // console.log("Game loop");
                    this.MoveBall();
                    // console.log(this);
                    this.Players.player1.send(JSON.stringify({ type: "GAME", data: this.toJSON() }));
                    this.Players.player2.send(JSON.stringify({ type: "GAME", data: this.toJSON() }));
                    if (performance.now() - this.StartTime > 10000)
                        break;
                }
                console.log("Game over");
                if (!this.Over)
                    this.Winner = (this.Score.player1 >= 10) ? this.Players.player1 : this.Players.player2;
                this.Over = true;
                return [2 /*return*/];
            });
        });
    };
    Game.prototype.MoveBall = function () {
        var now = performance.now();
        var delta = now - this.LastTime;
        this.LastTime = now;
        var speed = Constants.BALL_SPEED * delta / 1000;
        this.Ball.x += speed * Math.cos(this.Ball.orientation);
        this.Ball.y += speed * Math.sin(this.Ball.orientation);
        if (this.Ball.x - (this.Ball.size / 2) < 0 || this.Ball.x + (this.Ball.size / 2) >= Constants.WIDTH)
            this.Ball.orientation = Math.PI - this.Ball.orientation;
        if (this.Ball.y - (this.Ball.size / 2) < 0 || this.Ball.y + (this.Ball.size / 2) >= Constants.HEIGHT)
            this.Ball.orientation = -this.Ball.orientation;
    };
    Game.prototype.MovePaddle = function (res) {
        console.log("Moving paddle");
        if (res.P === "P1")
            this.Paddle1.y += (res.key === "Up") ? -Constants.PADDLE_SPEED : Constants.PADDLE_SPEED;
        if (res.P === "P2")
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
