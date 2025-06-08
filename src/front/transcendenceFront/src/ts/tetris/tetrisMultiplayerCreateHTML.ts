import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts } from "../imTexts/imTexts.ts";
import { tetrisGameInformation } from "./tetris.ts";
import { startRoom } from "./gameManagement.ts";
import { resetGamesSocket, postToApi, address, getFromApi } from "../utils.ts";
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

	let dis: string = tetrisGameInformation.getRoomOwner() ? "" : "disabled";

	const s = tetrisGameInformation.getSettings();

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
			<div class="${TCS.gameTexteGris} text-[14px] text-left translate-y-[-5px] col-span-4">
			${s.nbPlayers} ${imTexts.tetrisCreateMultiplayerRoomNbPlayers}</div>
		</div>


		<div class='h-[30px]'></div>

		<div class="${TCS.tetrisWindowText} text-[24px]">
		${imTexts.tetrisCreateMultiplayerRoomSettingsTitle}
		</div>

		<div class='h-[10px]'></div>


		<form id="tetrisSettingsForm">
		<div class="${TCS.tetrisWindowText} grid grid-cols-4 gap-x-[20px] gap-y-[6px]">

			<label id="createMultiplayerRoomIsPrivate" class="col-span-3 hover:cursor-pointer" for="is-private">
				${imTexts.tetrisCreateMultiplayerRoomIsPrivate}</label>
			<div><label class="custom-checkbox"><input type="checkbox" id="is-private" name="is-private"
			${s.isPrivate ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>
			
			<label id="createMultiplayerRoomIsVersus" class="col-span-3 hover:cursor-pointer" for="is-versus">
				${imTexts.tetrisCreateMultiplayerRoomIsVersus}</label>
			<div><label class="custom-checkbox"><input type="checkbox" id="is-versus" name="is-versus"
			${s.isVersus ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>

			<label id="createMultiplayerRoomShowShadow" class="col-span-3 hover:cursor-pointer" for="show-shadow">
				${imTexts.tetrisCreateMultiplayerRoomShowShadow}</label>
			<div><label class="custom-checkbox"><input type="checkbox" id="show-shadow" name="show-shadow"
			${s.showShadowPiece ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>

			<label id="createMultiplayerRoomShowBags" class="col-span-3 hover:cursor-pointer" for="show-bags">
				${imTexts.tetrisCreateMultiplayerRoomShowBags}</label>
			<div><label class="custom-checkbox"><input type="checkbox" id="show-bags" name="show-bags"
			${s.showBags ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>	

			<label id="createMultiplayerRoomHoldAllowed" class="col-span-3 hover:cursor-pointer" for="hold-allowed">
				${imTexts.tetrisCreateMultiplayerRoomHoldAllowed}</label>
			<div><label class="custom-checkbox"><input type="checkbox" id="hold-allowed" name="hold-allowed"
			${s.holdAllowed ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>	

			<label id="createMultiplayerRoomShowHold" class="col-span-3 hover:cursor-pointer" for="show-hold">
				${imTexts.tetrisCreateMultiplayerRoomShowHold}</label>
			<div><label class="custom-checkbox"><input type="checkbox" id="show-hold" name="show-hold"
			${s.showHold ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>

			<label id="createMultiplayerRoomInfiniteHold" class="col-span-3 hover:cursor-pointer" for="infinite-hold">
				${imTexts.tetrisCreateMultiplayerRoomInfiniteHold}</label>
			<div><label class="custom-checkbox"><input type="checkbox" id="infinite-hold" name="infinite-hold"
			${s.infiniteHold ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>	

			<label id="createMultiplayerRoomInfiniteMovement" class="col-span-3 hover:cursor-pointer" for="infinite-movement">
				${imTexts.tetrisCreateMultiplayerRoomInfiniteMovement}</label>
			<div><label class="custom-checkbox"><input type="checkbox" id="infinite-movement"  name="infinite-movement"
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

			<label id="createMultiplayerRoomIsLeveling" class="col-span-3 hover:cursor-pointer" for="is-leveling">
				${imTexts.tetrisCreateMultiplayerRoomIsLeveling}</label>
			<div><label class="custom-checkbox"><input type="checkbox" id="is-leveling" name="is-leveling"
			${s.isLevelling ? "checked" : ""} ${dis}/><span class="checkmark"></span></label></div>
			
		</div></form>
		
		<div class="h-[30px]"></div>
	</div>

	`;
}

const tetrisMultiplayerRoomEvents = (code: string) => {

	document.getElementById("tetrisCreateMultiplayerRoomBack")?.addEventListener("click", () => {
		resetGamesSocket("home"); 
	});

	if (!tetrisGameInformation.getRoomOwner()) 
		return ;

	document.getElementById("startCustom")?.addEventListener("click", async () => {
		await saveMultiplayerRoomSettings();
		await postToApi(`http://${address}/api/tetris/roomCommand`,
			{ argument: "settings", gameId: 0, roomCode: tetrisGameInformation.getRoomCode(), prefix: tetrisGameInformation.getSettings() }).catch();
		startRoom();
	});

	document.getElementById("clipboardCopy")?.addEventListener("click", async (e) => {
		e.preventDefault();
		await copyToClipboard(code);
	});

	const form = document.getElementById("tetrisSettingsForm");
	form?.addEventListener("change", saveMultiplayerRoomSettings);
}

export const saveMultiplayerRoomSettings = async () => {
	try {
		let values: { [key: string]: any } = {};
		values["versus"] = (document.getElementById("is-versus") as HTMLInputElement)?.checked;
		values["0"] = parseInt((document.getElementById("lock-time") as HTMLInputElement).value, 10);
		values["1"] = parseInt((document.getElementById("spawn-ARE") as HTMLInputElement).value, 10);
		values["2"] = parseFloat((document.getElementById("soft-drop-amp") as HTMLInputElement).value);
		values["3"] = parseInt((document.getElementById("level") as HTMLInputElement).value, 10);
		const nbPlayers = ((await getFromApi(`http://${address}/api/tetris/getMultiplayerRooms`))
			.find((room: any) => room?.roomCode === tetrisGameInformation.getRoomCode())?.nbPlayers) || 0;
		values["versus"] === true && nbPlayers > 2 ? values["versus"] = false : true;
		typeof values["1"] !== "number" || isNaN(values["0"]) ? values["0"] = 500 : values["0"] = clamp(values["0"], -1, abs(values["0"]));
		typeof values["1"] !== "number" || isNaN(values["1"]) ? values["1"] = 0 : values["1"] = clamp(values["1"], 0, abs(values["1"])); // Spawn ARE must be >= 0 and positive
		typeof values["2"] !== "number" || isNaN(values["2"]) ? values["2"] = 1.5 : values["2"] = clamp(values["2"], 0.1, abs(values["2"])); // Soft drop amp must be > 0 && positive
		typeof values["3"] !== "number" || isNaN(values["3"]) ? values["3"] = 4 : values["3"] = clamp(values["3"], 1, 15); // Level must be between 1 and 15

		(document.getElementById("is-versus") as HTMLInputElement)!.checked = values["versus"];
		(document.getElementById("lock-time") as HTMLInputElement)!.value = values["0"].toString();
		(document.getElementById("spawn-ARE") as HTMLInputElement)!.value = values["1"].toString();
		(document.getElementById("soft-drop-amp") as HTMLInputElement)!.value = values["2"].toString();
		(document.getElementById("level") as HTMLInputElement)!.value = values["3"].toString();

		tetrisGameInformation.setSettings({
			"isPrivate": (document.getElementById("is-private") as HTMLInputElement)?.checked,
			"isVersus": values["versus"],
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
			"isLevelling": (document.getElementById("is-leveling") as HTMLInputElement)?.checked,
			"canRetry": tetrisGameInformation.getSettings().canRetry,
		});

		postToApi(`http://${address}/api/tetris/roomCommand`, {
			argument: "settings",
			gameId: 0,
			roomCode: tetrisGameInformation.getRoomCode(),
			prefix: tetrisGameInformation.getSettings()
		});
	}
	catch (error) {
		return ;
	}
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
