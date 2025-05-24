import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts } from "../imTexts/imTexts.ts";
// import { imTexts } from "../imTexts/imTexts.ts";
// import { tetrisGameInformation } from "./tetris.ts";
// import { tetrisSettings } from './tetrisSettingsHTML.ts'
// import { displayMultiplayerRoomHtml, multiplayerRoomHtml } from "./tetrisMultiplayerHTML.ts";
// import { keys, loadTetrisArgs, loadTetrisType, roomInfo } from "./utils.ts";

/*
export const loadTetrisHtml = (page: loadTetrisType, arg: loadTetrisArgs | null = null) => {
	switch (page) {
		case "empty":
			return emptyHtml();
		case "logo":
			return logoHtml();
		case "idle":
			return idleHtml();
		case "board":
			return boardHtml();
		case "multiplayer-room":
			return multiplayerRoomHtml((arg?.rooms!)[0]!.roomCode!);
		case "display-multiplayer-room":
			return displayMultiplayerRoomHtml(arg?.rooms!);
		case "setting":
			return tetrisSettings(arg?.keys!);
	}
}
*/

export const   tetrisEmptyHtml = () => {
	if (!EL.contentTetris)
		return ;
	
	EL.contentTetris.innerHTML = ``;
}

export const tetrisLogoHtml = () => {
	if (!EL.contentTetris)
		return;

	EL.contentTetris.innerHTML = `
		<div id="logoTetris" class="${TCS.tetrisLogo}">Tetris</div>
	`
}

export const tetrisIdleHtml = () => {
	if (!EL.contentTetris)
		return;

	EL.contentTetris.innerHTML = `
	<div class="tetris">
		<nav class="${TCS.tetrisNav0}">
			<div id="tetris" class="${TCS.tetrisTitre} flex-1">${imTexts.tetrisNavTitle}</div>
			<div class="flex-1"><button id="arcade" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavSolo}</button></div>
			<div class="flex-1"><button id="matchmaking" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavVersus}</button></div>
			<div class="flex-1"><button id="get-multiplayer-rooms" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavJoin}</button></div>
			<div class="flex-1"><button id="create-room" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavCreate}</button></div>
			<div class="flex-1"><button id="setting" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavSettings}</button></div>
			<div class="flex-1"><button id="home" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavHome}</button></div>
		</nav>
	</div>`
}

export const tetrisBoardHtml = () => {
	if (!EL.contentTetris) {
		return;
	}

	EL.contentTetris.innerHTML = `
<!--		<p id="score">Score: 0</p>-->
		<p id="awaitingGarbage">Incoming Garbage: 0</p>
		<div id="board">
		<canvas id="tetrisCanvas" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
		</div>`
}


// const multiplayerRoomHtml = (code: string) => {
// 	if (!EL.contentTetris)
// 		return;

// 	EL.contentTetris.innerHTML = `
// 	<h1>Tetris</h1>
// 	<h3>Code ${code}</h3>
// 	<nav>
// 		<button id="idle">Back</button>
// 	`
// 	if (!tetrisGameInformation.getRoomOwner())
// 		return ;
// 	const s = tetrisGameInformation.getSettings();
// 	// console.log("Settings: ", s);
// 	// TODO : Make the non owner able to see but not change the settings (like transparent)
// 	EL.contentTetris.innerHTML += `
// 		<button id="start">Start</button>
// 		<input type="checkbox" id="show-shadow" ${s.showShadowPiece ? "checked" : ""}>Show Shadow</input>
// 		<input type="checkbox" id="show-bags" ${s.showBags ? "checked" : ""}>Show bags</input>
// 		<input type="checkbox" id="hold-allowed" ${s.holdAllowed ? "checked" : ""}>Hold allowed</input>
// 		<input type="checkbox" id="show-hold" ${s.showHold ? "checked" : ""}>Show hold</input>
// 		<input type="checkbox" id="infinite-hold" ${s.infiniteHold ? "checked" : ""}>Infinite hold</input>
// 		<input type="checkbox" id="infinite-movement" ${s.infiniteMovement ? "checked" : ""}>Infinite movement</input>
// 		<input type="number" id="lock-time" value="${s.lockTime !== undefined ? s.lockTime : "500"}">Lock time</input>
// 		<input type="number" id="spawn-ARE" min="0" value="${s.spawnARE !== undefined ? s.spawnARE : "0"}">Spawn ARE</input>
// 		<input type="number" id="soft-drop-amp" min="0" value="${s.softDropAmp !== undefined ? s.softDropAmp : "1.5"}">Soft drop multiplier</input>
// 		<input type="number" id="level" min="1" max="15" value="${s.level ? s.level : "4"}">Starting level</input>
// 		<input type="checkbox" id="is-leveling" ${s.isLevelling ? "checked" : ""}>Is leveling</input>
// 		<button id="save">Save settings</button>
// 	</nav>
// 	`

// }

// const displayMultiplayerRoomHtmlOLD = (rooms: roomInfo[]) => {
// 	if (!EL.contentTetris)
// 		return;

// 	EL.contentTetris.innerHTML = `
// 	<h1>Tetris</h1>
// 	<button id="idle" >Back</button>
// 	<h1>Enter the code of the room or join an open room:</h1>
// 	<form id="codeForm">
// 		<input type="text" id="room-code" placeholder="Room Code">
// 	</form>
// 	<button id="submit">Submit</button>
// 	<button id="refresh">Refresh List</button>
// 	`

// 	if (rooms.length === 0) {
// 		EL.contentTetris.innerHTML += `<p>No rooms available</p>`;
// 		return;
// 	}
// 	let listHTML = `<ul>`;

// 	rooms.forEach((room: roomInfo) => {
// 		listHTML += `
// 		  		<li>
// 					<a href="/tetris/room:${room?.roomCode}">
// 					Room with code: ${room.roomCode}</a>
// 		  		</li>
// 			`;
// 	});
// 	listHTML += '</ul>';
// 	EL.contentTetris.innerHTML += listHTML;
// }