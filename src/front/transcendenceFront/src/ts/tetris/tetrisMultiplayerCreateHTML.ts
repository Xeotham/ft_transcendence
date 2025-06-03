import { address } from "../immanence.ts";
import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts } from "../imTexts/imTexts.ts";
import { tetrisGameInformation } from "./tetris.ts";
import { startRoom } from "./gameManagement.ts";
import { resetGamesSocket, postToApi } from "../utils.ts";
// @ts-ignore
import  page from 'page';
import { abs, clamp } from "./utils.ts";

////////////////////////////////////////////////////////
// CREATE ROOM === multiplayerRoomHtml
////////////////////////////////////////////////////////	

export const tetrisMultiplayerRoom = (code: string) => {
	tetrisMultiplayerRoomHtml(code);
	tetrisMultiplayerRoomEvents(code);
}

const tetrisMultiplayerRoomHtml = (code: string) => {
	if (!EL.contentTetris)
		return;

	// console.log("code: ", code);
	// if (!tetrisGameInformation.getRoomOwner())
	// 	return ; // TODO ben ??
	let dis: string = tetrisGameInformation.getRoomOwner() ? "" : "disabled";



	const s = tetrisGameInformation.getSettings();
	// console.log("Settings: ", s);

	EL.contentTetris.innerHTML = `
	<div class="${TCS.tetrisWindowBkg}">

		<div class="${TCS.gameTitle}">
		${imTexts.tetrisCreateMultiplayerRoomTitle}</div>		

		<div class="${TCS.modaleTexte} translate-y-[-5px]">
		<a id="tetrisCreateMultiplayerRoomBack" class="${TCS.modaleTexteLink}">
		${imTexts.tetrisCreateMultiplayerRoomBack}</a></div>

		<div class='h-[30px]'></div>
		
		<div id="tetrisDisplayMultiplayerRoomFormCode" class="grid grid-cols-4 gap-x-[10px] gap-y-[7px]">
			<div id="startCustom" class="${TCS.gameBigButton} col-span-3 row-span-2">
			${imTexts.tetrisCreateMultiplayerRoomStart}</div>
			<div class="${TCS.tetrisWindowText} text-[24px] mb-[-10px] text-left translate-y-[5px]">
			${code}</div>
			<div id="clipboardCopy" class="${TCS.modaleTexteLink} text-[14px] text-left">
				${imTexts.tetrisCreateMultiplayerRoomCopyCode}</div>
		</div>


		<div class='h-[30px]'></div>

		<div class="${TCS.tetrisWindowText} text-[24px]">
		${imTexts.tetrisCreateMultiplayerRoomSettingsTitle}
		</div>

		<div class='h-[10px]'></div>



		<div class="${TCS.tetrisWindowText} grid grid-cols-4 gap-x-[20px] gap-y-[6px]">

			<div id="createMultiplayerRoomisPrivate" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomIsPrivate}</div>
			<div><label class="custom-checkbox"><input type="checkbox" id="is-private" 
			${s.isPrivate ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>

			<div id="createMultiplayerRoomShowShadow" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomShowShadow}</div>
			<div><label class="custom-checkbox"><input type="checkbox" id="show-shadow" 
			${s.showShadowPiece ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>

			<div id="createMultiplayerRoomShowBags" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomShowBags}</div>
			<div><label class="custom-checkbox"><input type="checkbox" id="show-bags" 
			${s.showBags ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>	

			<div id="createMultiplayerRoomHoldAllowed" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomHoldAllowed}</div>
			<div><label class="custom-checkbox"><input type="checkbox" id="hold-allowed" 
			${s.holdAllowed ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>	

			<div id="createMultiplayerRoomShowHold" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomShowHold}</div>
			<div><label class="custom-checkbox"><input type="checkbox" id="show-hold" 
			${s.showHold ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>

			<div id="createMultiplayerRoomInfiniteHold" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomInfiniteHold}</div>
			<div><label class="custom-checkbox"><input type="checkbox" id="infinite-hold" 
			${s.infiniteHold ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>	

			<div id="createMultiplayerRoomInfiniteMovement" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomInfiniteMovement}</div>
			<div><label class="custom-checkbox"><input type="checkbox" id="infinite-movement" 
			${s.infiniteMovement ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>

			<div id="createMultiplayerRoomLockTime" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomLockTime}</div>
			<div><label class="${TCS.formInputNumber}"><input type="number" id="lock-time" 
			value="${s.lockTime !== undefined ? s.lockTime : "500"}" ${dis} 
			class="${TCS.formInputNumberBkg}"/></label></div>	

			<div id="createMultiplayerRoomSpawnARE" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomSpawnARE}</div>
			<div><label class="${TCS.formInputNumber}"><input type="number" id="spawn-ARE" 
			value="${s.spawnARE !== undefined ? s.spawnARE : "0"}" ${dis} 
			class="${TCS.formInputNumberBkg}"/></label></div>	

			<div id="createMultiplayerRoomSoftDropAmp" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomSoftDropAmp}</div>
			<div><label class="${TCS.formInputNumber}"><input type="number" id="soft-drop-amp" 
			value="${s.softDropAmp !== undefined ? s.softDropAmp : "1.5"}" ${dis} 
			class="${TCS.formInputNumberBkg}"/></label></div>

			<div id="createMultiplayerRoomLevel" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomLevel}</div>
			<div><label class="${TCS.formInputNumber}"><input type="number" id="level" 
			value="${s.level !== undefined ? s.level : "4"}" ${dis}
			class="${TCS.formInputNumberBkg}"/></label></div>

			<div id="createMultiplayerRoomIsLeveling" class="col-span-3">
				${imTexts.tetrisCreateMultiplayerRoomIsLeveling}</div>
			<div><label class="custom-checkbox"><input type="checkbox" id="is-leveling" 
			${s.isLevelling ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>


		
		<div class="col-span-3"></div>
		<div class="text-left" ><a id="saveCustom" class="${TCS.modaleTexteLink}">
			${imTexts.tetrisCreateMultiplayerRoomSave}</a></div>			
		</div>



		<div class="h-[30px]"></div>

	</div>
	`;
}

