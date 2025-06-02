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

const getModaleTetrisStatListDetailsHTML = (gameIndex: number) => {
  const game = tetrisGames[gameIndex];
  console.log(gameIndex);
  const player = game.players.find((p: GameUserInfo) => p.username === user.getUsername());

  let listHTML = `
  <div id="tetrisStatsDetailText" class="${TCS.modaleTexte}">
    <p>Date: ${player?.date}</p>
    <p>Score: ${player?.score}</p>
    <p>Max Combo: ${player?.maxCombo}</p>
    <p>Pieces Placed: ${player?.piecesPlaced}</p>
    <p>Pieces Per Second: ${player?.piecesPerSecond}</p>
    <p>Attacks Sent: ${player?.attacksSent}</p>
    <p>Attacks Sent Per Minute: ${player?.attacksSentPerMinute}</p>
    <p>Attacks Received: ${player?.attacksReceived}</p>
    <p>Attacks Received Per Minute: ${player?.attacksReceivedPerMinute}</p>
    <p>Keys Pressed: ${player?.keysPressed}</p>
    <p>Keys Per Piece: ${player?.keysPerPiece}</p>
    <p>Keys Per Second: ${player?.keysPerSecond}</p>
    <p>Holds: ${player?.holds}</p>
    <p>Lines Cleared: ${player?.linesCleared}</p>
    <p>Lines Per Minute: ${player?.linesPerMinute}</p>
    <p>Max B2B: ${player?.maxB2b}</p>
    <p>Perfect Clears: ${player?.perfectClears}</p>
    <p>Single: ${player?.single}</p>
    <p>Double: ${player?.double}</p>
    <p>Triple: ${player?.triple}</p>
    <p>Quad: ${player?.quad}</p>
    <p>Tspin Zero: ${player?.tspinZero}</p>
    <p>Tspin Single: ${player?.tspinSingle}</p>
    <p>Tspin Double: ${player?.tspinDouble}</p>
    <p>Tspin Triple: ${player?.tspinTriple}</p>
    <p>Mini Tspin Zero: ${player?.miniTspinZero}</p>
    <p>Mini Tspin Single: ${player?.miniTspinSingle}</p>
    <p>Mini Spin Zero: ${player?.miniSpinZero}</p>
    <p>Mini Spin Single: ${player?.miniSpinSingle}</p>
    <p>Mini Spin Double: ${player?.miniSpinDouble}</p>
    <p>Mini Spin Triple: ${player?.miniSpinTriple}</p>
    <p>Mini Spin Quad: ${player?.miniSpinQuad}</p>
  </div>
  `;
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
  `

  TetrisStatDetailHTML += getModaleTetrisStatListDetailsHTML(id);
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