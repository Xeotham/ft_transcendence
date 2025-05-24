import { address } from "../immanence.ts";
import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts } from "../imTexts/imTexts.ts";
import { tetrisGameInformation, loadTetrisPage } from "./tetris.ts";
import { joinRoom, getMultiplayerRooms, startRoom } from "./gameManagement.ts";
import { roomInfo } from "./utils.ts";
import { resetGamesSocket, postToApi } from "../utils.ts";

////////////////////////////////////////////////////////
// JOIN ROOM === displayMultiplayerRoomHtml
////////////////////////////////////////////////////////

export const tetrisDisplayMultiplayerRoom = (rooms: roomInfo[]) => {
	tetrisDisplayMultiplayerRoomHtml(rooms);
	tetrisDisplayMultiplayerRoomEvents();
}

const tetrisDisplayMultiplayerRoomHtml = (rooms: roomInfo[]) => {
	if (!EL.contentTetris)
		return;

	EL.contentTetris.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="${TCS.tetrisTitre}">TEST</div>
		<div class="${TCS.tetrisTitre}">ARG</div>

		<button id="idle" >Back</button>
		<h1>Enter the code of the room or join an open room:</h1>
		<form id="codeForm">
			<input type="text" id="room-code" placeholder="Room Code">
		</form>
		<button id="submit">Submit</button>
		<button id="refresh">Refresh List</button>
	`

	if (rooms.length === 0) {
		EL.contentTetris.innerHTML += `<p>No rooms available</p>`;
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
	EL.contentTetris.innerHTML += listHTML;

	EL.contentTetris.innerHTML += `</div>`;
}

const tetrisDisplayMultiplayerRoomEvents = () => {
	document.getElementById("idle")?.addEventListener("click", () => { resetGamesSocket("home"); loadTetrisPage("idle") });
	document.getElementById("submit")?.addEventListener("click", () =>
		joinRoom((document.getElementById("room-code") as HTMLInputElement).value));
	document.getElementById("refresh")?.addEventListener("click", () => getMultiplayerRooms());
}

////////////////////////////////////////////////////////
// CREATE ROOM === multiplayerRoomHtml
////////////////////////////////////////////////////////	

export const tetrisMultiplayerRoom = (code: string) => {
	tetrisMultiplayerRoomHtml(code);
	tetrisMultiplayerRoomEvents();
}

const tetrisMultiplayerRoomHtml = (code: string) => {
	if (!EL.contentTetris)
		return;

	EL.contentTetris.innerHTML = `
	<h1>Tetris</h1>
	<h3>Code ${code}</h3>
	<nav>
		<button id="idle">Back</button>
	`
	if (!tetrisGameInformation.getRoomOwner())
		return ;
	const s = tetrisGameInformation.getSettings();
	// console.log("Settings: ", s);
	// TODO : Make the non owner able to see but not change the settings (like transparent)
	EL.contentTetris.innerHTML += `
		<button id="start">Start</button>
		<input type="checkbox" id="show-shadow" ${s.showShadowPiece ? "checked" : ""}>Show Shadow</input>
		<input type="checkbox" id="show-bags" ${s.showBags ? "checked" : ""}>Show bags</input>
		<input type="checkbox" id="hold-allowed" ${s.holdAllowed ? "checked" : ""}>Hold allowed</input>
		<input type="checkbox" id="show-hold" ${s.showHold ? "checked" : ""}>Show hold</input>
		<input type="checkbox" id="infinite-hold" ${s.infiniteHold ? "checked" : ""}>Infinite hold</input>
		<input type="checkbox" id="infinite-movement" ${s.infiniteMovement ? "checked" : ""}>Infinite movement</input>
		<input type="number" id="lock-time" value="${s.lockTime !== undefined ? s.lockTime : "500"}">Lock time</input>
		<input type="number" id="spawn-ARE" min="0" value="${s.spawnARE !== undefined ? s.spawnARE : "0"}">Spawn ARE</input>
		<input type="number" id="soft-drop-amp" min="0" value="${s.softDropAmp !== undefined ? s.softDropAmp : "1.5"}">Soft drop multiplier</input>
		<input type="number" id="level" min="1" max="15" value="${s.level ? s.level : "4"}">Starting level</input>
		<input type="checkbox" id="is-leveling" ${s.isLevelling ? "checked" : ""}>Is leveling</input>
		<button id="save">Save settings</button>
	</nav>
	`
}

const tetrisMultiplayerRoomEvents = () => {

	document.getElementById("idle")?.addEventListener("click", () => { resetGamesSocket("home"); loadTetrisPage("idle") });
	if (!tetrisGameInformation.getRoomOwner())
		return ;
	document.getElementById("start")?.addEventListener("click", () => startRoom());
	document.getElementById("show-shadow")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));
	document.getElementById("show-bags")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));
	document.getElementById("hold-allowed")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));
	document.getElementById("infinite-hold")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));
	document.getElementById("infinite-movement")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));
	document.getElementById("lock-time")?.addEventListener("change", () => tetrisGameInformation.setNeedSave(true));
	document.getElementById("spawn-ARE")?.addEventListener("change", () => tetrisGameInformation.setNeedSave(true));
	document.getElementById("soft-drop-amp")?.addEventListener("change", () => tetrisGameInformation.setNeedSave(true));
	document.getElementById("level")?.addEventListener("change", () => tetrisGameInformation.setNeedSave(true));
	document.getElementById("is-leveling")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));

	document.getElementById("save")?.addEventListener("click", () => {
		tetrisGameInformation.setSettings({
			"showShadowPiece": (document.getElementById("show-shadow") as HTMLInputElement)?.checked,
			"showBags": (document.getElementById("show-bags") as HTMLInputElement)?.checked,
			"holdAllowed": (document.getElementById("hold-allowed") as HTMLInputElement)?.checked,
			"showHold": (document.getElementById("show-hold") as HTMLInputElement)?.checked,
			"infiniteHold": (document.getElementById("infinite-hold") as HTMLInputElement)?.checked,
			"infiniteMovement": (document.getElementById("infinite-movement") as HTMLInputElement)?.checked,
			"lockTime": parseInt((document.getElementById("lock-time") as HTMLInputElement).value),
			"spawnARE": parseInt((document.getElementById("spawn-ARE") as HTMLInputElement).value),
			"softDropAmp": parseInt((document.getElementById("soft-drop-amp") as HTMLInputElement).value),
			"level": parseInt((document.getElementById("level") as HTMLInputElement).value),
			"isLevelling": (document.getElementById("is-leveling") as HTMLInputElement)?.checked,
		});
		tetrisGameInformation.setNeedSave(false);
		postToApi(`http://${address}/api/tetris/roomCommand`, { argument: "settings", gameId: 0, roomCode: tetrisGameInformation.getRoomCode(), prefix: tetrisGameInformation.getSettings() })});
	
}

// export const multiplayerRoomHtmlOLD = (code: string) => {
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