import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay } from './modalesCore.ts';

import avatarImg from '../../medias/avatars/avatar1.png';
import {postToApi} from "../utils.ts";
import {address} from "../immanence.ts"; // TODO: remplacer par l'avatar de l'utilisateur
import  page from "page";

export const modaleProfileHTML = () => {

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
    const user = { username: localStorage.getItem("username")};
    postToApi(`http://${address}/api/user/logout`, user)
        .then(() => {
          localStorage.clear();
          alert("User signed out successfully!");
          page.show("/");
        })
        .catch((error) => {
          console.error("Error logging out:", error.status, error.message);
          alert(error.message);
        });
  });

  modalePongStatsLink.addEventListener('click', () => {
    modaleDisplay(ModaleType.PONG_STATS);
  });

  modaleTetrisStatsLink.addEventListener('click', () => {
    modaleDisplay(ModaleType.TETRIS_STATS);
  });
}
