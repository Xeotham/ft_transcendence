import { TCS } from "../TCS.ts";
import { EL } from "../zone/zoneHTML.ts";
import { loadHtmlArg, loadPongHtmlType, RoomInfo, TournamentInfo } from "./utils.ts";
import { pongGameInfo } from "./pong.ts";
import { imTexts } from "../imTexts/imTexts.ts";
import { quit } from "./game.ts";
import { hideZoneGame, showZoneGame } from "../zone/zoneCore.ts";
import { pongSettingsHtml } from "./pongSettingsHTML.ts";
import { getTournamentInfo } from "./tournament.ts";

import img_pong_logo from '/src/medias/images/zones/logoPong.png';

// @ts-ignore
import  page from 'page';

(window as any).getTournamentInfo = getTournamentInfo;

export const loadPongHtml = (page: loadPongHtmlType, arg: loadHtmlArg | null = null) => {
	switch (page) {
		case "empty":
			return emptyHtml();
		case "logo":
			return logoHtml();
		case "idle":
			return idleHtml();
		case "nav-offline":
			return pongSoloHtml();
		case "nav-online":
			return pongVersusHtml();
		case "nav-tournament":
			return pongTournamentHtml();
		case "nav-setting":
			return pongSettingsHtml();
		case "match-found":
			return pongVersusJoinHtml();
		case "tournament-found":
			return pongTournamentFoundHtml();
		case "board":
			return pongDrawBoardHtml();
		case "confirm":
			return pongJoinConfirmPageHtml();
		case "tournament-name":
			return pongTournamentNameHtml();
		case "spec-room-info":
			return pongVersusSpectateHtml(arg?.roomId!);
		case "tour-info":
			return pongTournamentInfoHtml(arg?.tourId!, arg?.started!, arg?.tourName!);
		case "list-rooms":
			return pongVersusListHtml(arg?.roomLst!);
		case "list-tournaments":
			return PongTournamentListHtml(arg?.tourLst!);
		case "tournament-end":
			return pongTournamentEndPage(arg?.winner!);
		case "priv-room-create":
			return pongVersusPrivateHtml(arg?.inviteCode!);
		case "priv-room-code":
			return pongVersusJoinPrivRoomHtml();
	}
}

const   emptyHtml = () => {
	if (!EL.contentPong) return ;
	EL.contentPong.innerHTML = ``;
}

const   logoHtml = () => {
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = `
	<div id="logoPong" class="w-full h-full m-40 flex justify-center items-center">
		<img src="${img_pong_logo}" alt="pong" class="w-full h-auto" />
	</div>
	`;
}

const   idleHtml = () => {
	if (!EL.contentPong) return ;

	EL.contentPong.innerHTML = `
	<nav class="${TCS.pongNav0}">
		<div id="pongTitle" class="${TCS.pongTitre} flex-1">${imTexts.pongNavTitle}</div>
		<div class="flex-1"><button id="pongSolo" class="${TCS.pongNavButton}">${imTexts.pongNavSolo}</button></div>
		<div class="flex-1"><button id="pongVersus" class="${TCS.pongNavButton}">${imTexts.pongNavVersus}</button></div>
		<div class="flex-1"><button id="pongTournament" class="${TCS.pongNavButton}">${imTexts.pongNavTournament}</button></div>
		<div class="flex-1"><button id="pongSettings" class="${TCS.pongNavButton}">${imTexts.pongNavSettings}</button></div>
		<div class="flex-1"><button id="pongBack" class="${TCS.pongNavButton}">${imTexts.pongNavHome}</button></div>
	</nav>
	`;
}

const   pongSoloHtml = () => {
	if (!EL.contentPong) return ;

	EL.contentPong.innerHTML = `
	<nav class="${TCS.pongNav0}">
		<div id="pongSoloTitle" class="${TCS.pongTitre} flex-1">${imTexts.pongSoloTitle}</div>
		<div class="flex-1"><button id="pongSoloSolo" class="${TCS.pongNavButton}">${imTexts.pongSoloSolo}</button></div>
		<div class="flex-1"><button id="pongSoloBot" class="${TCS.pongNavButton}">${imTexts.pongSoloBot}</button></div>
		<div class="flex-1"><button id="pongSoloBack" class="${TCS.pongNavButton}">${imTexts.pongSoloBack}</button></div>
	</nav>
	`;
}

