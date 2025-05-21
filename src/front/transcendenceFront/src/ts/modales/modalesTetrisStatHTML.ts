import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import closeIconImg from '../../medias/images/modales/croixSlate200.png';

export const modaleTetrisStatHTML = `

  <!-- 
  <div id="closeIcon" class="${TCS.modaleClose} hidden">
  <img src="${closeIconImg}" class="w-[10px] h-[10px]"/></div>
  -->

  <div id="titre_tetris_stats" class="${TCS.modaleTitre}">
  ${imTexts.modalesTetrisStatsTitre}</div>

  <div id="back_tetris_stats" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsBack}</div>

  <div class="h-[30px]"></div>

  <div id="line0_tetris_stats" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine0}
  <a id="line0_tetris_stats_link" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLink}</a></div>

  <div id="line1_tetris_stats" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine1}
  <a id="line1_tetris_stats_link" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLink}</a></div>

  <div id="line2_tetris_stats" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine2}
  <a id="line2_tetris_stats_link" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLink}</a></div>

  <div id="line3_tetris_stats" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine3}
  <a id="line3_tetris_stats_link" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLink}</a></div>

  <div id="line4_tetris_stats" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine4}
  <a id="line4_tetris_stats_link" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLink}</a></div>

  <div id="line5_tetris_stats" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine5}
  <a id="line5_tetris_stats_link" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLink}</a></div>

  <div id="line6_tetris_stats" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine6}
  <a id="line6_tetris_stats_link" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLink}</a></div>

  <div id="line7_tetris_stats" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine7}
  <a id="line7_tetris_stats_link" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLink}</a></div>

  <div id="line8_tetris_stats" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine8}
  <a id="line8_tetris_stats_link" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLink}</a></div>

  <div id="line9_tetris_stats" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine9}
  <a id="line9_tetris_stats_link" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLink}</a></div>

  <div class="h-[10px]"></div>

  <div id="back_tetris_stats" class="${TCS.modaleTexte}">
    <a id="back_tetris_stats_link" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsPrev}</a>
    /
    <a id="next_tetris_stats_link" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsNext}</a>
  </div>

    <div class="h-[30px]"></div>

`;