import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts } from "../imTexts/imTexts.ts";
import { changeKeys } from "./tetris.ts";
// @ts-ignore
import  page from 'page';
import { userKeys } from "./utils.ts";
import { backgroundHandler, bgmPlayer, tetrisTexturesHandler } from "./utils.ts";

export const tetrisSettings = async () => {
	await tetrisSettingsHtml();
	tetrisSettingsEvents();
}

const tetrisSettingsHtml = async () => {
	if (!EL.contentTetris)
		return;

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
					<option class="${TCS.gameOption}" value="bkg_1" ${backgroundHandler.getActualBackground() === "bkg_1" ? "selected" : "" }>Neon Circle</option>
					<option class="${TCS.gameOption}" value="bkg_2" ${backgroundHandler.getActualBackground() === "bkg_2" ? "selected" : "" }>Minimal tetris</option>
					<option class="${TCS.gameOption}" value="bkg_3" ${backgroundHandler.getActualBackground() === "bkg_3" ? "selected" : "" }>Cloud</option>
					<option class="${TCS.gameOption}" value="bkg_4" ${backgroundHandler.getActualBackground() === "bkg_4" ? "selected" : "" }>Kiki & Jiji</option>
					<option class="${TCS.gameOption}" value="bkg_5" ${backgroundHandler.getActualBackground() === "bkg_5" ? "selected" : "" }>Flowers</option>
					<option class="${TCS.gameOption}" value="bkg_6" ${backgroundHandler.getActualBackground() === "bkg_6" ? "selected" : "" }>Cyberpunk pixel</option>
					<option class="${TCS.gameOption}" value="bkg_7" ${backgroundHandler.getActualBackground() === "bkg_7" ? "selected" : "" }>Wall of cubes</option>
					<option class="${TCS.gameOption}" value="bkg_8" ${backgroundHandler.getActualBackground() === "bkg_8" ? "selected" : "" }>2001: A Space Odyssey</option>
				</select>
			</div>
			<div class="col-span-2 h-[20px]"></div>

<!-- Music -->
			<div id="musicName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsMusicTitle}</div>
			<div id="musicKey" class="${TCS.gameSelect}">
				<select id="musicSelect" class="w-full">
					<option class="${TCS.gameOption}" value="none" ${bgmPlayer.getActualBgm() === "none" ? "selected" : "" }>No Music</option>
					<option class="${TCS.gameOption}" value="bgm1" ${bgmPlayer.getActualBgm() === "bgm1" ? "selected" : "" }>Disturbing the peace (PEAK)</option>
					<option class="${TCS.gameOption}" value="bgm2" ${bgmPlayer.getActualBgm() === "bgm2" ? "selected" : "" }>Brain Power</option>
					<option class="${TCS.gameOption}" value="bgm3" ${bgmPlayer.getActualBgm() === "bgm3" ? "selected" : "" }>Jump Up, Super Star!</option>
					<option class="${TCS.gameOption}" value="bgm4" ${bgmPlayer.getActualBgm() === "bgm4" ? "selected" : "" }>A Cruel Angel's Thesis</option>
					<option class="${TCS.gameOption}" value="bgm5" ${bgmPlayer.getActualBgm() === "bgm5" ? "selected" : "" }>Submerciful</option>
					<option class="${TCS.gameOption}" value="bgm6" ${bgmPlayer.getActualBgm() === "bgm6" ? "selected" : "" }>Chirpsichord</option>
				</select>
			</div>
			<div class="col-span-2 h-[20px]"></div>

<!-- Keybindings -->
			<div id="moveLeftName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyMoveLeft}</div>
			<div id="moveLeftKey" class="${TCS.gameBlockLink}">${userKeys?.getMoveLeft()}</div>
			
			<div id="moveRightName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyMoveRight}</div>
			<div id="moveRightKey" class="${TCS.gameBlockLink}">${userKeys?.getMoveRight()}</div>
			
			<div id="rotClockName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyRotateClockwise}</div>
			<div id="rotClockKey" class="${TCS.gameBlockLink}">${userKeys?.getClockwiseRotate()}</div>
			
			<div id="rotCountClockName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyRotateCounterclockwise}</div>
			<div id="rotCountClockKey" class="${TCS.gameBlockLink}">${userKeys?.getCounterclockwise()}</div>
			
			<div id="rot180Name" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyRotate180}</div>
			<div id="rot180Key" class="${TCS.gameBlockLink}">${userKeys?.getRotate180()}</div>
			
			<div id="hardDropName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyHardDrop}</div>
			<div id="hardDropKey" class="${TCS.gameBlockLink}">${userKeys?.getHardDrop()}</div>
			
			<div id="softDropName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeySoftDrop}</div>
			<div id="softDropKey" class="${TCS.gameBlockLink}">${userKeys?.getSoftDrop()}</div>
			
			<div id="holdName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyHold}</div>
			<div id="holdKey" class="${TCS.gameBlockLink}">${userKeys?.getHold()}</div>
			
			<div id="forfeitName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyForfeit}</div>
			<div id="forfeitKey" class="${TCS.gameBlockLink}">${userKeys?.getForfeit()}</div>
			
			<div id="retryName" class="${TCS.gameBlockLabel}">${imTexts.tetrisSettingsKeyRetry}</div>
			<div id="retryKey" class="${TCS.gameBlockLink}">${userKeys?.getRetry()}</div>

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
		forfeit: document.getElementById("forfeitKey"),
		retry: document.getElementById("retryKey"),
	};
	const   musicSelct = document.getElementById("musicSelect") as HTMLSelectElement;
	const   bkgSelect = document.getElementById("bkgSelect") as HTMLSelectElement;
	const   minoSelect = document.getElementById("minoSelect") as HTMLSelectElement;

	musicSelct?.addEventListener("change", (e) => {
		if (!e.target)
			return;
		const selectedValue = (e.target as HTMLSelectElement).value;
		bgmPlayer.choseBgm(selectedValue);
	})

	bkgSelect?.addEventListener("change", (e) => {
		if (!e.target)
			return;
		const selectedValue = (e.target as HTMLSelectElement).value;
		backgroundHandler.setActualBackground(selectedValue);
	})

	minoSelect?.addEventListener("change", (e) => {
		if (!e.target)
			return;
		const selectedValue = (e.target as HTMLSelectElement).value;
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
	elements.moveLeft?.addEventListener("click", () => { changeKeys("moveLeft") });
	elements.moveRight?.addEventListener("click", () => changeKeys("moveRight"));
	elements.rotClock?.addEventListener("click", () => changeKeys("rotateClockwise"));
	elements.rotCountClock?.addEventListener("click", () => changeKeys("rotateCounterClockwise"));
	elements.rot180?.addEventListener("click", () => changeKeys("rotate180"));
	elements.hardDrop?.addEventListener("click", () => changeKeys("hardDrop"));
	elements.softDrop?.addEventListener("click", () => changeKeys("softDrop"));
	elements.hold?.addEventListener("click", () => changeKeys("hold"));
	elements.forfeit?.addEventListener("click", () => changeKeys("forfeit"));
	elements.retry?.addEventListener("click", () => changeKeys("retry"));

	document.getElementById("tetrisSettingsBack")?.addEventListener("click", () => {
		page("/tetris");
	});

	document.getElementById("tetrisSettingsValidate")?.addEventListener("click", () => {
		page("/tetris");
	});
}

