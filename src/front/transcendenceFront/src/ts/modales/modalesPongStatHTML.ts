import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay } from './modalesCore.ts';

let pongStatPage = 0;

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

const getModalePongStatListHTML = (page: number) => {

  let listHTML = ``;

  console.log("getModalePongStatListHTML", page); // TODO: enlever

  for (let i = 0; i < 10; i++) {
    listHTML += `
    <div id="pongStatLine${i}" class="${TCS.modaleTexte}">
    ${imTexts[`modalesPongStatsLine${i}`]}</div>
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
