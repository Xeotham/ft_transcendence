import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { modaleDisplay } from './modalesCore.ts';
import { ModaleType } from './modalesCore.ts';
import { tetrisGames } from "./modalesTetrisStatHTML.ts";

interface GameUserInfo
{
  level:      string,
  isInRoom:   boolean;
  date:       string;
  totalTime:  number;
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

const getModaleTetrisStatListDetailsHTML = (gameIndex: number, playerUsername: string) => {
  const game = tetrisGames[gameIndex];
  const player = game.player;


  let listHTML = `
  <div id="tetrisStatsDetailText" class="${TCS.modaleStatDetail}">
    <div class="grid grid-cols-6 gap-[2px]">

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Date: </div>
      <div class="col-span-4">${player?.date}</div>

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Score: </div>
      <div class="col-span-4">${player?.score}</div>

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Total Time: </div>
      <div class="col-span-4">${player?.totalTime}</div>
      
      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Level: </div>
      <div class="col-span-4">${player?.level}</div>

      <div class="col-span-6 h-[5px]"></div>

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Max Combo: </div>
      <div class="col-span-4">${player?.maxCombo}</div>

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Max B2B: </div>
      <div class="col-span-4">${player?.maxB2B}</div>

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Perfect Clears: </div>
      <div class="col-span-4">${player?.perfectClears}</div>

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Pieces: </div>
      <div class="col-span-4">${player?.piecesPlaced} placed | ${player?.piecesPerSecond}/s</div>

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Attacks Sent: </div>
      <div class="col-span-4">${player?.attacksSent} | ${player?.attacksSentPerMinute}/min</div>

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Attacks Received: </div>
      <div class="col-span-4">${player?.attacksReceived} | ${player?.attacksReceivedPerMinute}/min</div>

      <div class="col-span-6 h-[5px]"></div>

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Keys: </div>
      <div class="col-span-4">${player?.keysPressed} pressed | ${player?.keysPerPiece}/pieces | ${player?.keysPerSecond}/s</div>

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Holds: </div>
      <div class="col-span-4">${player?.holds}</div>

      <div class="col-span-2 ${TCS.modaleStatDetailGrey}">Lines: </div>
      <div class="col-span-4">${player?.linesCleared} cleared | ${player?.linesPerMinute}/min</div>

    </div>

    <div class="h-[20px]"></div>

    <div class="grid grid-cols-6">

      <div class="${TCS.modaleStatDetailGrey} ${TCS.statRow1}">TYPE</div>
      <div class="${TCS.modaleStatDetailGrey} ${TCS.statCol1}">Zero</div>
      <div class="${TCS.modaleStatDetailGrey} ${TCS.statCol1}">Single</div>
      <div class="${TCS.modaleStatDetailGrey} ${TCS.statCol1}">Double</div>
      <div class="${TCS.modaleStatDetailGrey} ${TCS.statCol1}">Triple</div>
      <div class="${TCS.modaleStatDetailGrey} ${TCS.statCol1}">Quad</div>

      <div class="${TCS.modaleStatDetailGrey}">Clears</div>
      <div class="${TCS.modaleStatDetail}">X</div>
      <div class="${TCS.modaleStatDetail}">${player?.single}</div>
      <div class="${TCS.modaleStatDetail}">${player?.double}</div>
      <div class="${TCS.modaleStatDetail}">${player?.triple}</div>
      <div class="${TCS.modaleStatDetail}">${player?.quad}</div>

      <div class="${TCS.modaleStatDetailGrey}">Tspin</div>
      <div class="${TCS.modaleStatDetail}">${player?.tspinZero}</div>
      <div class="${TCS.modaleStatDetail}">${player?.tspinSingle}</div>
      <div class="${TCS.modaleStatDetail}">${player?.tspinDouble}</div>
      <div class="${TCS.modaleStatDetail}">${player?.tspinTriple}</div>
      <div class="${TCS.modaleStatDetail}">X</div>

      <div class="${TCS.modaleStatDetailGrey}">Mini Tspin</div>
      <div class="${TCS.modaleStatDetail}">${player?.miniTspinZero}</div>
      <div class="${TCS.modaleStatDetail}">${player?.miniTspinSingle}</div>
      <div class="${TCS.modaleStatDetail}">X</div>
      <div class="${TCS.modaleStatDetail}">X</div>
      <div class="${TCS.modaleStatDetail}">X</div>

      <div class="${TCS.modaleStatDetailGrey}">Mini Spin</div>
      <div class="${TCS.modaleStatDetail}">${player?.miniSpinZero}</div>
      <div class="${TCS.modaleStatDetail}">${player?.miniSpinSingle}</div>
      <div class="${TCS.modaleStatDetail}">${player?.miniSpinDouble}</div>
      <div class="${TCS.modaleStatDetail}">${player?.miniSpinTriple}</div>
      <div class="${TCS.modaleStatDetail}">${player?.miniSpinQuad}</div>
    </div>

    <div class="h-[30px]"></div>

  </div>
  `;
  return listHTML;
};

export const modaleTetrisStatDetailHTML = (id: number, playerUsername: string) => {

  let TetrisStatDetailHTML = `
    <div id="tetrisStatsDetailTitle" class="${TCS.modaleTitre}">
    ${imTexts.modalesTetrisStatsDetailTitle}</div>

    <div id="tetrisStatsDetailBack" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsDetailBack}</div>

    <div class="h-[30px]"></div>
  `

  TetrisStatDetailHTML += getModaleTetrisStatListDetailsHTML(id, playerUsername);
  TetrisStatDetailHTML += `<div class="h-[30px]"></div>`;

  return TetrisStatDetailHTML; 
}

export const modaleTetrisStatDetailEvents = () => {
  const tetrisStatsDetailBack = document.getElementById('tetrisStatsDetailBack') as HTMLAnchorElement;

  if (!tetrisStatsDetailBack)
    return;

  tetrisStatsDetailBack.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    modaleDisplay(ModaleType.TETRIS_STATS);
  });
}

export const modaleFriendTetrisStatDetailEvents = () => {
  const tetrisStatsDetailBack = document.getElementById('tetrisStatsDetailBack') as HTMLAnchorElement;

  if (!tetrisStatsDetailBack)
    return;

  tetrisStatsDetailBack.addEventListener('click', (e: Event) => {
    e.stopPropagation();
    modaleDisplay(ModaleType.FRIEND_TETRIS_STATS);
  });
}