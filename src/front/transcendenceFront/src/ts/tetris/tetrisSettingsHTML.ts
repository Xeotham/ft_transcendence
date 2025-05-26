import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts, imTextsJson } from "../imTexts/imTexts.ts";
import { keys } from "./utils.ts";
import { changeKeys } from "./tetris.ts";
// @ts-ignore
import  page from 'page';

export const tetrisSettings = (keys: keys) => {
	tetrisSettingsHtml(keys);
	tetrisSettingsEvents();
}

const tetrisSettingsHtml = (keys: keys) => {
	if (!EL.contentTetris)
		return;

	EL.contentTetris.innerHTML = `
	<div class="${TCS.tetrisWindowBkg}">
	
		<div id="tetrisSettingsTitle" class="${TCS.tetrisSettingTitle}">
		${imTexts.tetrisSettingsTitle}</div> 
		
		<div class="h-[30px]"></div>

		<div class="grid grid-cols-2 gap-x-[20px] gap-y-[2px]">

<!-- Mino -->
			<div id="minoName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsMinoTitle}</div>
			<div id="minoKey" class="${TCS.tetrisSelect}">
				<select id="minoSelect" class="w-full">
					<option value="1">${imTextsJson.fr.tetris.settings.mino.name[0]}</option>
					<option value="2">${imTextsJson.fr.tetris.settings.mino.name[1]}</option>
					<option value="3">${imTextsJson.fr.tetris.settings.mino.name[2]}</option>
					<option value="4">${imTextsJson.fr.tetris.settings.mino.name[3]}</option>
					<option value="5">${imTextsJson.fr.tetris.settings.mino.name[4]}</option>
					<option value="6">${imTextsJson.fr.tetris.settings.mino.name[5]}</option>
					<option value="7">${imTextsJson.fr.tetris.settings.mino.name[6]}</option>
					<option value="8">${imTextsJson.fr.tetris.settings.mino.name[7]}</option>
				</select>
			</div>
			<div class="col-span-2 h-[20px]"></div>

<!-- Background -->
			<div id="bkgName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsBkgTitle}</div>
			<div id="bkgKey" class="${TCS.tetrisSelect}">
				<select id="bkgSelect" class="w-full">
					<option value="1">${imTextsJson.fr.tetris.settings.bkg.name[0]}</option>
					<option value="2">${imTextsJson.fr.tetris.settings.bkg.name[1]}</option>
					<option value="3">${imTextsJson.fr.tetris.settings.bkg.name[2]}</option>
					<option value="4">${imTextsJson.fr.tetris.settings.bkg.name[3]}</option>
					<option value="5">${imTextsJson.fr.tetris.settings.bkg.name[4]}</option>
					<option value="6">${imTextsJson.fr.tetris.settings.bkg.name[5]}</option>
				</select>
			</div>
			<div class="col-span-2 h-[20px]"></div>

<!-- Music -->
			<div id="musicName" class="${TCS.tetrisKeybindingsName}">${imTexts.tetrisSettingsMusicTitle}</div>
			<div id="musicKey" class="${TCS.tetrisSelect}">
				<select id="musicSelect" class="w-full">
					<option value="1">${imTextsJson.fr.tetris.settings.music.name[0]}</option>
					<option value="2">${imTextsJson.fr.tetris.settings.music.name[1]}</option>
					<option value="3">${imTextsJson.fr.tetris.settings.music.name[2]}</option>
					<option value="4">${imTextsJson.fr.tetris.settings.music.name[3]}</option>
					<option value="5">${imTextsJson.fr.tetris.settings.music.name[4]}</option>
					<option value="6">${imTextsJson.fr.tetris.settings.music.name[5]}</option>
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

			<div class="col-span-2"><button id="tetrisSettingsBack" class="${TCS.form}${TCS.formButton}">${imTexts.tetrisSettingsBack}</button></div>

		</div>

		<div class="h-[10px]"></div>

	</div>`;
}

const tetrisSettingsEvents = () => {

	// document.getElementById("idle")?.addEventListener("click", () => loadTetrisPage("idle"));
	// document.getElementById("keybindings")?.addEventListener("click", () => loadTetrisPage("keybindings", { keys: userKeys }));

	const moveLeft = document.getElementById("moveLeftKey") as HTMLButtonElement;
	const moveRight = document.getElementById("moveRightKey") as HTMLButtonElement;
	const rotClock = document.getElementById("rotClockKey") as HTMLButtonElement;
	const rotCountClock = document.getElementById("rotCountClockKey") as HTMLButtonElement;
	const rot180 = document.getElementById("rot180Key") as HTMLButtonElement;
	const hardDrop = document.getElementById("hardDropKey") as HTMLButtonElement;
	const softDrop = document.getElementById("softDropKey") as HTMLButtonElement;
	const hold = document.getElementById("holdKey") as HTMLButtonElement;
	const forfeit = document.getElementById("forfeitKey") as HTMLButtonElement;

	if (!moveLeft || !moveRight || !rotClock || !rotCountClock || !rot180 || !hardDrop || !softDrop || !hold || !forfeit)
		return;

	moveLeft.addEventListener("click", () => changeKeys("moveLeft"));
	moveRight.addEventListener("click", () => changeKeys("moveRight"));
	rotClock.addEventListener("click", () => changeKeys("rotClock"));
	rotCountClock.addEventListener("click", () => changeKeys("rotCountClock"));
	rot180.addEventListener("click", () => changeKeys("rot180"));
	hardDrop.addEventListener("click", () => changeKeys("hardDrop"));
	softDrop.addEventListener("click", () => changeKeys("softDrop"));
	hold.addEventListener("click", () => changeKeys("hold"));
	forfeit.addEventListener("click", () => changeKeys("forfeit"));

	const tetrisSettingsBack = document.getElementById("tetrisSettingsBack") as HTMLButtonElement;

	if (!tetrisSettingsBack)
		return;

	tetrisSettingsBack.addEventListener("click", () => {
		page("/tetris");
	});
}

// const keyBindsHtmlOLD = (keys: keys) => {
// 	if (!EL.contentTetris)
// 		return;

// 	loadTetrisHtml("setting");

// 	EL.contentTetris.innerHTML += `
// 		<h2>Keybindings</h2>
// 		<div>
// 			<p>Move Piece Left:</p>
// 			<button id="moveLeft">${keys.getMoveLeft()}</button>
// 			<p>Move Piece Right:</p>
// 			<button id="moveRight">${keys.getMoveRight()}</button>
// 			<p>Rotate Piece Clockwise:</p>
// 			<button id="rotClock">${keys.getClockwiseRotate()}</button>
// 			<p>Rotate Piece CounterClockwise:</p>
// 			<button id="rotCountClock">${keys.getCounterclockwise()}</button>
// 			<p>Rotate Piece 180</p>
// 			<button id="rot180">${keys.getRotate180()}</button>
// 			<p>Hard Drop Piece:</p>
// 			<button id="hardDrop">${keys.getHardDrop()}</button>
// 			<p>Soft Drop Piece:</p>
// 			<button id="softDrop">${keys.getSoftDrop()}</button>
// 			<p>Hold Piece:</p>
// 			<button id="hold">${keys.getHold()}</button>
// 			<p>Forfeit:</p>
// 			<button id="forfeit">${keys.getForfeit()}</button>
// 		</div>
// 	`
// }
