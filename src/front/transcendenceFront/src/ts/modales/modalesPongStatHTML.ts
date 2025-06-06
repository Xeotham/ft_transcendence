import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import {ModaleType, modaleDisplay, modale} from './modalesCore.ts';
import {getFromApi,address} from "../utils.ts";


let pongStatPage = 0;
const pongListLength = 10;
interface pongStats {
  date: string;
  username: string;
  opponent: string;
  score: number;
  scoreOpponent: number;
  winner: boolean;
}

interface GameUserInfo
{
  date: 	 string;
  username : string;
  userId: number;
  score: 	number;
  winner: boolean;
  type: 	string;
}

let pongHistory: pongStats[] = []

const formatPongStat = (history:{  gameId: number, players: GameUserInfo[] }, playerUsername: string ) => {
  let stat: pongStats = {date: '', username: '', opponent: '', score: 0, scoreOpponent: 0, winner: false};
  const game1 = history.players[0];
  const game2 = history.players[1];
  if (!game1 || !game2) {
    return null;
  }

  stat.date = game1.date;
  stat.username = playerUsername;
  stat.opponent = game1.username === playerUsername ? game2.username : game1.username;
  stat.score = game1.username === playerUsername ? game1.score : game2.score;
  stat.scoreOpponent = game1.username === playerUsername ? game2.score : game1.score;
  stat.winner = game1.username === playerUsername ? game1.winner : game2.winner;
  return stat;

}

export const  loadPongStat = async (playerUsername: string) => {
  const get: any = await  getFromApi(`http://${address}/api/user/get-game-history?username=${playerUsername}`);
  const history: { gameId: number, players: GameUserInfo[] }[] = get.history.filter((e: any) => e.players[0].type === 'pong');
  const newHistory: pongStats[] = [];
  history.forEach((game) => {
    if (game.players.length < 2) {
      return;
    }
    const stat = formatPongStat(game, playerUsername);
    if (stat) {
      newHistory.push(stat);
    }
  })
  pongHistory = newHistory;
}

export const modalePongStatHTML = (page: number) => {

  pongStatPage = page;

  let PongStatHTML =`
    <div id="PongStatsTitle" class="${TCS.modaleTitre}">
    ${imTexts.modalesPongStatsTitle}</div>

    <div id="PongStatsBack" class="${TCS.modaleTexteLink}">
      ${imTexts.modalesPongStatsBack}</div>

    <div class="h-[30px]"></div>
  `;

  PongStatHTML += modalePongStatDataViz();

  PongStatHTML += getModalePongStatListHTML(pongStatPage);

  PongStatHTML += `
    <div class="h-[30px]"></div>
  </div>
  `;

  return PongStatHTML;
}

const formatPongStatLine = (index: number) => {
    const stat = pongHistory[index];
    if (!stat)
      return '';
    let formattedStat = `<span class='text-stone-400'>${stat.date}</span> - `;
    formattedStat += stat.winner ? "<span class='text-green-500'>" : "<span class='text-red-500'>"
    formattedStat += `${stat.score}/${stat.scoreOpponent}</span> - ${stat.opponent}`;
    return formattedStat;
}

const getModalePongStatListHTML = (page: number) => {

  let listHTML = ``;

  for (let i = 0; i < pongListLength && pongHistory[(page * pongListLength) + i]; i++) {
    listHTML += `
      <div id="pongStatLine${i}" class="${TCS.modaleTexte}">
      ${formatPongStatLine(i + (page * pongListLength))}</div>
    `;
  }

  listHTML += `  <div class="h-[10px]"></div>

  <span id="PongStatsPrevNext" class="${TCS.modaleTexte}">
    <span id="PongPrev"><a id="PongStatsPrev" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesPongStatsPrev}</a></span>
    <span id="PongSlash">/</span>
    <span id="PongNext"><a id="PongStatsNext" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesPongStatsNext}</a></span>
  </div>`;

  listHTML += `
  <div class="h-[10px]"></div>
  `;

  return listHTML;
}

export const modalePongStatEvents = () => {

  const PongStatsBack = document.getElementById('PongStatsBack') as HTMLAnchorElement;
  const PongStatsPrev = document.getElementById('PongStatsPrev') as HTMLAnchorElement;
  const PongStatsNext = document.getElementById('PongStatsNext') as HTMLAnchorElement;

  if (!PongStatsBack || !PongStatsPrev || !PongStatsNext)
    return;

  PongStatsBack.addEventListener('click', () => {
    modaleDisplay(ModaleType.PROFILE);
  });

  PongStatsPrev.addEventListener('click', () => {
    if (pongStatPage <= 0 || !modale.content)
      return;
    modale.content.innerHTML = modalePongStatHTML(--pongStatPage);
    modaleDislpayPrevNextPong();
    modalePongStatEvents();
  });

  PongStatsNext.addEventListener('click', () => {
    if (pongStatPage >= pongListLength || !modale.content)
      return;
    if ((pongStatPage + 1) * pongListLength < pongHistory.length)
    {
      modale.content.innerHTML = modalePongStatHTML(++pongStatPage);
      modaleDislpayPrevNextPong();
      modalePongStatEvents();
    }
  });
}

export const modaleFriendPongStatEvents = () => {

  const PongStatsBack = document.getElementById('PongStatsBack') as HTMLAnchorElement;
  const PongStatsPrev = document.getElementById('PongStatsPrev') as HTMLAnchorElement;
  const PongStatsNext = document.getElementById('PongStatsNext') as HTMLAnchorElement;

  if (!PongStatsBack || !PongStatsPrev || !PongStatsNext)
    return;

  PongStatsBack.addEventListener('click', () => {
    modaleDisplay(ModaleType.FRIEND_PROFILE);
  });

  PongStatsPrev.addEventListener('click', () => {
    if (pongStatPage <= 0 || !modale.content)
      return;
    modale.content.innerHTML = modalePongStatHTML(--pongStatPage);
    modaleDislpayPrevNextPong();
    modaleFriendPongStatEvents();
  });

  PongStatsNext.addEventListener('click', () => {
    if (pongStatPage >= pongListLength || !modale.content)
      return;
    if ((pongStatPage + 1) * pongListLength < pongHistory.length)
    {
      modale.content.innerHTML = modalePongStatHTML(++pongStatPage);
      modaleDislpayPrevNextPong();
      modaleFriendPongStatEvents();
    }
  });
}

export const modaleDislpayPrevNextPong = () => {

  const prev = document.getElementById('PongPrev');
  const next = document.getElementById('PongNext');
  const slash = document.getElementById('PongSlash');

  const isNext = pongHistory.length - (pongStatPage * pongListLength) > pongListLength;

  if (!isNext)
    next?.classList.add('hidden');
  if (pongStatPage === 0)
    prev?.classList.add('hidden');
  if (!isNext || pongStatPage === 0)
    slash?.classList.add('hidden');

}

const modalePongStatDataViz = () => {


  let dataVizHTML = `

  `;

  return dataVizHTML;
}
