import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay, modale } from './modalesCore.ts';
import { getFromApi, address } from "../utils.ts";

let 	tetrisStatPage = 0;
const 	tetrisListLength = 10;

let tetrisHistory: tetrisStats[] = []
export let indexGame: number = 0;
export let tetrisGames: { gameId: number, players: GameUserInfo[] }[];

interface tetrisStats {
	id: number;
	date: string;
	username: string;
	score: number;
}

interface GameUserInfo
{
	date: 	 string;
	totalTime: 	number;
	username?: string;
	userId: number;
	score: 	number;
	winner: boolean;
	type: 	string;
	maxCombo: number;
	piecesPlaced: number;
	piecesPerSecond: number;
	attacksSent: number;
	attacksSentPerMinute: number;
	attacksReceived: number;
	attacksReceivedPerMinute: number;
	keysPressed: number;
	keysPerPiece: number;
	keysPerSecond: number;
	holds: number;
	linesCleared: number;
	linesPerMinute: number;
	maxB2B: number;
	perfectClears: number;
	single: number;
	double: number;
	triple: number;
	quad: number;
	tspinZero: number;
	tspinSingle: number;
	tspinDouble: number;
	tspinTriple: number;
	tspinQuad: number;
	miniTspinZero: number;
	miniTspinSingle: number;
	miniSpinZero: number;
	miniSpinSingle: number;
	miniSpinDouble: number;
	miniSpinTriple: number;
	miniSpinQuad: number;
}

const formatTetrisStat = (history:{  gameId: number, players: GameUserInfo[] }, playerUsername: string ) => {
	let stat: tetrisStats = {id: 0, date: '', username: '', score: 0 };
	const players: GameUserInfo[] = history.players;
	if (!players || !players.length) {
		return null;
	}
	stat.id = history.gameId;
	stat.date = players[0].date;
	stat.username = playerUsername;
	history.players.forEach(player => {
		if (player.username === stat.username)
			stat.score = player.score;
	});
	return stat;

}

export const  loadTetrisStat = async (playerUsername: string) => {
	const get: any = await  getFromApi(`http://${address}/api/user/get-game-history?username=${playerUsername}`);
	const history: { gameId: number, players: GameUserInfo[] }[] = get.history.filter((e :any)  => e.players[0].type === 'tetris');
	tetrisGames = history;
	const newHistory: tetrisStats[] = [];
	history.forEach((game) => {
		if (!game.players.length) {
			return;
		}
		const stat = formatTetrisStat(game, playerUsername);
		if (stat) {
			newHistory.push(stat);
		}
	})
	tetrisHistory = newHistory;
}

export const modaleTetrisStatHTML = (page: number) => {

	tetrisStatPage = page;

	let TetrisStatHTML = `
  <div id="TetrisStatsTitle" class="${TCS.modaleTitre}">
  ${imTexts.modalesTetrisStatsTitle}</div>

  <div id="TetrisStatsBack" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsBack}</div>

  <div class="h-[30px]"></div>
  `;

	TetrisStatHTML += getModaleTetrisStatListHTML(tetrisStatPage);

	TetrisStatHTML += `
    <div class="h-[30px]"></div>
  `;

	return TetrisStatHTML;
}



const formatTetrisStatLine = (index: number) => {
	const stat = tetrisHistory[index];
	if (!stat)
		return '';
	let formattedStat = `<span class="${TCS.modaleTexteGris}">${stat.date} &nbsp;&nbsp;</span>`;
	formattedStat += `<span class="${TCS.modaleTexte}">${stat.score} pts</span>`;
	return formattedStat;
}


const getModaleTetrisStatListHTML = (page: number) => {

	let listHTML = ``;

	for (let i = 0; i < tetrisListLength && tetrisHistory[(page * tetrisListLength) + i]; i++) {
		listHTML += `
      <div id="tetrisStatLine${i}" class="${TCS.modaleFriendList}">
      ${formatTetrisStatLine(i + (page * tetrisListLength))}</div>
    `;
	}
	listHTML += `  <div class="h-[10px]"></div>

  <span id="TetrisStatsPrevNext" class="${TCS.modaleTexte}">
    <span id="TetrisPrev"><a id="TetrisStatsPrev" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsPrev}</a></span>
    <span id="TetrisSlash">/</span>
    <span id="TetrisNext"><a id="TetrisStatsNext" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsNext}</a></span>
  </div>
`;

	listHTML += `
  <div class="h-[10px]"></div>
  `;

	return listHTML;
}

