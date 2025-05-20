///////////////////////////////////////////
// Imports

import { EL } from '../zone/zoneHTML.ts';

import { modaleSignInHTML } from './modalesSignInHTML.ts';
import { modaleSignUpHTML } from './modalesSignUpHTML.ts';
import { modaleProfileHTML } from './modalesProfileHTML.ts';
import { modalePongStatHTML } from './modalesPongStatHTML.ts';
import { modaleTetrisStatHTML } from './modalesTetrisStatHTML.ts';
import { modaleTetrisStatDetailHTML } from './modalesTetrisStatDetailHTML.ts';

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
  modaleHide();
}

export const modaleDisplay = (modaleType: ModaleType) => {
  if (!modale.content || !modale.zone || modale.type === modaleType) { return; }

  modale.type = modaleType;
  switch (modaleType) {
    case ModaleType.SIGNIN:
      modale.content.innerHTML = modaleSignInHTML; break;
    case ModaleType.SIGNUP:
      modale.content.innerHTML = modaleSignUpHTML; break;
    case ModaleType.PROFILE:
      modale.content.innerHTML = modaleProfileHTML; break;
    case ModaleType.PONG_STATS:
      modale.content.innerHTML = modalePongStatHTML; break;
    case ModaleType.TETRIS_STATS:
      modale.content.innerHTML = modaleTetrisStatHTML; break;
    case ModaleType.TETRIS_STATS_DETAIL:
      modale.content.innerHTML = modaleTetrisStatDetailHTML; break;
    default:
      modale.content.innerHTML = '';
  }

  // Afficher la modale
  while (modale.zone.classList.contains('hidden')) {
    modale.zone.classList.remove('hidden');
  }
  modale.zone.classList.add('block');
  modale.show = true;
  modaleAddCloseIcon(); // a tester
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

export const modaleAddCloseIcon = () => {
  const closeIcon = document.querySelector<HTMLDivElement>('div[id="closeIcon"]');
  if (!closeIcon) return;

  while (closeIcon.classList.contains('hidden')) {
    closeIcon.classList.remove('hidden');
  }
  closeIcon.classList.add('block');

  closeIcon.addEventListener('click', () => {
    modaleHide();
  });
  document.getElementById('bkgModale')?.addEventListener('click', () => {
    modaleHide();
  });

  // Ajouter les gestionnaires d'événements pour les liens
  const toRegisterLink = document.querySelector<HTMLAnchorElement>('#to_register_link');
  if (toRegisterLink) {
    toRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      modaleDisplay(ModaleType.SIGNUP);
    });
  }
}

export const modaleRemoveCloseIcon = () => {
  const closeIcon = document.querySelector<HTMLDivElement>('div[id="closeIcon"]');
  if (!closeIcon) return;

  while (closeIcon.classList.contains('block')) {
    closeIcon.classList.remove('block');
  }
  closeIcon.classList.add('hidden');

  closeIcon.removeEventListener('click', () => { });
  document.getElementById('bkgModale')?.removeEventListener('click', () => { });
}

