import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';

export let modaleAvatarHTML = `
  <div id="titre_avatar" class="${TCS.modaleTitre}">
  ${imTexts.modalesAvatarTitle}</div>

  <div class="h-[30px]"></div>

  <div class="grid grid-cols-6 gap-x-[21px] gap-y-[21px]">
`;

for (let i = 0; i < 24; i++) {
  console.log("/medias/avatars/avatar"+i+".png");
  modaleAvatarHTML += `
    <div id="profileAvatar${i}" class="${TCS.modaleAvatarChoose}">
      <img src="/src/medias/avatars/avatar${i+1}.png"/>
    </div>
  `;
}

modaleAvatarHTML += `
  </div>
  <div class="h-[30px]"></div>

  <div id="avatarBack" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesAvatarBack}</div>

  <div class="h-[30px]"></div>
`;
