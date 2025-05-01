import { canvasHeight, canvasWidth, keys, loadTetrisArgs, loadTetrisType } from "./utils.ts";
import { content } from "../main.ts";

export const loadTetrisHtml = (page: loadTetrisType, arg: loadTetrisArgs | null = null) => {
	switch (page) {
		case "idle":
			return idleHtml();
		case "setting":
			return settingHtml();
		case "keybindings":
			return keyBindsHtml(arg?.keys!);
		case "board":
			return boardHtml();
		case "multiplayer-room":
			return multiplayerRoomHtml();
	}
}

const idleHtml = () => {
	if (!content)
		return;

	content.innerHTML = `
	<h1>Tetris</h1>
	<nav>
		<button id="home">Home Page</button>
		<button id="matchmaking">Matchmaking</button>
		<button id="arcade">Arcade Mod</button>
		<button id="create-room">Create room</button>
		<button id="join-room">Join room</button>
		<button id="setting">Settings</button>
	</nav>
	`
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

const keyBindsHtml = (keys: keys) => {
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
			<button id="rotClock">${keys.getClockwiseRotate()}</button>
			<p>Rotate Piece CounterClockwise:</p>
			<button id="rotCountClock">${keys.getCounterclockwise()}</button>
			<p>Rotate Piece 180</p>
			<button id="rot180">${keys.getRotate180()}</button>
			<p>Hard Drop Piece:</p>
			<button id="hardDrop">${keys.getHardDrop()}</button>
			<p>Soft Drop Piece:</p>
			<button id="softDrop">${keys.getSoftDrop()}</button>
			<p>Hold Piece:</p>
			<button id="hold">${keys.getHold()}</button>
			<p>Forfeit:</p>
			<button id="forfeit">${keys.getForfeit()}</button>
		</div>
	`
}

const boardHtml = () => {
	if (!content) {
		return;
	}

	content.innerHTML = `
		<h1>Tetris</h1>
		<p id="score">Score: 0</p>
<!--TODO : add theses line-->
<!--		<p id="time">Time: 00:00.000</p>-->
		<p id="PPS">Pieces: 0, 0.00/S</p>
<!--		<p id="level">Level: 1</p>-->
<!--		<p id="lines">Lines: 0/10</p>-->
		<canvas id="gameCanvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
	`
}

const multiplayerRoomHtml = () => {
	if (!content)
		return;

	content.innerHTML = `
	<h1>Tetris</h1>
	<nav>
		<button id="idle">Back</button>
		<button id="start">Start</button>
		<input type="checkbox" id="show-shadow" checked="checked">Show Shadow</input>
		<input type="checkbox" id="show-bags" checked="checked">Show bags</input>
		<input type="checkbox" id="hold-allowed" checked="checked">Hold allowed</input>
		<input type="checkbox" id="show-hold" checked="checked">Show hold</input>
		<input type="checkbox" id="infinite-hold">Infinite hold</input>
		<input type="checkbox" id="infinite-movement">Infinite movement</input>
		<input type="number" id="ARE" value="500">ARE</input>
		<input type="number" id="spawn-ARE" min="0" value="0">Spawn ARE</button>
		<button id="save">Save settings</button>		
	</nav>
	`

}