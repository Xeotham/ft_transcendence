///////////////////////////////////////////
// Imports
//
// Syles
import { TCS } from '../TCS.ts';
// Images
import img_logo_immanence from '/src/medias/images/zones/flamingtext_3.png';
import img_pong_bkg from '/src/medias/images/zones/fond_test_pong.png';
import img_tetris_bkg from '/src/medias/images/zones/fond_test_tetris.png';
import  { loadTetrisTextures } from "../tetris/tetris.ts";
import {loadPongTextures} from "../pong/pong.ts";

//TMP
import { modaleDisplay, ModaleType } from '../modales/modalesCore.ts';

///////////////////////////////////////////
// Exports
//
// adress
export const	address = import.meta.env.VITE_API_ADDRESS;
// EL
export const	EL = {
  app: null as HTMLElement | null,
  zonePong: null as HTMLElement | null,
  zoneTetris: null as HTMLElement | null,
  zoneAvatar: null as HTMLElement | null,
  zoneModale: null as HTMLElement | null,
  contentPong: null as HTMLElement | null,
  contentTetris: null as HTMLElement | null,
  contentModale: null as HTMLElement | null,
  bkgPong: null as HTMLElement | null,
  bkgTetris: null as HTMLElement | null,
  oldVersion: false,
  init: () => {
    EL.app = document.getElementById("app");
    EL.zonePong = document.getElementById("zonePong");
    EL.zoneTetris = document.getElementById("zoneTetris");
    EL.zoneAvatar = document.getElementById("zoneAvatar");
    EL.zoneModale = document.getElementById("zoneModale");
    EL.contentPong = document.getElementById("contentPong");
    EL.contentTetris = document.getElementById("contentTetris");
    EL.contentModale = document.getElementById("contentModale");
    EL.bkgPong = document.getElementById("bkgPong");
    EL.bkgTetris = document.getElementById("bkgTetris");
  },
  check: () => {
    if (EL.app && EL.zonePong && EL.zoneTetris && EL.zoneModale && EL.contentPong && EL.contentTetris && EL.contentModale && EL.bkgPong && EL.bkgTetris && EL.zoneAvatar) {
      return true;
    }
    return false;
  },
  setOldVersion: () => {
    EL.oldVersion = true;
  },
  printf: () => {
    console.log("EL: " + EL);
  }
}

// definir une palce pour le chargement des medias
export const awaitMedias = async () => {
	await loadTetrisTextures().then(() => {console.log("Textures Loaded");}).catch( (error) => (console.error(error)));
    await loadPongTextures().then(() => {console.log("Textures Loaded");}).catch( (error) => (console.error(error)));
}

export const setHtmlFront = () => {
  // html & body
  document.querySelectorAll('html, body').forEach((el) => {
    el.classList.add('m-0', 'h-full');
  });
  // #app
  let app = document.querySelector<HTMLDivElement>('#app');
  if(app) {
    app.classList.add('h-full');
    app.innerHTML = 
    `


<div name="zonePong" id="zonePong" class="${TCS.zonePong}">
    <div id="contentPong" class="w-full h-full absolute z-10 flex items-center justify-center"></div>
    <div id="bkgPong" class="w-full h-full absolute z-0 flex items-start justify-center">
        <img src="${img_pong_bkg}" class="w-[1024px] h-[1024px] object-none" />
    </div>
</div>

<div name="zoneTetris" id="zoneTetris" class="${TCS.zoneTetris} ${TCS.zoneTetrisShadow}">
    <div id="contentTetris" class="w-full h-full absolute z-10 flex items-center justify-center"></div>
    <div id="bkgTetris" class="w-full h-full absolute z-0 flex items-start justify-center">
        <img src="${img_tetris_bkg}" class="w-[1024px] h-[1024px] object-none" />
    </div>
</div>

<div name="zoneAvatar" id="zoneAvatar" class="${TCS.avatar}">
    <div id="avatarMask" class="${TCS.avatarMask}">
      <img id="avatarImg" src="/src/medias/avatars/avatar1.png" class="${TCS.avatarImg}"/>
    </div>
</div>

<div name="zoneModale" id="zoneModale" class="${TCS.zoneModale} hidden">
    <div id="bkgModale" class="${TCS.bkgModale}"></div>
    <div id="contentModale" class="${TCS.contentModale}"></div>
</div>

  `
  }

  //setZoneTopTMP(); //TODO: remove

}

export const setZoneAvatar = (hide: boolean = false) => {
  if(EL.zoneAvatar) {
    if(hide) {
      EL.zoneAvatar.classList.add(TCS.avatarHidden);
      EL.zoneAvatar.removeEventListener('click', () => {
      });
    } else {
      EL.zoneAvatar.classList.remove(TCS.avatarHidden);
      EL.zoneAvatar.addEventListener('click', () => {
        console.log("setZoneAvatar: click");
        modaleDisplay(ModaleType.PROFILE);
      });
    }
  }
}

// zoneTop a enlever

// `
// <div name="zoneTop" id="zoneTop" class="${TCS.zoneTop}">
//     <img id="logoImmanence" src="${img_logo_immanence}" alt="Immanence" class="${TCS.immanenceLogo}" />
// </div>
// `

// export const setZoneTopTMP = () => {
//   const app = document.getElementById('zoneTop'); if (!app) return;

//   app.innerHTML = `
//   <img id="logoImmanence" src="${img_logo_immanence}" alt="Immanence" class="${TCS.immanenceLogo}" />
//   <span class="font-sixtyfour text-[14px] cursor-pointer hover:cursor-pointer">
//   &nbsp&nbsp&nbsp     
//   <a id="SIGNIN" class="hover:text-yellow-600">SIGNIN</a>&nbsp|
//   <a id="SIGNUP" class="hover:text-yellow-600">SIGNUP</a>&nbsp|
//   <a id="PROFILE" class="hover:text-yellow-600">PROFILE</a>&nbsp|
//   <a id="PONG_STATS" class="hover:text-yellow-600">PONG_STATS</a>&nbsp|
//   <a id="TETRIS_STATS" class="hover:text-yellow-600">TETRIS_STATS</a>&nbsp|
//   <a id="TETRIS_STATS_DETAIL" class="hover:text-yellow-600">TETRIS_STATS_DETAIL</a>&nbsp|
//   <a id="AVATAR" class="hover:text-yellow-600">AVATAR</a>
//   </span>
//   `;
//   document.getElementById('SIGNIN')?.addEventListener('click', () => {
//     modaleDisplay(ModaleType.SIGNIN);});
//   document.getElementById('SIGNUP')?.addEventListener('click', () => {
//     modaleDisplay(ModaleType.SIGNUP);});
//   document.getElementById('PROFILE')?.addEventListener('click', () => {
//     modaleDisplay(ModaleType.PROFILE);});
//   document.getElementById('PONG_STATS')?.addEventListener('click', () => {
//     modaleDisplay(ModaleType.PONG_STATS);});
//   document.getElementById('TETRIS_STATS')?.addEventListener('click', () => {
//     modaleDisplay(ModaleType.TETRIS_STATS);});
//   document.getElementById('TETRIS_STATS_DETAIL')?.addEventListener('click', () => {
//     modaleDisplay(ModaleType.TETRIS_STATS_DETAIL);}); 
//   document.getElementById('AVATAR')?.addEventListener('click', () => {
//     modaleDisplay(ModaleType.AVATAR);});
// }
