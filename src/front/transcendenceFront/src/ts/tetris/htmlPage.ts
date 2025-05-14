import { keys, loadTetrisArgs, loadTetrisType, roomInfo } from "./utils.ts";
import { content } from "../main.ts";
import {tetrisGameInfo} from "./tetris.ts";

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
			return multiplayerRoomHtml((arg?.rooms!)[0]!.roomCode!);
		case "display-multiplayer-room":
			return displayMultiplayerRoomHtml(arg?.rooms!);
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
<!--			<button id="matchmaking">Matchmaking</button>-->
			<button id="arcade">Arcade Mod</button>
			<button id="create-room">Create room</button>
			<button id="get-multiplayer-rooms">Join a room</button>
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


// const boardHtml = () => {
// 	if (!content) {
// 		return;
// 	}
//
// 	content.innerHTML = `
// 		<h1>Tetris</h1>
// 		<p id="score">Score: 0</p>
// <!--TODO : add theses line-->
// <!--		<p id="time">Time: 00:00.000</p>-->
// 		<p id="PPS">Pieces: 0, 0.00/S</p>
// <!--		<p id="level">Level: 1</p>-->
// <!--		<p id="lines">Lines: 0/10</p>-->
// 		<canvas id="gameCanvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
// 	`
// }

const boardHtml = () => {
	if (!content) {
		return;
	}

	content.innerHTML = `
<!--		<p id="score">Score: 0</p>-->
		<div id="sfx">
		<audio id="sfxplayer"/>
<!--		<audio id="allclear" src="./src/sfx/tetris/Tetrio_retro_pack/allclear.wav" />-->
<!--		<audio id="applause" src="./src/sfx/tetris/Tetrio_retro_pack/applause.wav" />-->
<!--		<audio id="boardappear" src="./src/sfx/tetris/Tetrio_retro_pack/boardappear.wav" />-->
<!--		<audio id="btb_1" src="./src/sfx/tetris/Tetrio_retro_pack/btb_1.wav" />-->
<!--		<audio id="btb_2" src="./src/sfx/tetris/Tetrio_retro_pack/btb_2.wav" />-->
		</div>
		<div id="board">
		<canvas id="tetrisCanvas" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
		</div>`
}

const multiplayerRoomHtml = (code: string) => {
	if (!content)
		return;

	content.innerHTML = `
	<h1>Tetris</h1>
	<h3>Code ${code}</h3>
	<nav>
		<button id="idle">Back</button>
	`
	if (!tetrisGameInfo.getRoomOwner())
		return ;
	// TODO : Make the non owner able to see but not change the settings (like transparent)
	content.innerHTML += `
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

const displayMultiplayerRoomHtml = (rooms: roomInfo[]) => {
	if (!content)
		return;

	content.innerHTML = `
	<h1>Tetris</h1>
	<button id="idle" >Back</button>
	<h1>Enter the code of the room or join an open room:</h1>
	<form id="codeForm">
		<input type="text" id="room-code" placeholder="Room Code">
	</form>
	<button id="submit">Submit</button>
	<button id="refresh">Refresh List</button>
	`

	if (rooms.length === 0) {
		content.innerHTML += `<p>No rooms available</p>`;
		return;
	}
	let listHTML = `<ul>`;

	rooms.forEach((room: roomInfo) => {
		listHTML += `
		  		<li>
					<a href="/tetris/room:${room?.roomCode}">
					Room with code: ${room.roomCode}</a>
		  		</li>
			`;
	});
	listHTML += '</ul>';
	content.innerHTML += listHTML;
}
