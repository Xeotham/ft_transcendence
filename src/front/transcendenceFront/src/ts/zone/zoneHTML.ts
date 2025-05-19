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

///////////////////////////////////////////
// Exports
//
// adress
export const	address = import.meta.env.VITE_API_ADDRESS;
// EL
export const	EL = {
  app: null as HTMLElement | null,
  zoneTop: null as HTMLElement | null,
  zonePong: null as HTMLElement | null,
  zoneTetris: null as HTMLElement | null,
  zoneModale: null as HTMLElement | null,
  contentPong: null as HTMLElement | null,
  contentTetris: null as HTMLElement | null,
  contentModale: null as HTMLElement | null,
  bkgPong: null as HTMLElement | null,
  bkgTetris: null as HTMLElement | null,
  oldVersion: false,
  init: () => {
    EL.app = document.getElementById("app");
    EL.zoneTop = document.getElementById("zoneTop");
    EL.zonePong = document.getElementById("zonePong");
    EL.zoneTetris = document.getElementById("zoneTetris");
    EL.zoneModale = document.getElementById("zoneModale");
    EL.contentPong = document.getElementById("contentPong");
    EL.contentTetris = document.getElementById("contentTetris");
    EL.contentModale = document.getElementById("contentModale");
    EL.bkgPong = document.getElementById("bkgPong");
    EL.bkgTetris = document.getElementById("bkgTetris");
  },
  check: () => {
    if (EL.app && EL.zoneTop && EL.zonePong && EL.zoneTetris && EL.zoneModale && EL.contentPong && EL.contentTetris && EL.contentModale && EL.bkgPong && EL.bkgTetris) {
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
<div name="zoneTop" id="zoneTop" class="${TCS.zoneTop}">
    <img id="logoImmanence" src="${img_logo_immanence}" alt="Immanence" class="${TCS.immanenceLogo}" />
</div>

<div name="zonePong" id="zonePong" class="${TCS.zonePong}">
    <div id="contentPong" class="w-full h-full absolute z-10 flex items-center justify-center"></div>
    <div id="bkgPong" class="w-full h-full absolute z-0 flex items-start justify-center">
        <img src="${img_pong_bkg}" class="w-[1024px] h-[1024px] object-none" />
    </div>
</div>

<div name="zoneTetris" id="zoneTetris" class="${TCS.zoneTetris}">
    <div id="contentTetris" class="w-full h-full absolute z-10 flex items-center justify-center"></div>
    <div id="bkgTetris" class="w-full h-full absolute z-0 flex items-start justify-center">
        <img src="${img_tetris_bkg}" class="w-[1024px] h-[1024px] object-none" />
    </div>
</div>

<div name="zoneModale" id="zoneModale" class="${TCS.modale} hidden">
    <div id="contentModale" class="w-full h-full absolute"></div>
</div>

  `
  }
}

// definir une palce pour le chargement des medias
export const awaitMedias = async () => {
	await loadTetrisTextures().then(() => {console.log("Textures Loaded");}).catch( (error) => (console.error(error)));
}

