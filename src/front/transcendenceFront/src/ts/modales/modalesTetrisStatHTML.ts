import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import {ModaleType, modaleDisplay, modale} from './modalesCore.ts';
import {getFromApi} from "../utils.ts";
import {address, user} from "../immanence.ts";
import {modalePongStatHTML} from "./modalesPongStatHTML.ts";

let tetrisStatPage = 0;
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
  maxB2b: number;
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

const formatTetrisStat = (history:{  gameId: number, players: GameUserInfo[] } ) => {
  let stat: tetrisStats = {id: 0, date: '', username: '', score: 0 };
  const players: GameUserInfo[] = history.players;
  if (!players || !players.length) {
    return null;
  }
  stat.id = history.gameId;
  stat.date = players[0].date;
  stat.username = user.getUsername();
  history.players.forEach(player => {
    if (player.username === stat.username)
      stat.score = player.score;
  });
  return stat;

}

export const  loadTetrisStat = async () => {
  const get: any = await  getFromApi(`http://${address}/api/user/get-game-history?username=${user.getUsername()}`);
  const history: { gameId: number, players: GameUserInfo[] }[] = get.history;
  history.filter((e) => e.players[0].type !== 'tetris');
  tetrisGames = history;
  const newHistory: tetrisStats[] = [];
  history.forEach((game) => {
    if (!game.players.length) {
      return;
    }
    const stat = formatTetrisStat(game);
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
  let formattedStat = `${stat.date.slice(0,10)} - `;
  formattedStat += `${stat.score} pts`;
  console.log(formattedStat);
  return formattedStat;
}


const getModaleTetrisStatListHTML = (page: number) => {

  let listHTML = ``;

  console.log("getModaleTetrisStatListHTML", page); // TODO: enlever

  for (let i = 0; i < 10 && tetrisHistory[(page * 10) + i]; i++) {
    listHTML += `
      <div id="tetrisStatLine${i}" class="${TCS.modaleTexte}">
      ${formatTetrisStatLine(i + (page * 10))}</div>
    `;
  }
  listHTML += `  <div class="h-[10px]"></div>

  <div id="TetrisStatsPrevNext" class="${TCS.modaleTexte}">
    <a id="TetrisStatsPrev" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsPrev}</a>
    /
    <a id="TetrisStatsNext" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsNext}</a>
  </div>`;

  listHTML += `
  <div class="h-[10px]"></div>
  `;

  return listHTML;
}
  // listHTML += `
  //   <div id="tetrisBestScore" class="${TCS.modaleTexte}">
  //   ${imTexts.modalesTetrisStatsBestScore}</div>
  //
  //   <div class="h-[30px]"></div>
  // `;
  //
  // for (let i = 0; i < 10; i++) {
  //   listHTML += `
  //   <div id="tetrisStatsLine${i}" class="${TCS.modaleTexte}">
  //     ${imTexts[`modalesTetrisStatsLine${i}`]}
  //     <a id="tetrisStatsLineLink${i}" class="${TCS.modaleTexteLink}">
  //     ${imTexts.modalesTetrisStatsLinkName}
  //     </a></div>
  //   `;
  // }

  // listHTML += `
  // <div class="h-[10px]"></div>
  // `
  // listHTML += `
  // <div id="tetrisStatsPrevNext" class="${TCS.modaleTexte}">
  //   <a id="tetrisStatsPrev" class="${TCS.modaleTexteLink}">
  //   ${imTexts.modalesTetrisStatsPrev}</a>
  //   /
  //   <a id="tetrisStatsNext" class="${TCS.modaleTexteLink}">
  //   ${imTexts.modalesTetrisStatsNext}</a>
  // </div>
  // `;
  //
  // return listHTML;
// }
//
// export const modaleTetrisStatEvents = () => {
//   const tetrisStatsBack = document.getElementById('tetrisStatsBack') as HTMLAnchorElement;
//   const tetrisStatsPrev = document.getElementById('tetrisStatsPrev') as HTMLAnchorElement;
//   const tetrisStatsNext = document.getElementById('tetrisStatsNext') as HTMLAnchorElement;
//
//   if (!tetrisStatsBack || !tetrisStatsPrev || !tetrisStatsNext)
//     return;
//
//
//   tetrisStatsBack.addEventListener('click', () => {
//     console.log('tetrisStatsBack');
//     modaleDisplay(ModaleType.PROFILE);
//     modaleTetrisStatLineEvents();
//   });
//
//   tetrisStatsPrev.addEventListener('click', () => {
//     if (tetrisStatPage <= 0)
//       return;
//     modaleTetrisStatHTML(--tetrisStatPage);
//     modaleTetrisStatLineEvents();
//   });
//
//   tetrisStatsNext.addEventListener('click', () => {
//     if (tetrisStatPage >= 10) // TODO: remplacer par le nombre de pages
//       return;
//     modaleTetrisStatHTML(++tetrisStatPage);
//   });
// }

export const modaleTetrisStatLineEvents = () => {

  for (let i = 0; i < 10 && tetrisHistory[(tetrisStatPage * 10) + i]; i++) {
    // listHTML += `
    //   <div id="tetrisStatLine${i}" class="${TCS.modaleTexte}">
    //   ${formatTetrisStatLine(i + (page * 10))}</div>
    // `;
    const tetrisStatsLine = document.getElementById(`tetrisStatLine${i}`) as HTMLAnchorElement;
    tetrisStatsLine?.addEventListener('click', () => {
      let index = Number(tetrisStatsLine.id.slice(14, tetrisStatsLine.id.length));
      index += (tetrisStatPage * 10);
      indexGame = index;
      console.log("INDEXXXXX", index);
       modaleDisplay(ModaleType.TETRIS_STATS_DETAIL);
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
    if (tetrisStatPage <= 0)
      return;
    modale.content.innerHTML = modaleTetrisStatHTML(--tetrisStatPage);
    modaleTetrisStatEvents();
    modaleTetrisStatLineEvents();
  });

  TetrisStatsNext.addEventListener('click', () => {
    if (tetrisStatPage >= 10) // TODO: remplacer par le nombre de pages
      return;
    if ((tetrisStatPage + 1) * 10 < tetrisHistory.length)
    {
      modale.content.innerHTML = modaleTetrisStatHTML(++tetrisStatPage);
      modaleTetrisStatEvents();
      modaleTetrisStatLineEvents();
    }
  });
}