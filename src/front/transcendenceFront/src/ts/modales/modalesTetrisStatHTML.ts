import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import closeIconImg from '../../medias/images/modales/croixSlate200.png';

export const modaleTetrisStatHTML = `

  <!-- 
  <div id="closeIcon" class="${TCS.modaleClose} hidden">
  <img src="${closeIconImg}" class="w-[10px] h-[10px]"/></div>
  -->

  <div id="tetrisStatsTitle" class="${TCS.modaleTitre}">
  ${imTexts.modalesTetrisStatsTitle}</div>

  <div id="tetrisStatsBack" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsBack}</div>

  <div class="h-[30px]"></div>

  <div id="tetrisBestScore" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsBestScore}</div>

  <div class="h-[30px]"></div>

  <div id="tetrisStatsLine0" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine0}
  <a id="tetrisStatsLineLink0" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLinkName}</a></div>

  <div id="tetrisStatsLine1" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine1}
  <a id="tetrisStatsLineLink1" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLinkName}</a></div>

  <div id="tetrisStatsLine2" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine2}
  <a id="tetrisStatsLineLink2" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLinkName}</a></div>

  <div id="tetrisStatsLine3" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine3}
  <a id="tetrisStatsLineLink3" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLinkName}</a></div>

  <div id="tetrisStatsLine4" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine4}
  <a id="tetrisStatsLineLink4" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLinkName}</a></div>

  <div id="tetrisStatsLine5" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine5}
  <a id="tetrisStatsLineLink5" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLinkName}</a></div>

  <div id="tetrisStatsLine6" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine6}
  <a id="tetrisStatsLineLink6" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLinkName}</a></div>

  <div id="tetrisStatsLine7" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine7}
  <a id="tetrisStatsLineLink7" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLinkName}</a></div>

  <div id="tetrisStatsLine8" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine8}
  <a id="tetrisStatsLineLink8" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLinkName}</a></div>

  <div id="tetrisStatsLine9" class="${TCS.modaleTexte}">${imTexts.modalesTetrisStatsLine9}
  <a id="tetrisStatsLineLink9" class="${TCS.modaleTexteLink}">${imTexts.modalesTetrisStatsLinkName}</a></div>

  <div class="h-[10px]"></div>

  <div id="tetrisStatsBackNext" class="${TCS.modaleTexte}">
    <a id="tetrisStatsBackLink" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsPrev}</a>
    /
    <a id="tetrisStatsNextLink" class="${TCS.modaleTexteLink}">
    ${imTexts.modalesTetrisStatsNext}</a>
  </div>

    <div class="h-[30px]"></div>

`;