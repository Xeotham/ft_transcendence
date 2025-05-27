import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts } from "../imTexts/imTexts.ts";
import { joinRoom, getMultiplayerRooms } from "./gameManagement.ts";
import { roomInfo } from "./utils.ts";
import { resetGamesSocket } from "../utils.ts";
// @ts-ignore
import  page from 'page';

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

		<div class="${TCS.tetrisSettingTitle}">
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
			
			<div><button id="tetrisDisplayMultiplayerRoomCodeSubmit" class="${TCS.tetrisKeybindingsKey} w-full">
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
		<a href="/tetris/room:${room?.roomCode}" class="${TCS.tetrisRoomList} block w-full">
		<span class="text-yellow-600">» </span>${room.roomCode}
		<span class="text-stone-50">${imTexts.tetrisDisplayMultiplayerRoomJoin}</span>
		</a>`;
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
	
	document.getElementById("tetrisDisplayMultiplayerRoomCodeSubmit")?.addEventListener("click", () => {
		joinRoom((document.getElementById("room-code") as HTMLInputElement).value);
	});

	document.getElementById("tetrisDisplayMultiplayerRefresh")?.addEventListener("click", () => 
		getMultiplayerRooms());
}


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