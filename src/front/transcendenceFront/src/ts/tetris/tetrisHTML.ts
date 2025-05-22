import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts } from "../imTexts/imTexts.ts";
import { tetrisGameInformation } from "./tetris.ts";

import { keys, loadTetrisArgs, loadTetrisType, roomInfo } from "./utils.ts";

export const loadTetrisHtml = (page: loadTetrisType, arg: loadTetrisArgs | null = null) => {
	switch (page) {
		case "empty":
			return emptyHtml();
		case "logo":
			return logoHtml();
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

const   emptyHtml = () => {
	if (!EL.contentTetris)
		return ;
	EL.contentTetris.innerHTML = ``;
}

const logoHtml = () => {
	if (!EL.contentTetris)
		return;
	EL.contentTetris.innerHTML = `
		<div id="logoTetris" class="${TCS.tetrisLogo}">Tetris</div>
	`
}

const idleHtml = () => {
	if (!EL.contentTetris)
		return;

	EL.contentTetris.innerHTML = `
	<div class="tetris">
		<nav class="${TCS.tetrisNav0}">
			<div id="tetris" class="${TCS.tetrisTitre} flex-1">Tetris</div>
			<div class="flex-1"><button id="arcade" class="${TCS.tetrisNavButton}">Play solo mode</button></div>
			<div class="flex-1"><button id="matchmaking" class="${TCS.tetrisNavButton}">Play vs mode</button></div>
			<div class="flex-1"><button id="get-multiplayer-rooms" class="${TCS.tetrisNavButton}">Join a Room</button></div>
			<div class="flex-1"><button id="create-room" class="${TCS.tetrisNavButton}">Create Room</button></div>
			<div class="flex-1"><button id="setting" class="${TCS.tetrisNavButton}">Settings</button></div>
			<div class="flex-1"><button id="home" class="${TCS.tetrisNavButton}">Return Home</button></div>
		</nav>
	</div>`
}

const settingHtml = () => {
	if (!EL.contentTetris)
		return;

	console.log("settingHtml");
	EL.contentTetris.innerHTML = `
	<h1>Tetris</h1>
	<nav>
		<button id="idle">Back</button>
		<button id="keybindings">Keybindings</button>
		<button id="music">Music</button>
	</nav>
	`
}

const keyBindsHtml = (keys: keys) => {
	if (!EL.contentTetris)
		return;

	EL.contentTetris.innerHTML = `
	<div class="${TCS.pongNav1}">
	
		<div id="tetrisSettingsTitle" class="${TCS.tetrisSettingTitle}">
		${imTexts.tetrisSettingsTitle}</div> 
		
		<div class="h-[30px]"></div>

		<div class="grid grid-cols-2 gap-x-[20px] gap-y-[2px]">

<!-- Mino -->
			<div id="minoName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsMinoTitle}</div>
			<div id="minoKey" class="${TCS.tetrisSelect}">
				<select id="minoSelect" class="w-full">
					<option value="1">${imTexts.tetrisSettingsMino1}</option>
					<option value="2">${imTexts.tetrisSettingsMino2}</option>
					<option value="3">${imTexts.tetrisSettingsMino3}</option>
					<option value="4">${imTexts.tetrisSettingsMino4}</option>
					<option value="5">${imTexts.tetrisSettingsMino5}</option>
					<option value="6">${imTexts.tetrisSettingsMino6}</option>
				</select>
			</div>
			<div class="col-span-2 h-[20px]"></div>

<!-- Background -->
			<div id="bkgName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsBkgTitle}</div>
			<div id="bkgKey" class="${TCS.tetrisSelect}">
				<select id="bkgSelect" class="w-full">
					<option value="1">${imTexts.tetrisSettingsBkg1}</option>
					<option value="2">${imTexts.tetrisSettingsBkg2}</option>
					<option value="3">${imTexts.tetrisSettingsBkg3}</option>
					<option value="4">${imTexts.tetrisSettingsBkg4}</option>
					<option value="5">${imTexts.tetrisSettingsBkg5}</option>
					<option value="6">${imTexts.tetrisSettingsBkg6}</option>
				</select>
			</div>
			<div class="col-span-2 h-[20px]"></div>

<!-- Music -->
			<div id="musicName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsMusicTitle}</div>
			<div id="musicKey" class="${TCS.tetrisSelect}">
				<select id="musicSelect" class="w-full">
					<option value="1">${imTexts.tetrisSettingsMusic1}</option>
					<option value="2">${imTexts.tetrisSettingsMusic2}</option>
					<option value="3">${imTexts.tetrisSettingsMusic3}</option>
					<option value="4">${imTexts.tetrisSettingsMusic4}</option>
					<option value="5">${imTexts.tetrisSettingsMusic5}</option>
					<option value="6">${imTexts.tetrisSettingsMusic6}</option>
				</select>
			</div>
			<div class="col-span-2 h-[20px]"></div>

<!-- Avatar -->
			<div id="avatarName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsAvatarTitle}</div>
			<div id="avatarKey" class="${TCS.tetrisSelect}">
				<select id="avatarSelect" class="w-full">
					<option value="1">${imTexts.tetrisSettingsAvatar1}</option>
					<option value="2">${imTexts.tetrisSettingsAvatar2}</option>
					<option value="3">${imTexts.tetrisSettingsAvatar3}</option>
					<option value="4">${imTexts.tetrisSettingsAvatar4}</option>
					<option value="5">${imTexts.tetrisSettingsAvatar5}</option>
					<option value="6">${imTexts.tetrisSettingsAvatar6}</option>
				</select>
			</div>
			<div class="col-span-2 h-[20px]"></div>

<!-- Keybindings -->
			<div id="moveLeftName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsKeyMoveLeft}</div>
			<div id="moveLeftKey" class="${TCS.tetrisKeybindingsKey}">${keys.getMoveLeft()}</div>
			
			<div id="moveRightName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsKeyMoveRight}</div>
			<div id="moveRightKey" class="${TCS.tetrisKeybindingsKey}">${keys.getMoveRight()}</div>
			
			<div id="rotClockName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsKeyRotateClockwise}</div>
			<div id="rotClockKey" class="${TCS.tetrisKeybindingsKey}">${keys.getClockwiseRotate()}</div>
			
			<div id="rotCountClockName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsKeyRotateCounterclockwise}</div>
			<div id="rotCountClockKey" class="${TCS.tetrisKeybindingsKey}">${keys.getCounterclockwise()}</div>
			
			<div id="rot180Name" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsKeyRotate180}</div>
			<div id="rot180Key" class="${TCS.tetrisKeybindingsKey}">${keys.getRotate180()}</div>
			
			<div id="hardDropName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsKeyHardDrop}</div>
			<div id="hardDropKey" class="${TCS.tetrisKeybindingsKey}">${keys.getHardDrop()}</div>
			
			<div id="softDropName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsKeySoftDrop}</div>
			<div id="softDropKey" class="${TCS.tetrisKeybindingsKey}">${keys.getSoftDrop()}</div>
			
			<div id="holdName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsKeyHold}</div>
			<div id="holdKey" class="${TCS.tetrisKeybindingsKey}">${keys.getHold()}</div>
			
			<div id="forfeitName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsKeyForfeit}</div>
			<div id="forfeitKey" class="${TCS.tetrisKeybindingsKey}">${keys.getForfeit()}</div>

			<div class="col-span-2 h-[30px]"></div>

			<div class="col-span-2"><button id="back" class="${TCS.form}${TCS.formButton}">Back</button></div>

		</div>

		<div class="h-[10px]"></div>

	</div>`;
}

const keyBindsHtmlOLD = (keys: keys) => {
	if (!EL.contentTetris)
		return;

	loadTetrisHtml("setting");

	EL.contentTetris.innerHTML += `
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

const multiplayerRoomHtml = (code: string) => {
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

const displayMultiplayerRoomHtml = (rooms: roomInfo[]) => {
	if (!EL.contentTetris)
		return;

	EL.contentTetris.innerHTML = `
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
}
