import { keys, loadTetrisArgs, loadTetrisType } from "./utils.ts";
import { content } from "../main.ts";

export const loadTetrisHtml = (page: loadTetrisType, arg: loadTetrisArgs | null = null) => {
	switch (page) {
		case "idle":
			return idleHtml();
		case "setting":
			return settingHtml();
		case "keybindings":
			return keybindsHtml(arg?.keys!);
		case "board":
			return boardHtml();
	}
}

const idleHtml = () => {
	if (!content)
		return;

	content.innerHTML = `
	<div class="tetris">
		<h1>Tetris</h1>
		<nav>
			<button id="home">Home Page</button>
			<button id="matchmaking">Matchmaking</button>
			<button id="arcade">Arcade Mod</button>
			<button id="setting">Settings</button>
		</nav>
	</div>`
}

const settingHtml = () => {
	if (!content)
		return;

	content.innerHTML = `
	<h1>Tetris</h1>
	<nav>
		<button id="idle">Back</button>
		<button id="keybindings">Keybindings</button>
		<button id="music">Music</button>
	</nav>
	`
}

const keybindsHtml = (keys: keys) => {
	if (!content)
		return;

	loadTetrisHtml("setting");

	content.innerHTML += `
		<h2>Keybindings</h2>
		<div>
			<p>Move Piece Left:</p>
			<button id="moveLeft">${keys.getMoveLeft()}</button>
			<p>Move Piece Right:</p>
			<button id="moveRight">${keys.getMoveRight()}</button>
			<p>Rotate Piece Clockwise:</p>
			<button id="rotClock">${keys.getClockwizeRotate()}</button>
			<p>Rotate Piece Counter Clockwize:</p>
			<button id="rotCountClock">${keys.getCountClockwizeRotate()}</button>
			<p>Rotate Piece 180</p>
			<button id="rot180">${keys.getRotate180()}</button>
			<p>Hard Drop Piece:</p>
			<button id="hardDrop">${keys.getHardDrop()}</button>
			<p>Soft Drop Piece:</p>
			<button id="softDrop">${keys.getSoftDrop()}</button>
			<p>Hold Piece:</p>
			<button id="hold">${keys.getHold()}</button>
			<p>Move Piece Left:</p>
			<button id="forfeit">${keys.getForfeit()}</button>
		</div>
	`
}

const boardHtml = () => {
	if (!content) {
		return;
	}

	content.innerHTML = `
<!--		<p id="score">Score: 0</p>-->
		<div id="board">
		<canvas id="tetrisCanvas" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
		</div>`
}

