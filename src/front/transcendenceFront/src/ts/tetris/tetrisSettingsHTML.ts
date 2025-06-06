import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts, imTextsJson } from "../imTexts/imTexts.ts";
import { changeKeys } from "./tetris.ts";
// @ts-ignore
import  page from 'page';
import {userKeys, keys} from "../utils.ts";
import {backgroundHandler, bgmPlayer, tetrisTexturesHandler} from "./utils.ts";

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
					<option value="classic" class="${TCS.gameOption}" ${tetrisTexturesHandler.getActualTexture() === "classic" ? "selected" : "" }>Classic</option>
					<option value="minetris" class="${TCS.gameOption}" ${tetrisTexturesHandler.getActualTexture() === "minetris" ? "selected" : "" }>Minetris</option>
					<option value="minimalist" class="${TCS.gameOption}" ${tetrisTexturesHandler.getActualTexture() === "minimalist" ? "selected" : "" }>Minimalist</option>
				</select>
			</div>
			<div class="col-span-2 h-[20px]"></div>

<!-- Background -->
			<div id="bkgName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsBkgTitle}</div>
			<div id="bkgKey" class="${TCS.gameSelect}">
				<select id="bkgSelect" class="w-full">
					<option class="${TCS.gameOption}" value="bkg_1" ${backgroundHandler.getActualBackground() === "bkg_1" ? "selected" : "" }>Background1</option>
					<option class="${TCS.gameOption}" value="bkg_2" ${backgroundHandler.getActualBackground() === "bkg_2" ? "selected" : "" }>Background2</option>
					<option class="${TCS.gameOption}" value="bkg_3" ${backgroundHandler.getActualBackground() === "bkg_3" ? "selected" : "" }>Background3</option>
					<option class="${TCS.gameOption}" value="bkg_4" ${backgroundHandler.getActualBackground() === "bkg_4" ? "selected" : "" }>Background4</option>
					<option class="${TCS.gameOption}" value="bkg_5" ${backgroundHandler.getActualBackground() === "bkg_5" ? "selected" : "" }>Background5</option>
				</select>
			</div>
			<div class="col-span-2 h-[20px]"></div>

<!-- Music -->
			<div id="musicName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsMusicTitle}</div>
			<div id="musicKey" class="${TCS.gameSelect}">
				<select id="musicSelect" class="w-full">
					<option class="${TCS.gameOption}" value="none" ${bgmPlayer.getActualBgm() === "none" ? "selected" : "" } >No Music</option>
					<option class="${TCS.gameOption}" value="bgm1" ${bgmPlayer.getActualBgm() === "bgm1" ? "selected" : "" }>Disturbing the peace (PEAK)</option>
					<option class="${TCS.gameOption}" value="bgm2" ${bgmPlayer.getActualBgm() === "bgm2" ? "selected" : "" }>Brain Power</option>
					<option class="${TCS.gameOption}" value="bgm3" ${bgmPlayer.getActualBgm() === "bgm3" ? "selected" : "" }>Jump Up, Super Star!</option>
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
	 
	html = html.replace(/"> <\/div>/g, '">Space</div>'); // affichage de space

	EL.contentTetris.innerHTML = html;
}

const tetrisSettingsEvents = () => {
	const   elements = {
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
	const   musicSelct = document.getElementById("musicSelect") as HTMLSelectElement;
	const   bkgSelect = document.getElementById("bkgSelect") as HTMLSelectElement;
	const   minoSelect = document.getElementById("minoSelect") as HTMLSelectElement;

	musicSelct?.addEventListener("change", (e) => {
		const selectedValue = e.target?.value;
		bgmPlayer.choseBgm(selectedValue);
	})

	bkgSelect?.addEventListener("change", (e) => {
		const selectedValue = e.target?.value;

		backgroundHandler.setActualBackground(selectedValue);
	})

	minoSelect?.addEventListener("change", (e) => {
		const selectedValue = e.target?.value;

		tetrisTexturesHandler.setTexture(selectedValue);
	})

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

