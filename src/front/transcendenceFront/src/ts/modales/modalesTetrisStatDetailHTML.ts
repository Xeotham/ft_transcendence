import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { modaleDisplay } from './modalesCore.ts';
import { ModaleType } from './modalesCore.ts';
import {indexGame} from "./modalesTetrisStatHTML.ts";
import {tetrisGames} from "./modalesTetrisStatHTML.ts";
import {user} from "../immanence.ts";

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

const getModaleTetrisStatListDetailsHTML = () => {

  let listHTML = ``;

  tetrisGames.forEach((games) =>
  {
    if (games.gameId === indexGame) {
      games.players.forEach((player) => {
        if (player.username === user.getUsername()) {
        //   TO DO : display stats
        // player.maxCombo;
        // player.piecesPlaced;
        // etc
        }
      })
    }
  })
  return listHTML;
};

export const modaleTetrisStatDetailHTML = (id: number) => {

  // TODO: récupérer les données de la partie
  console.log("modaleTetrisStatDetailHTML", id); // TODO: enlever

  let TetrisStatDetailHTML = `
    <div id="tetrisStatsDetailTitle" class="${TCS.modaleTitre}">
    ${imTexts.modalesTetrisStatsDetailTitle}</div>

    <div id="tetrisStatsDetailBack" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsDetailBack}</div>

    <div class="h-[30px]"></div>

    <div id="tetrisStatsDetailText" class="${TCS.modaleTexte}">
    ${imTexts.modalesTetrisStatsDetailText}
    </div>

    TetrisStatDetailHTML += getModaleTetrisStatListDetailsHTML();

    <div class="h-[30px]"></div>
  `;

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