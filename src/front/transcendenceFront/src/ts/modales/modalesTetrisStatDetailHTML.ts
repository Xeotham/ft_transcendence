import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { modaleDisplay } from './modalesCore.ts';
import { ModaleType } from './modalesCore.ts';

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