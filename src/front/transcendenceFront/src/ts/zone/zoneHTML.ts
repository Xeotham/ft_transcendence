///////////////////////////////////////////
// Imports
//
// Syles
import { TCS } from '../TCS.ts';
// Images
import img_pong_bkg from '/src/medias/images/zones/fond_test_pong.png';
import img_tetris_bkg from '/src/medias/images/zones/fond_test_tetris.png';

//TMP
import { modaleDisplay, ModaleType } from '../modales/modalesCore.ts';
import { user } from "../utils.ts";
import { loadDefaultAvatars } from "../modales/modalesAvatarHTML.ts";

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
	zoneGame: null as HTMLElement | null,
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
		EL.zoneGame = document.getElementById("zoneGame");
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
	await loadDefaultAvatars()
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
      <img id="avatarImg" src="${user.getAvatar()/*"http://localhost:5000/src/medias/avatars/avatar1.png"*/}" class="${TCS.avatarImg}"/>
    </div>
</div>

<div name="zoneModale" id="zoneModale" class="${TCS.zoneModale} hidden">
    <div id="bkgModale" class="${TCS.bkgModale}"></div>
    <div id="contentModale" class="${TCS.contentModale}"></div>
</div>

<div name="zoneGame" id="zoneGame" class="${TCS.zoneGame} hidden"></div>
  `
	}
}

export const setZoneAvatar = (show: boolean = true) => {
	if(EL.zoneAvatar) {
		if(!show) {
			EL.zoneAvatar.classList.add(TCS.avatarHidden);
			EL.zoneAvatar.removeEventListener('click', () => {
			});
		} else {
			EL.zoneAvatar.classList.remove(TCS.avatarHidden);
			EL.zoneAvatar.addEventListener('click', (e: Event) => {
				e.stopPropagation();
				modaleDisplay(ModaleType.PROFILE);
			});
		}
	}
}
