import {TCS} from "../TCS.ts";
import {EL} from "../zone/zoneHTML.ts";
import {Game, loadHtmlArg, loadPongHtmlType, RoomInfo, TournamentInfo} from "./utils.ts";
import {pongGameInfo} from "./pong.ts";
import {imTexts} from "../imTexts/imTexts.ts";
// @ts-ignore
import  page from 'page';

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
		case "tour-rooms-list":
			return pongTournamentPlayHtml(arg?.roomLst!);
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
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = ``;
}

const   logoHtml = () => {
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = `<div id="logoPong" class="${TCS.pongLogo}">Pong</div>`;
}

const   idleHtml = () => {
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = `
	<nav class="${TCS.pongNav0}">
		<div id="pongTitle" class="${TCS.pongTitre} flex-1">${imTexts.pongNavTitle}</div>
		<div class="flex-1"><button id="pongSolo" class="${TCS.pongNavButton}">${imTexts.pongNavSolo}</button></div>
		<div class="flex-1"><button id="pongVersus" class="${TCS.pongNavButton}">${imTexts.pongNavVersus}</button></div>
		<div class="flex-1"><button id="pongTournament" class="${TCS.pongNavButton}">${imTexts.pongNavTournament}</button></div>
		<div class="flex-1"><button id="pongSettings" class="${TCS.pongNavButton}">${imTexts.pongNavSettings}</button></div>
		<div class="flex-1"><button id="pongBack" class="${TCS.pongNavButton}">${imTexts.pongNavHome}</button></div>
	</nav>`;
}

const   pongSoloHtml = () => {
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = `
	<nav class="${TCS.pongNav0}">
		<div id="pongSoloTitle" class="${TCS.pongTitre} flex-1">${imTexts.pongSoloTitle}</div>
		<div class="flex-1"><button id="pongSoloSolo" class="${TCS.pongNavButton}">${imTexts.pongSoloSolo}</button></div>
		<div class="flex-1"><button id="pongSoloBot" class="${TCS.pongNavButton}">${imTexts.pongSoloBot}</button></div>
		<div class="flex-1"><button id="pongSoloBack" class="${TCS.pongNavButton}">${imTexts.pongSoloBack}</button></div>
	</nav>`;
}

const   pongVersusHtml = () => {
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = `
	<nav class="${TCS.pongNav0}">
		<div id="pong" class="${TCS.pongTitre} flex-1">${imTexts.pongVersusTitle}</div>
		<div class="flex-1"><button id="pongVersusJoin" class="${TCS.pongNavButton}">${imTexts.pongVersusJoin}</button></div>
		<div class="flex-1"><button id="pongVersusPrivate" class="${TCS.pongNavButton}">${imTexts.pongVersusPrivate}</button></div>
		<div class="flex-1"><button id="pongVersusJoinPrivRoom" class="${TCS.pongNavButton}">${imTexts.pongVersusJoinPrivRoom}</button></div>
		<div class="flex-1"><button id="pongVersusSpectate" class="${TCS.pongNavButton}">${imTexts.pongVersusSpectate}</button></div>
		<div class="flex-1"><button id="pongVersusBack" class="${TCS.pongNavButton}">${imTexts.pongVersusBack}</button></div>
	</nav>`;
}

const   pongTournamentHtml = () => {
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = `
	<nav class="${TCS.pongNav0}">
		<div id="pong" class="${TCS.pongTitre} flex-1">${imTexts.pongTournamentTitle}</div>
		<div class="flex-1"><button id="pongTournamentCreate" class="${TCS.pongNavButton}">${imTexts.pongTournamentCreate}</button></div>
		<div class="flex-1"><button id="pongTournamentPlay" class="${TCS.pongNavButton}">${imTexts.pongTournamentPlay}</button></div>
		<div class="flex-1"><button id="pongTournamentBack" class="${TCS.pongNavButton}">${imTexts.pongTournamentBack}</button></div>
	</nav>`;
}

