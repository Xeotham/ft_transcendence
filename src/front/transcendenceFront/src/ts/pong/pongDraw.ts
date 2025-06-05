import {
	Game,
	boardWidth,
	boardHeight, ballSize, pongTextureHandler,
} from "./utils.ts";

// export const pongGameInfo: gameInformation = new gameInformation();

// @ts-ignore
import  page from "page"
import {pongGameInfo} from "./pong.ts";


const   drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number ) => {
	ctx.clearRect(0, 0, width, height);
	const img = pongTextureHandler.getTexture("BACKGROUND");
	if (img) {
		const x = (width - img.width) / 2;
		const y = (height - img.height) / 2;
		ctx.drawImage(img, x, y);
		// TODO: discuss this with matheo
		// ctx.drawImage(img, 0, 0, width, height);
	}
}

const   drawBoard = (ctx: CanvasRenderingContext2D, coord: { x: number, y: number }) => {
	ctx.drawImage(pongTextureHandler.getTexture("BOARD") as HTMLImageElement, coord.x, coord.y - 3, boardWidth, boardHeight + 6);
}

const   drawPaddle = (ctx: CanvasRenderingContext2D, coord: { x: number, y: number }, opponent: boolean) => {
	const   paddleTexture = pongTextureHandler.getTexture(opponent ? "OPPONENT_PADDLE" : "USER_PADDLE") as HTMLImageElement;
	ctx.drawImage(paddleTexture, coord.x, coord.y, paddleTexture.width, paddleTexture.height);
}

const   drawBall = (ctx: CanvasRenderingContext2D, coord: { x: number, y: number }) => {
	ctx.drawImage(pongTextureHandler.getTexture("BALL") as HTMLImageElement, coord.x, coord.y, ballSize * 2, ballSize * 2)
}

const   drawScore = (ctx: CanvasRenderingContext2D, player1: { username: string, score: number }, player2: { username: string, score: number }, canvas: HTMLCanvasElement) => {
	ctx.textAlign = "center";

	const   writeText = (text: string, x: number, y: number) => {
		ctx.font = pongTextureHandler.getFont()!;
		ctx.fillStyle = "black";
		ctx.strokeText(text, x, y);
		ctx.fillStyle = "white";
		ctx.fillText(text, x, y);
	}
	const   player1Coord = { x: (canvas.width / 2) - 200, y: (canvas.height / 2) - (boardHeight / 2) - 30 };
	const   player2Coord = { x: (canvas.width / 2) + 200, y: (canvas.height / 2) - (boardHeight / 2) - 30 };

	if (pongGameInfo.getRoom()?.getPlayer() == "P2") {
		writeText(`${player1.username}: ${player1.score}`, player2Coord.x, player2Coord.y);
		writeText(`${player2.username}: ${player2.score}`, player1Coord.x, player1Coord.y);
	}
	else {
		writeText(`${player1.username}: ${player1.score}`, player1Coord.x, player1Coord.y);
		writeText(`${player2.username}: ${player2.score}`, player2Coord.x, player2Coord.y);
	}
}

export const drawGame =  (game: Game) => {
	const   canvas = document.getElementById("pongCanvas")  as HTMLCanvasElement;
	const   ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;

	const   boardCoord = { x: (canvas.width / 2) - (boardWidth / 2), y: (canvas.height / 2) - (boardHeight / 2) };
	let     paddle1Coord;
	let     paddle2Coord;
	let     ballCoord;

	window.addEventListener('resize', () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	if (game) {
		paddle1Coord = {x: game.paddle1.x + boardCoord.x, y: game.paddle1.y + boardCoord.y};
		paddle2Coord = {x: game.paddle2.x + boardCoord.x, y: game.paddle2.y + boardCoord.y};
		ballCoord = {x: game.ball.x + boardCoord.x - ballSize, y: game.ball.y + boardCoord.y - ballSize};
		if (pongGameInfo.getRoom()?.getPlayer() === "P2") {
			paddle1Coord = { x: canvas.width - paddle1Coord.x - 10, y: paddle1Coord.y };
			paddle2Coord = { x: canvas.width - paddle2Coord.x - 10, y: paddle2Coord.y };
			ballCoord = { x: canvas.width - ballCoord.x - 20, y: ballCoord.y };
		}
	}

	if (!ctx || !game)
		return;

	// Draw background
	drawBackground(ctx, window.innerWidth, window.innerHeight);

	// Draw board
	drawBoard(ctx, boardCoord);

	// Draw score
	if (game.score)
		drawScore(ctx, game.score.player1, game.score.player2, canvas);
	// Draw ball
	drawBall(ctx, ballCoord!);

	// Draw paddles
	drawPaddle(ctx, paddle1Coord!, false); // User paddle
	drawPaddle(ctx, paddle2Coord!, true); // Opponent paddle
}



//
// export const pongTextures: { [key: string]: HTMLImageElement } = {};
//
// export const loadPongTextures = () => {
//
// 	const   texturePaths = {
// 		"BACKGROUND": '/src/medias/textures/pong/background.jpg',
// 		"BOARD": '/src/medias/textures/pong/pongBoard.png',
// 		"PADDLE": '/src/medias/textures/pong/pongPaddle.png',
// 		"BALL": '/src/medias/textures/pong/pongBall.png',
// 	}
//
// 	return Promise.all(
// 		Object.entries(texturePaths).map(([key, path]) => {
// 			return new Promise<void>((resolve, reject) => {
// 				const img = new Image();
// 				// console.log(`Loading texture: ${key} from ${path}`);
// 				img.src = path;
// 				img.onload = () => {
// 					pongTextures[key] = img;
// 					resolve();
// 				};
// 				img.onerror = (err) => {
// 					console.error(`Failed to load texture: ${key} from ${path}`, err);
// 					reject(err)
// 				};
// 				// console.log(tetrisTextures[key]);
// 			});
// 		})
// 	);
// };