const tetrisMultiplayerRoomEvents = (code: string) => {

	document.getElementById("tetrisCreateMultiplayerRoomBack")?.addEventListener("click", () => {
		resetGamesSocket("home"); 
		// page.show("/tetris");
	});

	if (!tetrisGameInformation.getRoomOwner()) 
		return ;

	document.getElementById("startCustom")?.addEventListener("click", () => {
		startRoom();
		postToApi(`http://${address}/api/tetris/roomCommand`, { argument: "settings", gameId: 0, roomCode: tetrisGameInformation.getRoomCode(), prefix: tetrisGameInformation.getSettings() });
	});

	document.getElementById("clipboardCopy")?.addEventListener("click", async (e) => {
		e.preventDefault();
		await copyToClipboard(code);
	});

	document.getElementById("is-private")?.addEventListener("click", () => tetrisGameInformation.setNeedSave(true));
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

	document.getElementById("saveCustom")?.addEventListener("click", saveMultiplayerRoomSettings);
}

const saveMultiplayerRoomSettings = () => {
	let values: {[key: string]: number} = {};
	values["0"] = parseInt((document.getElementById("lock-time") as HTMLInputElement).value, 10);
	values["1"] = parseInt((document.getElementById("spawn-ARE") as HTMLInputElement).value, 10);
	values["2"] = parseFloat((document.getElementById("soft-drop-amp") as HTMLInputElement).value);
	values["3"] = parseInt((document.getElementById("level") as HTMLInputElement).value, 10);
	typeof values["1"] !== "number" || isNaN(values["0"]) ? values["0"] = 500 : true;
	typeof values["1"] !== "number" || isNaN(values["1"]) ? values["1"] = 0 : values["1"] = clamp(values["1"], 0, abs(values["1"])); // Spawn ARE must be between 0 and positive
	typeof values["2"] !== "number" || isNaN(values["2"]) ? values["2"] = 1.5 : values["2"] = clamp(values["2"], 0.1, abs(values["2"])); // Soft drop amp must be positive
	typeof values["3"] !== "number" || isNaN(values["3"]) ? values["3"] = 4 : values["3"] = clamp(values["3"], 1, 15); // Level must be between 1 and 15

	(document.getElementById("lock-time") as HTMLInputElement)!.value = values["0"].toString();
	(document.getElementById("spawn-ARE") as HTMLInputElement)!.value = values["1"].toString();
	(document.getElementById("soft-drop-amp") as HTMLInputElement)!.value = values["2"].toString();
	(document.getElementById("level") as HTMLInputElement)!.value = values["3"].toString();

	tetrisGameInformation.setSettings({
		"isPrivate": (document.getElementById("is-private") as HTMLInputElement)?.checked,
		"showShadowPiece": (document.getElementById("show-shadow") as HTMLInputElement)?.checked,
		"showBags": (document.getElementById("show-bags") as HTMLInputElement)?.checked,
		"holdAllowed": (document.getElementById("hold-allowed") as HTMLInputElement)?.checked,
		"showHold": (document.getElementById("show-hold") as HTMLInputElement)?.checked,
		"infiniteHold": (document.getElementById("infinite-hold") as HTMLInputElement)?.checked,
		"infiniteMovement": (document.getElementById("infinite-movement") as HTMLInputElement)?.checked,
		"lockTime": values["0"],
		"spawnARE": values["1"],
		"softDropAmp": values["2"],
		"level": values["3"],
		"isLevelling": (document.getElementById("is-leveling") as HTMLInputElement)?.checked
	});

	tetrisGameInformation.setNeedSave(false);

	postToApi(`http://${address}/api/tetris/roomCommand`, { argument: "settings", gameId: 0, roomCode: tetrisGameInformation.getRoomCode(), prefix: tetrisGameInformation.getSettings() });

}
export const copyToClipboard = async (code: string) => {
	if (code.length > 0) {
		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(code);
			} else {
				const textArea = document.createElement("textarea");
				textArea.value = code;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
			}
			// console.log("Code copié :", code);
		} catch (err) {
			console.error('Erreur lors de la copie :', err);
		}
	}
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