const   pongSettingsHtml = () => {
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><h1 class="${TCS.pongText}">AAAA</h1></div>
		<div class="flex-1"><h2 class="${TCS.pongText}">BBBBB</h2></div>
		<div class="flex-1"><button id="ok" class="${TCS.pongButton}">CCCCC</button></div>
	</div>`;
}
	

const   pongVersusJoinHtml = () => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML =`
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><p class="${TCS.pongText}">Room found!</p></div>
		<div class="flex-1"><button id="quit" class="${TCS.pongButton}">Quit Room</button></div>
	</div>`;
}

const   pongVersusSpectateHtml = (roomId: number) => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><button id="return" class="${TCS.pongButton}">Return to Room List</button></div>
		<div class="flex-1"><h1 class="${TCS.pongText}">Room Info:</h1></div>
		<div class="flex-1"><h2 class="${TCS.pongText}">Room Number: ${roomId}</h2></div>
		<div class="flex-1"><button id="spectate" class="${TCS.pongButton}">Spectate Room</button></div>
	</div>`;
}

const   pongTournamentInfoHtml = (tourId: number, started: boolean, name: string) => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><h1 class="${TCS.pongText}">Tournament Info:</h1></div>
		<div class="flex-1"><h2 class="${TCS.pongText}">Tournament name: ${name}</h2></div>
		<div class="flex-1"><h2 class="${TCS.pongText}">Tournament Number: ${tourId}</h2></div>`;
	EL.contentPong.innerHTML += started?`
	<div class="flex-1"><p class="${TCS.pongText}">The tournament as already started.</p></div>`
	:`
	<div class="flex-1"><p class="${TCS.pongText}">The tournament hasn't started yet </p>
	<div class="flex-1"><p class="${TCS.pongText}">Do you want to join ?</p></div>
	<div class="flex-1">
		<button id="joinTournament" class="${TCS.pongButton}">Join the tournament</button>
		<button id="return" class="${TCS.pongButton}">Return to Tournament List</button>
	</div>`;
	EL.contentPong.innerHTML += `</div>`;
}

const   pongTournamentPlayHtml = (rooms: RoomInfo[]) => {
	if (!EL.contentPong)
		return ;

	let listHTML = `<div class="${TCS.pongNav1}"><ul>`;

	rooms.forEach((room: RoomInfo) => {
		listHTML += `
		<li class="flex-1" class="${TCS.pongButton}">
			<a href="/pong/tournament/room/${room.id}" class="${TCS.pongButton}">
				Id: ${room.id} Full: ${room.full} Solo: ${room.isSolo} Bot: ${room.isBot}
			</a>
		</li>`;
	});
	listHTML += '</ul></div>';
	EL.contentPong.innerHTML = listHTML;
}

const   pongVersusPrivateHtml = (inviteCode: string) => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><h1 class="${TCS.pongText}">Private Room</h1></div>
		<div class="flex-1"><h2 class="${TCS.pongText}">Here is your Invite Code: ${inviteCode}</h2></div>
		<div class="flex-1"><button id="quit" class="${TCS.pongButton}">Quit Room</button></div>
	</div>`;
}

const   pongVersusJoinPrivRoomHtml = () => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><h1 class="${TCS.pongText}">Please enter your invite code:</h1></div>
		<form id="inviteForm" class="flex-1">
			<input type="text" id="inviteCode" placeholder="Invite Code" class="${TCS.pongButton}">
			<button type="submit" id="submit" class="${TCS.pongButton}">Submit</button>
		</form>
		<div class="flex-1"><button id="back" class="${TCS.pongButton}">Back</button></div>
	</div>`;
}

const pongVersusListHtml = (rooms: RoomInfo[]) => {
	if (!EL.contentPong)
		return ;

	let listHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><button id="back" class="${TCS.pongButton}">Back</button></div>
		<div class="flex-1"><ul>`;

	rooms.forEach((room: RoomInfo) => {
		if (!room.privRoom && !room.isSolo) {
			listHTML += `
			<li class="flex-1" class="${TCS.pongButton}">
				<a href="/pong/room/${room.id}" class="${TCS.pongButton}">
				Id: ${room.id}
				</a>
		    </li>`};
	});
	listHTML += '</ul></div>';
	EL.contentPong.innerHTML = listHTML;
}