const   pongVersusHtml = () => {
	if (!EL.contentPong) return ;

	EL.contentPong.innerHTML = `
	<nav class="${TCS.pongNav0}">
		<div id="pong" class="${TCS.pongTitre} flex-1">${imTexts.pongVersusTitle}</div>
		<div class="flex-1"><button id="pongVersusJoin" class="${TCS.pongNavButton}">${imTexts.pongVersusJoin}</button></div>
		<div class="flex-1"><button id="pongVersusPrivate" class="${TCS.pongNavButton}">${imTexts.pongVersusPrivate}</button></div>
		<div class="flex-1"><button id="pongVersusJoinPrivRoom" class="${TCS.pongNavButton}">${imTexts.pongVersusJoinPrivRoom}</button></div>
		<div class="flex-1"><button id="pongVersusSpectate" class="${TCS.pongNavButton}">${imTexts.pongVersusSpectate}</button></div>
		<div class="flex-1"><button id="pongVersusBack" class="${TCS.pongNavButton}">${imTexts.pongVersusBack}</button></div>
	</nav>
	`;
}

const   pongTournamentHtml = () => {
	if (!EL.contentPong) return ;

	EL.contentPong.innerHTML = `
	<nav class="${TCS.pongNav0}">
		<div id="pong" class="${TCS.pongTitre} flex-1">${imTexts.pongTournamentTitle}</div>
		<div class="flex-1"><button id="pongTournamentCreate" class="${TCS.pongNavButton}">${imTexts.pongTournamentCreate}</button></div>
		<div class="flex-1"><button id="pongTournamentPlay" class="${TCS.pongNavButton}">${imTexts.pongTournamentPlay}</button></div>
		<div class="flex-1"><button id="pongTournamentBack" class="${TCS.pongNavButton}">${imTexts.pongTournamentBack}</button></div>
	</nav>
	`;
}

const   pongVersusJoinHtml = () => {
	if (!EL.contentPong) return ;

	EL.contentPong.innerHTML =`
	<div class="${TCS.tetrisWindowBkg}">

		<div id="pongSettingsTitle" class="${TCS.gameTitle}">
		${imTexts.pongModalesJoinTitle}</div>
		
		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="quit" class="${TCS.modaleTexteLink}">${imTexts.pongModalesBack}</a></div>
		<div class="h-[30px]"></div>

		<div role="status">
			<svg aria-hidden="true" class="inline w-[24px] h-[24px] text-stone-400 animate-spin fill-amber-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
				<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
			</svg>
			&nbsp;&nbsp;&nbsp;<span class="${TCS.gameTexteGris} translate-y-[2px] inline-block">${imTexts.pongModalesJoinText}</span>

		</div>

		<div class="h-[30px]"></div>
	</div>
	`;
}

const   pongVersusSpectateHtml = (roomId: number) => {
	if (!EL.contentPong) return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.tetrisWindowBkg}">
		<div id="pongSettingsTitle" class="${TCS.gameTitle}">
		${imTexts.pongModalesSpecRoomTitle}</div>

		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="return" class="${TCS.modaleTexteLink}">${imTexts.pongModalesBack}</a></div>
		<div class="h-[30px]"></div>

		<div class="${TCS.gameTexte}">${imTexts.pongModalesSpecRoomText1}</div>
		<div class="h-[10px]"></div>

		<div class="${TCS.gameTexte}">${imTexts.pongModalesSpecRoomText2} ${roomId}</div>
		<div class="h-[10px]"></div>

		<div><button id="spectate" class="${TCS.gameBlockLink}">${imTexts.pongModalesSpecRoomButton}</button></div>
		<div class="h-[30px]"></div>
	</div>
	`;
}

const   pongTournamentInfoHtml = (tourId: number, started: boolean, name: string) => {
	if (!EL.contentPong) return ;

	let html = `
	<div class="${TCS.tetrisWindowBkg}">
		<div id="pongSettingsTitle" class="${TCS.gameTitle}">
		${imTexts.pongModalesTournamentInfoTitle}</div>

		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="return" class="${TCS.modaleTexteLink}">${imTexts.pongModalesBack}</a></div>
		<div class="h-[30px]"></div>

		<div class="${TCS.gameTexte}">${imTexts.pongModalesTournamentInfoName} ${name}</div>
		<div class="${TCS.gameTexte}">${imTexts.pongModalesTournamentInfoNumber} ${tourId}</div>
	`;

	html += started?`
		<div class="${TCS.gameTexte}">${imTexts.pongModalesTournamentInfoStarted}</div>`
	:`
		<div class="${TCS.gameTexte}">${imTexts.pongModalesTournamentInfoNotStarted}</div>
		<div class="h-[10px]"></div>
		<div id="joinTournament" class="${TCS.gameBlockLink}">
		${imTexts.pongModalesTournamentInfoJoin}</div>
	`;
	html += `
		<div class="h-[30px]"></div>
	</div>
	`;

	EL.contentPong.innerHTML = html;
}

const   pongVersusPrivateHtml = (inviteCode: string) => {
	if (!EL.contentPong) return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.tetrisWindowBkg}">
		<div class="${TCS.gameTitle}">
		${imTexts.pongModalesVersusCreateTitle}</div>

		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="quit" class="${TCS.modaleTexteLink}">${imTexts.pongModalesBack}</a></div>
		<div class="h-[30px]"></div>

		<div id="startCustom" class="${TCS.gameTexte}">
		${imTexts.pongModalesVersusCreateText}</div>
		<div class="h-[5px]"></div>

		<div id="clipboardCopy" class="${TCS.gameBlockLink} h-[60px]">
			<span class="text-[24px] text-stone-900 pb-[-10px]">${inviteCode}</span><br>
			<span class="text-[14px] text-yellow-600"">${imTexts.pongModalesVersusCreateCopy}</span>
		</div>

		<div class="h-[30px]"></div>
	</div>
	`;
}

