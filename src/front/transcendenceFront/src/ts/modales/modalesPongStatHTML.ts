import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay } from './modalesCore.ts';
import {getFromApi} from "../utils.ts";
import {address, user} from "../immanence.ts";

let pongStatPage = 0;

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

interface gameHistory {
  gameId: number,
  username: string,
  date: string,
  score: number,
  winner: boolean,
  type: string }


let pongHistory: pongStats[] = []

// const formatPongStat = (gameId: number, history: { gameId: number, username: string, date: string, score: number, winner: boolean, type: string }[]) => {
const formatPongStat = (history:{  gameId: number, players: GameUserInfo[] } ) => {
  let stat: pongStats = {date: '', username: '', opponent: '', score: 0, scoreOpponent: 0, winner: false};
  const game1 = history.players[0];
  const game2 = history.players[1];
  if (!game1 || !game2) {
    return null;
  }
  stat.date = game1.date;
  stat.username = user.getUsername();
  stat.opponent = game1.username === user.getUsername() ? game2.username : game1.username;
  stat.score = game1.username === user.getUsername() ? game1.score : game2.score;
  stat.scoreOpponent = game1.username === user.getUsername() ? game2.score : game1.score;
  stat.winner = game1.username === user.getUsername() ? game1.winner : game2.winner;
  return stat;

}

export const  loadPongStat = async () => {
  const get: any = await  getFromApi(`http://${address}/api/user/get-game-history?username=${user.getUsername()}`);
  const history: { gameId: number, players: GameUserInfo[] }[] = get.history;
  history.filter((e) => e.players[0].type !== 'pong');
  console.log(history);
  const newHistory: pongStats[] = [];
  history.forEach((game) => {
    if (game.players.length < 2) {
      return;
    }
    const stat = formatPongStat(game);
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
    let formattedStat = `${stat.date} - `;
    formattedStat += stat.winner ? "<span class='text-green-500'>" : "<span class='text-red-500'>"
    formattedStat += `${stat.score}/${stat.scoreOpponent}</span> - ${stat.opponent}`;
    return formattedStat;
}

const getModalePongStatListHTML = (page: number) => {

  let listHTML = ``;

  console.log("getModalePongStatListHTML", page); // TODO: enlever

  for (let i = 0; i < 10 && pongHistory[(page * 10) + i]; i++) {
    listHTML += `
      <div id="pongStatLine${i}" class="${TCS.modaleTexte}">
      ${formatPongStatLine(i + (page * 10))}</div>
    `;
  }

  listHTML += `  <div class="h-[10px]"></div>

  <div id="PongStatsPrevNext" class="${TCS.modaleTexte}">
    <a id="PongStatsPrev" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesPongStatsPrev}</a>
    /
    <a id="PongStatsNext" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesPongStatsNext}</a>
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
    if (pongStatPage <= 0)
      return;
    modalePongStatHTML(--pongStatPage);
  });

  PongStatsNext.addEventListener('click', () => {
    if (pongStatPage >= 10) // TODO: remplacer par le nombre de pages
      return;
    modalePongStatHTML(++pongStatPage);
  });
}
