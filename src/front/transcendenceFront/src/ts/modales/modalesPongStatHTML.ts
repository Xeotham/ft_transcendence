import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import closeIconImg from '../../medias/images/modales/croixSlate200.png';

export const modalePongStatHTML = `

  <!-- 
  <div id="closeIcon" class="${TCS.modaleClose} hidden">
  <img src="${closeIconImg}" class="w-[10px] h-[10px]"/></div>
  -->

  <div id="titre_pong_stats" class="${TCS.modaleTitre}">
  ${imTexts.modalesPongStatsTitre}</div>

  <div id="back_pong_stats" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesPongStatsBack}</div>

  <div class="h-[30px]"></div>


  <div id="line0_pong_stats" class="${TCS.modaleTexte}">
  ${imTexts.modalesPongStatsLine0}</div>
  <div id="line1_pong_stats" class="${TCS.modaleTexte}">
  ${imTexts.modalesPongStatsLine1}</div>
  <div id="line2_pong_stats" class="${TCS.modaleTexte}">
  ${imTexts.modalesPongStatsLine2}</div>
  <div id="line3_pong_stats" class="${TCS.modaleTexte}">
  ${imTexts.modalesPongStatsLine3}</div>
  <div id="line4_pong_stats" class="${TCS.modaleTexte}">
  ${imTexts.modalesPongStatsLine4}</div>
  <div id="line5_pong_stats" class="${TCS.modaleTexte}">
  ${imTexts.modalesPongStatsLine5}</div>
  <div id="line6_pong_stats" class="${TCS.modaleTexte}">
  ${imTexts.modalesPongStatsLine6}</div>
  <div id="line7_pong_stats" class="${TCS.modaleTexte}">
  ${imTexts.modalesPongStatsLine7}</div>
  <div id="line8_pong_stats" class="${TCS.modaleTexte}">
  ${imTexts.modalesPongStatsLine8}</div>
  <div id="line9_pong_stats" class="${TCS.modaleTexte}">
  ${imTexts.modalesPongStatsLine9}</div>

  <div class="h-[10px]"></div>

  <div id="back_pong_stats" class="${TCS.modaleTexte}">
    <a id="back_pong_stats_link" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesPongStatsPrev}</a>
    /
    <a id="next_pong_stats_link" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesPongStatsNext}</a>
  </div>

    <div class="h-[30px]"></div>

`;