///////////////////////////////////////////
// Imports

import { EL } from '../zone/zoneHTML.ts';

import { modaleSignInHTML, modaleSignInEvents } from './modalesSignInHTML.ts';
import { modaleSignUpHTML, modaleSignUpEvents } from './modalesSignUpHTML.ts';
import { modaleProfileHTML, modaleProfileEvents } from './modalesProfileHTML.ts';
import {modalePongStatHTML, modalePongStatEvents, loadPongStat} from './modalesPongStatHTML.ts';
import { modaleTetrisStatHTML, modaleTetrisStatEvents, loadTetrisStat,modaleTetrisStatLineEvents } from './modalesTetrisStatHTML.ts';
import { modaleTetrisStatDetailHTML, modaleTetrisStatDetailEvents } from './modalesTetrisStatDetailHTML.ts';
import { modaleAvatarHTML, modaleAvatarEvents } from './modalesAvatarHTML.ts';

///////////////////////////////////////////
// Variables
export enum ModaleType {
  NONE = 'NONE',
  SIGNIN = 'SIGNIN',
  SIGNUP = 'SIGNUP',
  PROFILE = 'PROFILE',
  PONG_STATS = 'PONG_STATS',
  TETRIS_STATS = 'TETRIS_STATS',
  TETRIS_STATS_DETAIL = 'TETRIS_STATS_DETAIL',
  AVATAR = 'AVATAR',
}

export let modale = {
  type: ModaleType.SIGNIN,
  show: false,
  zone: <HTMLDivElement|null>null,
  content: <HTMLDivElement|null>null,
};

///////////////////////////////////////////
// Functions

export const modaleInit = () => {
  modale.type = ModaleType.NONE;
  modale.show = false;
  modale.zone = EL.zoneModale as HTMLDivElement;
  modale.content = EL.contentModale as HTMLDivElement;

  const bkgModale = document.getElementById('bkgModale') as HTMLDivElement;
  if (!bkgModale) 
    return;
  bkgModale.addEventListener('click', () => {
    modaleHide();
  });

  //modaleHide();
  modaleDisplay(ModaleType.SIGNIN);
}

export const modaleDisplay = async (modaleType: ModaleType) => {
  if (!modale.content || !modale.zone || modale.type === modaleType) { return; }

  modale.type = modaleType;
  switch (modaleType) {
    case ModaleType.SIGNIN:
      modale.content.innerHTML = modaleSignInHTML(); 
      modaleSignInEvents();
      break;
    case ModaleType.SIGNUP:
      modale.content.innerHTML = modaleSignUpHTML(); 
      modaleSignUpEvents();
      break;
    case ModaleType.PROFILE:
      modale.content.innerHTML = await modaleProfileHTML();
      modaleProfileEvents();
      break;
    case ModaleType.PONG_STATS:
      await loadPongStat();
      modale.content.innerHTML = modalePongStatHTML(0); 
      modalePongStatEvents();
      break;
    case ModaleType.TETRIS_STATS:
      await loadTetrisStat();
      modale.content.innerHTML = modaleTetrisStatHTML(0); 
      modaleTetrisStatEvents();
      // modaleTetrisStatLineEvents();
      break;
    case ModaleType.TETRIS_STATS_DETAIL:
      modale.content.innerHTML = modaleTetrisStatDetailHTML(42); // TODO: mettre id de la partie
      modaleTetrisStatDetailEvents();
      break;
    case ModaleType.AVATAR:
      modale.content.innerHTML = modaleAvatarHTML();
      modaleAvatarEvents();
      break;
    default:
      modale.content.innerHTML = '';
  }

  // Afficher la modale
  while (modale.zone.classList.contains('hidden')) {
    modale.zone.classList.remove('hidden');
  }
  modale.zone.classList.add('block');
  modale.show = true;
}

export const modaleHide = () => {
  if (!modale.zone || !modale.content)
    return;
  modale.type = ModaleType.NONE;
  modale.content.innerHTML = '';
  while (modale.zone.classList.contains('block')) {
    modale.zone.classList.remove('block');
  }
  modale.zone.classList.add('hidden');
  modale.show = false;
}

export const modaleAlert = (message: string) => {
  const alert = document.getElementById('modaleAlert') as HTMLDivElement;

  if (!alert)
    return;

  alert.innerHTML = `
  <div class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
    <div>
      ${message}
    </div>
  </div>
  `;

  // TODO refresh zone modale avec un timeout ???
}