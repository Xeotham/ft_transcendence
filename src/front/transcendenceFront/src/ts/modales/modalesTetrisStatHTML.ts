import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay } from './modalesCore.ts';

let tetrisStatPage = 0;

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


const getModaleTetrisStatListHTML = (page: number) => {
  
  let listHTML = ``;

  console.log("getModaleTetrisStatListHTML", page); // TODO: enlever

  listHTML += `
    <div id="tetrisBestScore" class="${TCS.modaleTexte}">
    ${imTexts.modalesTetrisStatsBestScore}</div>
    
    <div class="h-[30px]"></div>
  `;

  for (let i = 0; i < 10; i++) {
    listHTML += `
    <div id="tetrisStatsLine${i}" class="${TCS.modaleTexte}">
      ${imTexts[`modalesTetrisStatsLine${i}`]}
      <a id="tetrisStatsLineLink${i}" class="${TCS.modaleTexteLink}">
      ${imTexts.modalesTetrisStatsLinkName}
      </a></div>
    `;
  } 

  listHTML += `
  <div class="h-[10px]"></div>
  `
  listHTML += `
  <div id="tetrisStatsPrevNext" class="${TCS.modaleTexte}">
    <a id="tetrisStatsPrev" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsPrev}</a>
    /
    <a id="tetrisStatsNext" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsNext}</a>
  </div>
  `;

  return listHTML;
}

export const modaleTetrisStatEvents = () => {
  const tetrisStatsBack = document.getElementById('tetrisStatsBack') as HTMLAnchorElement;
  const tetrisStatsPrev = document.getElementById('tetrisStatsPrev') as HTMLAnchorElement;
  const tetrisStatsNext = document.getElementById('tetrisStatsNext') as HTMLAnchorElement;

  if (!tetrisStatsBack || !tetrisStatsPrev || !tetrisStatsNext)
    return;
  

  tetrisStatsBack.addEventListener('click', () => {
    console.log('tetrisStatsBack');
    modaleDisplay(ModaleType.PROFILE);
    modaleTetrisStatLineEvents();
  });

  tetrisStatsPrev.addEventListener('click', () => {
    if (tetrisStatPage <= 0)
      return;
    modaleTetrisStatHTML(--tetrisStatPage);
    modaleTetrisStatLineEvents();
  });

  tetrisStatsNext.addEventListener('click', () => {
    if (tetrisStatPage >= 10) // TODO: remplacer par le nombre de pages
      return;
    modaleTetrisStatHTML(++tetrisStatPage);
  });
}

export const modaleTetrisStatLineEvents = () => {

  for (let i = 0; i < 10; i++) {
    const tetrisStatsLine = document.getElementById(`tetrisStatsLine${i}`) as HTMLAnchorElement;
    if (!tetrisStatsLine)
      return;
    tetrisStatsLine.addEventListener('click', () => {
      modaleDisplay(ModaleType.TETRIS_STATS_DETAIL);
    });
  }
}