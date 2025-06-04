import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts, imTextsJson } from "../imTexts/imTexts.ts";
import { changeKeys } from "./tetris.ts";
// @ts-ignore
import  page from 'page';
import {userKeys, keys} from "../utils.ts";

export const tetrisSettings = async () => {
	await tetrisSettingsHtml();
	tetrisSettingsEvents();
}

const tetrisSettingsHtml = async () => {
	if (!EL.contentTetris)
		return;

	const   newKeys = userKeys || await (new keys()).build();

	let html = `
	<div class="${TCS.tetrisWindowBkg}">
	
		<div id="tetrisSettingsTitle" class="${TCS.gameTitle}">
		${imTexts.tetrisSettingsTitle}</div> 

		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="tetrisSettingsBack" class="${TCS.modaleTexteLink}">
		${imTexts.tetrisSettingsBack}</a></div>	

		<div class="h-[30px]"></div>

		<div class="grid grid-cols-2 gap-x-[20px] gap-y-[2px]">

<!-- Mino -->
			<div id="minoName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsMinoTitle}</div>
			<div id="minoKey" class="${TCS.gameSelect}">
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
			<div id="bkgName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsBkgTitle}</div>
			<div id="bkgKey" class="${TCS.gameSelect}">
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
			<div id="musicName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsMusicTitle}</div>
			<div id="musicKey" class="${TCS.gameSelect}">
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
			<div id="moveLeftName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyMoveLeft}</div>
			<div id="moveLeftKey" class="${TCS.gameBlockLink}">${newKeys?.getMoveLeft()}</div>
			
			<div id="moveRightName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyMoveRight}</div>
			<div id="moveRightKey" class="${TCS.gameBlockLink}">${newKeys?.getMoveRight()}</div>
			
			<div id="rotClockName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyRotateClockwise}</div>
			<div id="rotClockKey" class="${TCS.gameBlockLink}">${newKeys?.getClockwiseRotate()}</div>
			
			<div id="rotCountClockName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyRotateCounterclockwise}</div>
			<div id="rotCountClockKey" class="${TCS.gameBlockLink}">${newKeys?.getCounterclockwise()}</div>
			
			<div id="rot180Name" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyRotate180}</div>
			<div id="rot180Key" class="${TCS.gameBlockLink}">${newKeys?.getRotate180()}</div>
			
			<div id="hardDropName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyHardDrop}</div>
			<div id="hardDropKey" class="${TCS.gameBlockLink}">${newKeys?.getHardDrop()}</div>
			
			<div id="softDropName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeySoftDrop}</div>
			<div id="softDropKey" class="${TCS.gameBlockLink}">${newKeys?.getSoftDrop()}</div>
			
			<div id="holdName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyHold}</div>
			<div id="holdKey" class="${TCS.gameBlockLink}">${newKeys?.getHold()}</div>
			
			<div id="forfeitName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyForfeit}</div>
			<div id="forfeitKey" class="${TCS.gameBlockLink}">${newKeys?.getForfeit()}</div>

			<div class="col-span-2 h-[10px]"></div>

			<div></div>
			<div id="tetrisSettingsValidate" class="${TCS.gameBlockLink} h-[40px] flex items-end">
			${imTexts.tetrisSettingsValidate}</div>

		</div>

		<div class="h-[10px]"></div>

	</div>`;
	 
	html = html.replace(/"> <\/div>/g, '">space</div>'); // affichage de space

	EL.contentTetris.innerHTML = html;
}

const tetrisSettingsEvents = () => {
	const elements = {
		moveLeft: document.getElementById("moveLeftKey"),
		moveRight: document.getElementById("moveRightKey"),
		rotClock: document.getElementById("rotClockKey"),
		rotCountClock: document.getElementById("rotCountClockKey"),
		rot180: document.getElementById("rot180Key"),
		hardDrop: document.getElementById("hardDropKey"),
		softDrop: document.getElementById("softDropKey"),
		hold: document.getElementById("holdKey"),
		forfeit: document.getElementById("forfeitKey")
	};

	// Vérifier si tous les éléments existent
	if (Object.values(elements).some(el => !el)) {
		console.error("tetrisSettingsEvents: certains éléments n'ont pas été trouvés");
		Object.entries(elements).forEach(([key, value]) => {
			if (!value) {
				console.error(`Element not found: ${key}`);
			}
		});
		page("/tetris");
		return;
	}

	// left                VARCHAR(50) DEFAULT 'a',
	// 	right               VARCHAR(50) DEFAULT 'd',
	// 	clockwiseRot		VARCHAR(50) DEFAULT 'ArrowRight',
	// 	countClockwiseRot	VARCHAR(50) DEFAULT 'ArrowLeft',
	// 	hardDrop			VARCHAR(50) DEFAULT 'ArrowUp',
	// 	softDrop			VARCHAR(50) DEFAULT 'ArrowDown',
	// 	hold                VARCHAR(50) DEFAULT 'Shift',
	// 	forfeit             VARCHAR(50) DEFAULT 'Escape',

	// Ajouter les event listeners
	elements.moveLeft?.addEventListener("click", () => {
		console.log("KEY moveLeft /////////////////////////////");
		changeKeys("moveLeft")
	});
	elements.moveRight?.addEventListener("click", () => changeKeys("moveRight"));
	elements.rotClock?.addEventListener("click", () => changeKeys("rotateClockwise"));
	elements.rotCountClock?.addEventListener("click", () => changeKeys("rotateCounterClockwise"));
	elements.rot180?.addEventListener("click", () => changeKeys("rotate180"));
	elements.hardDrop?.addEventListener("click", () => changeKeys("hardDrop"));
	elements.softDrop?.addEventListener("click", () => changeKeys("softDrop"));
	elements.hold?.addEventListener("click", () => changeKeys("hold"));
	elements.forfeit?.addEventListener("click", () => changeKeys("forfeit"));

	document.getElementById("tetrisSettingsBack")?.addEventListener("click", () => {
		page("/tetris");
	});

	document.getElementById("tetrisSettingsValidate")?.addEventListener("click", () => {
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
