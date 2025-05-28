import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay } from './modalesCore.ts';
import {getFromApi} from "../utils.ts";
import {address, user} from "../immanence.ts";
import {modalePongStatHTML} from "./modalesPongStatHTML.ts";

let tetrisStatPage = 0;

interface tetrisStats {
  date: string;
  username: string;
  score: number;
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

const formatTetrisStat = (history:{  gameId: number, players: GameUserInfo[] } ) => {
  let stat: tetrisStats = { date: '', username: '', score: 0 };
  const players: GameUserInfo[] = history.players;
  if (!players || !players.length) {
    return null;
  }
  stat.date = players[0].date;
  stat.username = user.getUsername();
  history.players.forEach(player => {
    if (player.username === stat.username)
      stat.score = player.score;
  });

  console.log(stat);
  return stat;

}

export const  loadTetrisStat = async () => {
  const get: any = await  getFromApi(`http://${address}/api/user/get-game-history?username=${user.getUsername()}`);
  const history: { gameId: number, players: GameUserInfo[] }[] = get.history;
  history.filter((e) => e.players[0].type !== 'tetris');
  console.log(history);
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
  <div id="tetrisStatsTitle" class="${TCS.modaleTitre}">
  ${imTexts.modalesTetrisStatsTitle}</div>

  <div id="tetrisStatsBack" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsBack}</div>

  <div class="h-[30px]"></div>
  `;

  TetrisStatHTML += getModaleTetrisStatListHTML(tetrisStatPage);

  TetrisStatHTML += `
    <div class="h-[30px]"></div>
  `;

  return TetrisStatHTML;
}

let tetrisHistory: tetrisStats[] = []

const formatTetrisStatLine = (index: number) => {
  const stat = tetrisHistory[index];
  if (!stat)
    return '';
  let formattedStat = `${stat.date} - `;
  formattedStat += `${stat.score}`;
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

// export const modaleTetrisStatLineEvents = () => {
//
//   for (let i = 0; i < 10; i++) {
//     const tetrisStatsLine = document.getElementById(`tetrisStatsLine${i}`) as HTMLAnchorElement;
//     if (!tetrisStatsLine)
//       return;
//     tetrisStatsLine.addEventListener('click', () => {
//       modaleDisplay(ModaleType.TETRIS_STATS_DETAIL);
//     });
//   }
// }

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
    modaleTetrisStatHTML(--tetrisStatPage);
  });

  TetrisStatsNext.addEventListener('click', () => {
    if (tetrisStatPage >= 10) // TODO: remplacer par le nombre de pages
      return;
    if ((tetrisStatPage + 1) * 10 <= tetrisHistory.length)
      modaleTetrisStatHTML(++tetrisStatPage);
  });
}