const   pongVersusJoinPrivRoomHtml = () => {
	if (!EL.contentPong) return ;

	EL.contentPong.innerHTML = `

	<div class="${TCS.tetrisWindowBkg}">
		<div class="${TCS.gameTitle}">
		${imTexts.pongModalesVersusJoinTitle}</div>

		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="back" class="${TCS.modaleTexteLink}">${imTexts.pongModalesBack}</a></div>
		<div class="h-[30px]"></div>

		<form id="inviteForm">
			<input type="text" id="inviteCode" placeholder="${imTexts.pongModalesVersusJoinText}" class="${TCS.formInputTetrisMultiplayer}">
			<div class="h-[10px]"></div>
			<button type="submit" id="submit" class="${TCS.gameBlockLink} w-full h-[40px] flex items-end pb-[1px]">${imTexts.pongModalesVersusJoinSubmit}</button>
		</form>

		<div class="h-[30px]"></div>
	</div>
	`;
}

const pongVersusListHtml = (rooms: RoomInfo[]) => { // TOTO liste de rooms (spectate, tournois)
	if (!EL.contentPong) return ;

	let listHTML = `
	<div class="${TCS.tetrisWindowBkg}">
		<div class="${TCS.gameTitle}">
		${imTexts.pongModalesVersusListTitle}</div>

		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="back" class="${TCS.modaleTexteLink}">${imTexts.pongModalesBack}</a></div>
		<div class="h-[30px]"></div>
	`;

	if (rooms.length === 0) {
		listHTML += `
		<div class="${TCS.gameTexteGris}">${imTexts.pongModalesVersusListEmpty}</div>
		`;
	}
	else {	
		rooms.forEach((room: RoomInfo) => {
			if (!room.privRoom && !room.isSolo) {
				listHTML += `
			<a href="/pong/room/${room.id}" class="${TCS.gameList} block w-full">
				<span class="text-yellow-600">» </span>
				<span class="text-stone-950">Id: ${room.id}</span>
			</a>
			`;}
		});
	};
		
	listHTML += `
		<div class="h-[30px]"></div>
		<div class="text-left"><a id="pongSpectateRefresh" class="${TCS.modaleTexteLink}">
			${imTexts.tetrisDisplayMultiplayerRoomRefresh}</a></div>
		</div>
		`;
	EL.contentPong.innerHTML = listHTML;
}

const PongTournamentListHtml = (tournaments: TournamentInfo[]) => {
	if (!EL.contentPong) return ;

	let listHTML = `
	<div class="${TCS.tetrisWindowBkg}">
		<div class="${TCS.gameTitle}">
		${imTexts.pongModalesTournamentList2Title}</div>

		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="back" class="${TCS.modaleTexteLink}">${imTexts.pongModalesBack}</a></div>
		<div class="h-[30px]"></div>
	`;

	if (tournaments.length === 0) {
		listHTML += `
		<div class="${TCS.gameTexteGris}">${imTexts.pongModalesTournamentList2Text}</div>
		`;
	}
	else {
		tournaments.forEach((tournament: TournamentInfo) => {
			listHTML += `
<!--			<a href="/pong/tournament/${tournament.id}" class="${TCS.gameList} block w-full">-->
			<div onclick="getTournamentInfo(Number('${tournament.id}'))" class="${TCS.gameList} block w-full">
				<span class="text-yellow-600">» </span>
				<span class="text-stone-950">
				Id: ${tournament.id} Name: ${tournament.name}, Started: ${tournament.started}</span>
			</div>
			<div class="h-[10px]"></div>
			`;
		});
	}

	listHTML += `
		<div class="h-[20px]"></div>
			<div class="text-left"><a id="pongSpectateRefresh" class="${TCS.modaleTexteLink}">
				${imTexts.tetrisDisplayMultiplayerRoomRefresh}</a></div>
			</div>
		</div>
		`;
	EL.contentPong.innerHTML = listHTML;
}

