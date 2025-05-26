import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay } from './modalesCore.ts';

import avatarImg from '../../medias/avatars/avatar1.png';
import {getFromApi} from "../utils.ts";
import {address, user} from "../immanence.ts";

const pongWinRate = async () => {
  const stats = await getFromApi(`http://${address}/api/user/get-stat?username=${user.getUsername()}`);
  const victories: number = stats.stats.pongWin;
  let defeats: number = stats.stats.pongLose;
  return `${imTexts.modalesProfileWinrate}: ${victories} ${imTexts.modalesProfileVictories} / ${defeats} ${imTexts.modalesProfileDefeats}`;
}

const tetrisBestScore = (score: number) => {
  return `${imTexts.modalesProfileBestScore}: ${score}pts`;
}


export const modaleProfileHTML = async () => {

  let ProfileHTML = `
      
  <div class="flex flex-row items-start justify-start gap-4">
    <div id="profileAvatar" class="${TCS.modaleAvatarProfil} ">
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
  ${await pongWinRate()}</div>
  <div id="modalePongStatsLink" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesProfilePongStatsLink}</div>

    <div class="h-[30px]"></div>

  <span class="${TCS.modaleTexte} text-[24px]">Tetris</span>
  <div id="modaleTetrisStats" class="${TCS.modaleTexte}">
    ${tetrisBestScore(1000)}
  </div>
  <div id="modaleTetrisStatsLink" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesProfileTetrisStatsLink}</div>

  <div class="h-[30px]"></div>

`;

  return ProfileHTML;
}

export const modaleProfileEvents = () => {
  
  const profileAvatar =         document.getElementById('profileAvatar') as HTMLImageElement;
  const profileUserEditLink =   document.getElementById('profileUserEditLink') as HTMLAnchorElement;
  const profileDeconectLink =   document.getElementById('profileDeconectLink') as HTMLAnchorElement;
  const modalePongStatsLink =   document.getElementById('modalePongStatsLink') as HTMLImageElement;
  const modaleTetrisStatsLink = document.getElementById('modaleTetrisStatsLink') as HTMLImageElement;

  if (!profileAvatar || !profileUserEditLink || !profileDeconectLink || !modalePongStatsLink || !modaleTetrisStatsLink)
    return;
    
  profileAvatar.addEventListener('click', () => {
    modaleDisplay(ModaleType.AVATAR);
  });

  profileUserEditLink.addEventListener('click', () => {
    modaleDisplay(ModaleType.SIGNUP); // TODO: remplacer par la modale de modification de profile
  });

  profileDeconectLink.addEventListener('click', () => {
    modaleDisplay(ModaleType.SIGNIN); // TODO: faire une vrai deconnection avec refresh sur la home
  });

  modalePongStatsLink.addEventListener('click', () => {
    modaleDisplay(ModaleType.PONG_STATS);
  });

  modaleTetrisStatsLink.addEventListener('click', () => {
    modaleDisplay(ModaleType.TETRIS_STATS);
  });
}
