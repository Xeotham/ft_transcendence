import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';

import closeIconImg from '../../medias/images/modales/croixSlate200.png';
import avatarImg from '../../medias/avatars/avatar00.png';

export const modaleProfileHTML = `

  <!-- 
  <div id="closeIcon" class="${TCS.modaleClose} hidden">
  <img src="${closeIconImg}" class="w-[10px] h-[10px]"/></div>
  -->
        
  <div class="flex flex-row items-start justify-start gap-4">
    <div id="profileAvatar" class="${TCS.modaleAvatar} ">
      <img src="${avatarImg}"/>
    </div>
    <div>
      <div id="profileUsername" class="${TCS.modaleTitre}">${imTexts.modalesProfileUsername}</div>
      <div id="profileUserEdit" class="${TCS.modaleTexte}">
        <a id="profileUserEditLink" class="${TCS.modaleTexteLink}">
        ${imTexts.modalesProfileUserEdit}</a>
        /
        <a id="profileDeconectLink" class="${TCS.modaleTexteLink}">
        ${imTexts.modalesProfileDeconect}</a>
      </div>
    </div>
  </div>

  <div class="h-[30px]"></div>
  
  <span class="${TCS.modaleTexte} text-[24px]">Pong</span>
  <div id="modalePongStats" class="${TCS.modaleTexte}">
  ${imTexts.modalesProfilePongStats}</div>
  <div id="modalePongStatsLink" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesProfilePongStatsLink}</div>

    <div class="h-[30px]"></div>

  <span class="${TCS.modaleTexte} text-[24px]">Tetris</span>
  <div id="modaleTetrisStats" class="${TCS.modaleTexte}">
    ${imTexts.modalesProfileTetrisStats}
  </div>
  <div id="modaleTetrisStatsLink" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesProfileTetrisStatsLink}</div>

  <div class="h-[30px]"></div>

`;