const   pongTournamentNameHtml = () => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.tetrisWindowBkg}">
		<div class="${TCS.gameTitle}">
		${imTexts.pongModalesTournamentCreateTitle}</div>

		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="back" class="${TCS.modaleTexteLink}">${imTexts.pongModalesBack}</a></div>
		<div class="h-[30px]"></div>

		<form id="tournamentNameForm">
			<input type="text" id="tournamentName" placeholder="${imTexts.pongModalesTournamentCreateText}" class="${TCS.formInputTetrisMultiplayer}">
			<div class="h-[10px]"></div>
			<button type="submit" id="submit" class="${TCS.gameBlockLink} w-full h-[40px] flex items-end pb-[1px]">${imTexts.pongModalesTournamentCreateSubmit}</button>
		</form>

		<div class="h-[30px]"></div>
	</div>
	`;
}

const   pongTournamentEndPage = (winner: number) => {
	if (!EL.contentPong) return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.tetrisWindowBkg}">
		<div class="${TCS.gameTitle}">
		${imTexts.pongModalesTournamentEndTitle}</div>

		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="home" class="${TCS.modaleTexteLink}">${imTexts.pongModalesBack}</a></div>
		<div class="h-[30px]"></div>

		<div class="${TCS.gameTexte}">${winner}${imTexts.pongModalesTournamentEndWinner}</div>

		<div class="h-[30px]"></div>
	</div>
	`;
}

const   pongTournamentFoundHtml = () => {
	if (!EL.contentPong || !pongGameInfo.getTournament()) return ;

	let html= `
	<div class="${TCS.tetrisWindowBkg}">
	
		<div class="${TCS.gameTitle}">
		${imTexts.pongModalesTournamentFoundTitle}</div>

		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="quit" class="${TCS.modaleTexteLink}">${imTexts.pongModalesBack}</a></div>
		<div class="h-[30px]"></div>
	`;

	if (pongGameInfo.getTournament()?.getIsOwner()) {
		html += `

		<div id="start-tournament" class="${TCS.gameBlockLink}">${imTexts.pongModalesTournamentFoundStart}</div>
		<div class="h-[10px]"></div>
		<div id="shuffle-tree" class="${TCS.gameBlockLink}">${imTexts.pongModalesTournamentFoundShuffle}</div>
		<div class="h-[10px]"></div>
		<div id="quit2" class="${TCS.gameBlockLink}">${imTexts.pongModalesTournamentFoundQuit}</div>
		`;
	}
	else {
		html += `
		<div role="status">
			<svg aria-hidden="true" class="inline w-[24px] h-[24px] text-stone-400 animate-spin fill-amber-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
				<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
			</svg>
			&nbsp;&nbsp;&nbsp;
			<span class="${TCS.gameTexteGris} inline">${imTexts.pongModalesTournamentFoundWait}</span>
		</div>		
		`;
	}
	html += `
		<div class="h-[30px]"></div>
	</div>
	`;

	EL.contentPong.innerHTML = html;
}

const   pongDrawBoardHtml = () => {
	if (!EL.zoneGame)
		return

	showZoneGame();

	EL.zoneGame.innerHTML = `
	<div class="absolute z-50 w-full h-full">

		<div class="absolute z-50 top-[10px] right-[10px]">
			<button class="${TCS.pongButton}" id="quitPong">Quit</button>
		</div>
		<div id="pongEndGame" class="${TCS.tetrisEndGame}"></div>
		<div id="pongGameCanvas" class="absolute z-25 w-full h-full flex items-center justify-center bg-black">		
			<canvas id="pongCanvas" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
		</div>

	</div>
	`;

	pongQuitButton();
}

const   pongJoinConfirmPageHtml = () => {
	if (!EL.contentPong) return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.tetrisWindowBkg}">
		<div class="${TCS.gameTitle}">
		${imTexts.pongModalesTournamentJoinConfirm}</div>

		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="quit" class="${TCS.modaleTexteLink}">${imTexts.pongModalesBack}</a></div>
		<div class="h-[30px]"></div>

		<div class="${TCS.gameTexte}">${imTexts.pongModalesTournamentJoinConfirmText}</div>
		<div class="h-[10px]"></div>

		<div class="${TCS.gameBlockLink} h-[36px] text-[24px]" id="confirm-game">${imTexts.pongModalesTournamentJoinConfirmStart}</div>
		<div class="h-[10px]"></div>

		<div class="${TCS.gameTexte}" id="timer">${imTexts.pongModalesTournamentJoinConfirmTimer}</div>
	</div>
	`;
}

const   pongQuitButton = () => {
	const quitButton = document.getElementById("quitPong") as HTMLButtonElement;

	if (!quitButton)
		return ;

	quitButton.addEventListener("click", () => {
		quit();
		hideZoneGame();
		page("/pong");
	});
}