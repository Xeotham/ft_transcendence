import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts } from "../imTexts/imTexts.ts";
import { joinRoom, getMultiplayerRooms } from "./gameManagement.ts";
import { roomInfo } from "./utils.ts";
import { resetGamesSocket } from "../utils.ts";
// @ts-ignore
import  page from 'page';
import { saveMultiplayerRoomSettings } from "./tetrisMultiplayerCreateHTML.ts";

(window as any).joinRoom = joinRoom;

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

	let html = `
	<div class="${TCS.tetrisWindowBkg}">

		<div class="${TCS.gameTitle}">
		${imTexts.tetrisDisplayMultiplayerRoomTitle}</div>

		<div class="${TCS.modaleTexte} translate-y-[-5px]">
		<a id="tetrisDisplayMultiplayerRoomBack" class="${TCS.modaleTexteLink}">
		${imTexts.tetrisDisplayMultiplayerRoomBack}</a></div>
		
		<div class='h-[30px]'></div>

		<form id="tetrisDisplayMultiplayerRoomFormCode" class="grid grid-cols-2 gap-x-[20px] gap-y-[2px]">
		
			<div id="tetrisDisplayMultiplayerRoomCodeTitle" class="${TCS.tetrisWindowText} text-[24px] col-span-2">
			${imTexts.tetrisDisplayMultiplayerRoomCodeTitle}</div>

			<div id="tetrisDisplayMultiplayerRoomCode" class="${TCS.formDivInput}">
				<input type="text" id="tetrisDisplayMultiplayerRoomCodeText" class="${TCS.formInputTetrisMultiplayer}" placeholder="" required />
				<label for="tetrisDisplayMultiplayerRoomCodeText" id="tetrisDisplayMultiplayerRoomCodeLabel" class="${TCS.formLabelTetrisMultiplayer}">
				${imTexts.tetrisDisplayMultiplayerRoomCodeLabel}</label>
			</div>
			
			<div><button type="submit" id="tetrisDisplayMultiplayerRoomCodeSubmit" class="${TCS.gameBlockLink} w-full">
			${imTexts.tetrisDisplayMultiplayerRoomCodeSubmit}</button></div>

		</form>
		
		<div class='h-[20px]'></div>

		<div class="${TCS.tetrisWindowText} text-[24px]">
		${imTexts.tetrisDisplayMultiplayerRoomListTitle}

		<div class='h-[10px]'></div>`;

	if (rooms.length === 0) {
		// No rooms
		html += `
		<div class="font-sixtyfour text-[14px] text-stone-400 italic">
		${imTexts.tetrisDisplayMultiplayerRoomNoList}</div>`;
		//return;
	} else {
		// List of rooms
		rooms.forEach((room: roomInfo) => {
		html += `
<!-- TODO fix the button I am a bozo-->
		<div onclick="joinRoom('${room?.roomCode}')" class="${TCS.gameList} block w-full">
		<span class="text-yellow-600">» </span>${room.roomCode}
		<span class="text-stone-50">${imTexts.tetrisDisplayMultiplayerRoomJoin}</span>
		</div>`;
		});
	}

	html += `
		<div class='h-[5px]'></div>

		<div class="text-left"><a id="tetrisDisplayMultiplayerRefresh" class="${TCS.modaleTexteLink}">
		${imTexts.tetrisDisplayMultiplayerRoomRefresh}</a></div>

		<div class='h-[30px]'></div>

	</div>`;

	EL.contentTetris.innerHTML = html;
}

const tetrisDisplayMultiplayerRoomEvents = () => {

	document.getElementById("tetrisDisplayMultiplayerRoomBack")?.addEventListener("click", () => { 
		resetGamesSocket("home"); //TODO what is that ?????
		page("/tetris");
		//loadTetrisPage("idle"); //TODO why ???
	});

	(document.getElementById("tetrisDisplayMultiplayerRoomFormCode") as HTMLFormElement)?.addEventListener("submit", (e) => {
		e.preventDefault();
		joinRoom((document.getElementById("tetrisDisplayMultiplayerRoomCodeText") as HTMLInputElement).value);
	});

	document.getElementById("tetrisDisplayMultiplayerRefresh")?.addEventListener("click", () => 
		getMultiplayerRooms());




	// document.getElementById("is-private")?.addEventListener("click", () => {
	// 	console.log("Saving is private setting?");
	// });
	// document.getElementById("is-versus")?.addEventListener("click", () => saveMultiplayerRoomSettings());
	// document.getElementById("show-shadow")?.addEventListener("click", () => saveMultiplayerRoomSettings());
	// document.getElementById("show-bags")?.addEventListener("click", () => saveMultiplayerRoomSettings());
	// document.getElementById("hold-allowed")?.addEventListener("click", () => saveMultiplayerRoomSettings());
	// document.getElementById("infinite-hold")?.addEventListener("click", () => saveMultiplayerRoomSettings());
	// document.getElementById("infinite-movement")?.addEventListener("click", () => saveMultiplayerRoomSettings());
	// document.getElementById("lock-time")?.addEventListener("change", () => saveMultiplayerRoomSettings());
	// document.getElementById("spawn-ARE")?.addEventListener("change", () => saveMultiplayerRoomSettings());
	// document.getElementById("soft-drop-amp")?.addEventListener("change", () => saveMultiplayerRoomSettings());
	// document.getElementById("level")?.addEventListener("change", () => saveMultiplayerRoomSettings());
	// document.getElementById("is-leveling")?.addEventListener("click", () => saveMultiplayerRoomSettings());
}
