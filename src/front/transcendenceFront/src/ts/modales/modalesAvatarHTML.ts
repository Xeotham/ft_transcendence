import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { modaleDisplay, ModaleType } from './modalesCore.ts';


export let modaleAvatarHTML = () => {
  let AvatarHTML = `
  <div id="titre_avatar" class="${TCS.modaleTitre}">
  ${imTexts.modalesAvatarTitle}</div>

  <div id="avatarBack" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesAvatarBack}</div>

  <div class="h-[30px]"></div>

  <div class="grid grid-cols-6 gap-x-[21px] gap-y-[21px]">
`;

  for (let i = 0; i < 24; i++) {
    console.log("/medias/avatars/avatar"+i+".png");
    AvatarHTML += `
    <div id="profileAvatar${i}" class="${TCS.modaleAvatarChoose}">
      <img src="/src/medias/avatars/avatar${i+1}.png"/>
    </div>
  `;
  }

  AvatarHTML += `
  </div>

  <div class="h-[30px]"></div>
  `;

  return AvatarHTML;
}

export const modaleAvatarEvents = () => {
  const avatarBack = document.getElementById('avatarBack') as HTMLAnchorElement;

  if (!avatarBack)
    return;

  avatarBack.addEventListener('click', () => {
    modaleDisplay(ModaleType.PROFILE);
  });
}