const PongTournamentListHtml = (tournaments: TournamentInfo[]) => {
	if (!EL.contentPong)
		return ;

	let listHTML = `
	<div class="${TCS.pongNav1}">
		<ul>`;
	tournaments.forEach((tournament: TournamentInfo) => {
		listHTML += `
		  <li class="flex-1" class="${TCS.pongButton}">
			<a href="/pong/tournament/${tournament.id}" class="${TCS.pongButton}">
			  Id: ${tournament.id} Name: ${tournament.name}, Started: ${tournament.started}
			</a>
		  </li>`;
	});
	listHTML += `
		</ul>
		<div class="flex-1"><button id="back" class="${TCS.pongButton}">Back</button></div>
	</div>`;
	EL.contentPong.innerHTML = listHTML;
}

const   pongTournamentNameHtml = () => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><p class="${TCS.pongText}">Enter the name of the tournament</p></div>
		<form class="flex-1">
			<input type="text" id="tournamentName" placeholder="Tournament Name" class="${TCS.pongButton}">
			<button id="submit" class="${TCS.pongButton}">Submit</button>
		</form>
		<div class="flex-1"><button id="back" class="${TCS.pongButton} pb-[30px]">Back</button></div>
	</div>`;
}

const   pongTournamentEndPage = (winner: number) => {
	if (!EL.contentPong)
		return ;

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><button id="home" class="${TCS.pongButton}">Home</button></div>
		<div class="flex-1"><h1 class="${TCS.pongText}">Tournament Over</h1></div>
		<div class="flex-1"><p class="${TCS.pongText}">Winner: Player ${winner}</p></div>
	</div>`;
}

const   pongTournamentFoundHtml = () => {
	if (!EL.contentPong)
		return ;
	if (!pongGameInfo.getTournament())
		return ;

	EL.contentPong.innerHTML= `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><p class="${TCS.pongText}">Tournament found!</p></div>
		<div class="flex-1"><button id="quit" class="${TCS.pongButton}">Quit Tournament</button></div>`;
	if (pongGameInfo.getTournament()?.getIsOwner()) {
		EL.contentPong.innerHTML += `
		<div class="flex-1"><button id="start-tournament" class="${TCS.pongButton}">Start Tournament</button></div>
		<div class="flex-1"><button id="shuffle-tree" class="${TCS.pongButton}">Shuffle Tree</button></div>`;
	}
	EL.contentPong.innerHTML += `</div>`;
}


// TODO: Add spec tournament board

const   pongDrawBoardHtml = () => {
	if (!EL.contentPong)
		return

	// TODO quid du quit
	EL.contentPong.innerHTML = `
	<div class="flex flex-col">
		<div class="flex justify-end mb-4">
			<button id="quit" class="${TCS.pongButton}">Quit</button>
		</div>
		<canvas id="pongCanvas" width="800" height="400" class="${TCS.pongCanvas}"></canvas>
	</div>`;

	// TODO: move this in correct place
	const quitButton = document.getElementById("quit") as HTMLButtonElement;
	if (!quitButton)
		return ;
	quitButton.addEventListener("click", () => {
		page("/pong/solo");
		// TODO quit server game ?
	});
}

const   pongJoinConfirmPageHtml = () => {
	if (!EL.contentPong)
		return ;

	// TODO: Add quit button

	EL.contentPong.innerHTML = `
	<div class="${TCS.pongNav1}">
		<div class="flex-1"><p>Game Found, Confirm?</p></div>
		<div class="flex-1"><button id="confirm-game" class="${TCS.pongButton}">Confirm Game</button></div>
		<div class="flex-1"><p id="timer">Time remaining: 10s</p></div>
	</div>`;
}