export const modaleTetrisStatLineEvents = () => {

	for (let i = 0; i < tetrisListLength && tetrisHistory[(tetrisStatPage * tetrisListLength) + i]; i++) {
		const tetrisStatsLine = document.getElementById(`tetrisStatLine${i}`) as HTMLAnchorElement;
		tetrisStatsLine?.addEventListener('click', () => {
			let index = Number(tetrisStatsLine.id.slice(14, tetrisStatsLine.id.length));
			index += (tetrisStatPage * tetrisListLength);
			indexGame = index;
			modaleDisplay(ModaleType.TETRIS_STATS_DETAIL);
		})
	}
}

export const modaleFriendTetrisStatLineEvents = () => {

	for (let i = 0; i < tetrisListLength && tetrisHistory[(tetrisStatPage * tetrisListLength) + i]; i++) {
		const tetrisStatsLine = document.getElementById(`tetrisStatLine${i}`) as HTMLAnchorElement;
		tetrisStatsLine?.addEventListener('click', () => {
			let index = Number(tetrisStatsLine.id.slice(14, tetrisStatsLine.id.length));
			index += (tetrisStatPage * tetrisListLength);
			indexGame = index;
			modaleDisplay(ModaleType.FRIEND_TETRIS_STATS_DETAIL);
		})
	}
}

export const modaleTetrisStatEvents = () => {

	const TetrisStatsBack = document.getElementById('TetrisStatsBack') as HTMLAnchorElement;
	const TetrisStatsPrev = document.getElementById('TetrisStatsPrev') as HTMLAnchorElement;
	const TetrisStatsNext = document.getElementById('TetrisStatsNext') as HTMLAnchorElement;

	if (!TetrisStatsBack || !TetrisStatsPrev || !TetrisStatsNext)
		return;


	TetrisStatsBack.addEventListener('click', () => {
		modaleDisplay(ModaleType.PROFILE);
	});

	TetrisStatsPrev.addEventListener('click', () => {
		if (tetrisStatPage <= 0 || !modale.content)
			return;
		modale.content.innerHTML = modaleTetrisStatHTML(--tetrisStatPage);
		modaleDislpayPrevNextTetris();
		modaleTetrisStatEvents();
		modaleTetrisStatLineEvents();
	});

	TetrisStatsNext.addEventListener('click', () => {
		if (tetrisStatPage >= tetrisListLength || !modale.content) // TODO: remplacer par le nombre de pages
			return;
		if ((tetrisStatPage + 1) * tetrisListLength < tetrisHistory.length)
		{
			modale.content.innerHTML = modaleTetrisStatHTML(++tetrisStatPage);
			modaleDislpayPrevNextTetris();
			modaleTetrisStatEvents();
			modaleTetrisStatLineEvents();
		}
	});
}

export const modaleFriendTetrisStatEvents = () => {

	const TetrisStatsBack = document.getElementById('TetrisStatsBack') as HTMLAnchorElement;
	const TetrisStatsPrev = document.getElementById('TetrisStatsPrev') as HTMLAnchorElement;
	const TetrisStatsNext = document.getElementById('TetrisStatsNext') as HTMLAnchorElement;

	if (!TetrisStatsBack || !TetrisStatsPrev || !TetrisStatsNext)
		return;


	TetrisStatsBack?.addEventListener('click', () => {
		modaleDisplay(ModaleType.FRIEND_PROFILE);
	});
	TetrisStatsPrev?.addEventListener('click', () => {
		if (tetrisStatPage <= 0 || !modale.content)
			return;
		modale.content.innerHTML = modaleTetrisStatHTML(--tetrisStatPage);
		modaleDislpayPrevNextTetris();
		modaleFriendTetrisStatEvents();
		modaleFriendTetrisStatLineEvents();
	});

	TetrisStatsNext?.addEventListener('click', () => {
		if (tetrisStatPage >= tetrisListLength || !modale.content) // TODO: remplacer par le nombre de pages
			return;
		if ((tetrisStatPage + 1) * tetrisListLength < tetrisHistory.length)
		{
			modale.content.innerHTML = modaleTetrisStatHTML(++tetrisStatPage);
			modaleDislpayPrevNextTetris();
			modaleFriendTetrisStatEvents();
			modaleFriendTetrisStatLineEvents();
		}
	});
}

export const modaleDislpayPrevNextTetris = () => {

	const prev = document.getElementById('TetrisPrev');
	const next = document.getElementById('TetrisNext');
	const slash = document.getElementById('TetrisSlash');

	const isNext = tetrisHistory.length - (tetrisStatPage * tetrisListLength) > tetrisListLength;

	if (!isNext)
		next?.classList.add('hidden');
	if (tetrisStatPage==0)
		prev?.classList.add('hidden');
	if (!isNext || tetrisStatPage==0)
		slash?.classList.add('hidden');
}
