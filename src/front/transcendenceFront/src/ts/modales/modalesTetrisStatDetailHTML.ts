import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { modaleDisplay } from './modalesCore.ts';
import { ModaleType } from './modalesCore.ts';
// import {indexGame} from "./modalesTetrisStatHTML.ts";
import { tetrisGames } from "./modalesTetrisStatHTML.ts";
import { user } from "../utils.ts";

interface GameUserInfo
{
  date: 	 string;
  totalTime: 	string;
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
  const player = game.players.find((p: GameUserInfo) => { return p.username === playerUsername });


  let listHTML = `
  <div id="tetrisStatsDetailText" class="${TCS.modaleTexte}">
    <p>Date: ${player?.date}</p>
    <p>Score: ${player?.score}</p>
    <p>Total Time: ${player?.totalTime}</p>
    <p>Max Combo: ${player?.maxCombo}</p>
    <p>Max B2B: ${player?.maxB2B}</p>
    <p>Perfect Clears: ${player?.perfectClears}</p>
    <p>Pieces: ${player?.piecesPlaced} placed | ${player?.piecesPerSecond}/s</p>
    <p>Attacks Sent: ${player?.attacksSent} | ${player?.attacksSentPerMinute}/min</p>
    <p>Attacks Received: ${player?.attacksReceived} | ${player?.attacksReceivedPerMinute}/min</p>
    <p>Keys: ${player?.keysPressed} pressed | ${player?.keysPerPiece}/pieces | ${player?.keysPerSecond}/s</p>
    <p>Holds: ${player?.holds}</p>
    <p>Lines: ${player?.linesCleared} cleared | ${player?.linesPerMinute}/min</p>
    
    <table class="${TCS.modaleTexte}">
    <thead>
      <tr>
        <th>TYPE</th>
        <th>Zero</th>
        <th>Single</th>
        <th>Double</th>
        <th>Triple</th>
        <th>Quad</th>
      </tr>
    </thead>
    <tbody>
        <tr>
        <td>Clears</td>
        <td>X</td>
        <td>${player?.single}</td>
        <td>${player?.double}</td>
        <td>${player?.triple}</td>
        <td>${player?.quad}</td>
        </tr>
    </tbody>
    <tbody>
      <tr>
        <td>Tspin</td>
        <td>${player?.tspinZero}</td>
        <td>${player?.tspinSingle}</td>
        <td>${player?.tspinDouble}</td>
        <td>${player?.tspinTriple}</td>
        <td>X</td>
      </tr>
      <tr>
        <td>Mini Tspin</td>
        <td>${player?.miniTspinZero}</td>
        <td>${player?.miniTspinSingle}</td>
        <td>X</td>
        <td>X</td>
        <td>X</td>
      </tr>
      <tr>
        <td>Mini Spin</td>
        <td>${player?.miniSpinZero}</td>
        <td>${player?.miniSpinSingle}</td>
        <td>${player?.miniSpinDouble}</td>
        <td>${player?.miniSpinTriple}</td>
        <td>${player?.miniSpinQuad}</td>
      </tr>
    </tbody>
  </table>
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

  tetrisStatsDetailBack.addEventListener('click', () => {
    modaleDisplay(ModaleType.TETRIS_STATS);
  });
}

export const modaleFriendTetrisStatDetailEvents = () => {
  const tetrisStatsDetailBack = document.getElementById('tetrisStatsDetailBack') as HTMLAnchorElement;

  if (!tetrisStatsDetailBack)
    return;

  tetrisStatsDetailBack.addEventListener('click', () => {
    modaleDisplay(ModaleType.FRIEND_TETRIS_STATS);
  });
}