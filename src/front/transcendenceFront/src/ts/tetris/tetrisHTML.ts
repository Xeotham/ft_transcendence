import { EL } from "../zone/zoneHTML.ts";
import { TCS } from "../TCS.ts";
import { imTexts } from "../imTexts/imTexts.ts";
import { showZoneGame } from "../zone/zoneCore.ts";
import { forfeit } from "./gameManagement.ts";
import img_logo_tetris from '/src/medias/images/zones/logoTetris.png';

export const   tetrisEmptyHtml = () => {
	if (!EL.contentTetris)
		return ;
	EL.contentTetris.innerHTML = '';
}

export const tetrisLogoHtml = () => {
	if (!EL.contentTetris)
		return;

	EL.contentTetris.innerHTML = `
		<div class="w-full h-full m-40 flex justify-center items-center">
			<img id="logoTetris" src="${img_logo_tetris}" alt="tetris" class="w-full h-auto" />
		</div>
	`;
}

export const tetrisIdleHtml = () => {
	if (!EL.contentTetris)
		return;

	EL.contentTetris.innerHTML = `
	<div class="tetris">
		<nav class="${TCS.tetrisNav0}">
			<div id="tetris" class="${TCS.tetrisTitre} flex-1">${imTexts.tetrisNavTitle}</div>
			<div class="flex-1"><button id="arcade" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavSolo}</button></div>
			<div class="flex-1"><button id="matchmaking" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavVersus}</button></div>
			<div class="flex-1"><button id="get-multiplayer-rooms" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavJoin}</button></div>
			<div class="flex-1"><button id="create-room" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavCreate}</button></div>
			<div class="flex-1"><button id="setting" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavSettings}</button></div>
			<div class="flex-1"><button id="home" class="${TCS.tetrisNavButton}">${imTexts.tetrisNavHome}</button></div>
		</nav>
	</div>`

	tetrisQuitButton();
}

export const tetrisBoardHtml = () => {
	if (!EL.zoneGame) {
		return;
	}

	showZoneGame();

	EL.zoneGame.innerHTML = `

	<div class="absolute z-50 w-full h-full">

		<div class="absolute z-50 top-[10px] right-[10px]">
			<button class="${TCS.pongButton}" id="quit">Quit</button>
		</div>

		<div class="absolute z-10 align-center justify-center"> Incoming Garbage: 0</div>
		<div class="absolute z-30 text-right text-[20px] font-pixelcode text-lime-50 text-shadow-lg/100 bg-stone-950/20" id="scoreDiv"></div>
		<div class="absolute z-30 text-right text-[20px] font-pixelcode text-lime-50 text-shadow-lg/100 bg-stone-950/20" id="levelDiv"></div>
		<div class="absolute z-30 text-right text-[20px] font-pixelcode text-lime-50 text-shadow-lg/100 bg-stone-950/20" id="timeDiv"></div>
		<div class="absolute z-30 text-right text-[20px] font-pixelcode text-lime-50 text-shadow-lg/100 bg-stone-950/20" id="goalDiv"></div>
		<div class="absolute z-30 text-right text-[20px] font-pixelcode text-lime-50 text-shadow-lg/100 bg-stone-950/20" id="piecesDiv"></div>

		<div class=" ${TCS.tetrisEndGame}" id="endGame">
		</div>

		<div id="board" class="absolute z-25 w-full h-full flex items-center justify-center bg-black">		
			<canvas id="tetrisCanvas" width="${window.innerWidth}" height="${window.innerHeight}"></canvas>
		</div>

	</div>`;

	tetrisQuitButton();
}

const   tetrisQuitButton = () => {
	const quitButton = document.getElementById("quit") as HTMLButtonElement;

	if (!quitButton)
		return ;

	quitButton.addEventListener("click", () => {
		forfeit();
	});
}
