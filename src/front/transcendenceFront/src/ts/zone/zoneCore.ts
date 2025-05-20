///////////////////////////////////////////
// Imports
// @ts-ignore
import  page from "page"
// HTML
import { EL } from './zoneHTML.ts';
import { loadPongPage } from '../pong/pong.ts';
import { loadTetrisPage } from '../tetris/tetris.ts';

// Events
import {  
  evAdOutDocument,
  evRemOutDocument,
  evAdClickPong,
  evRemClickPong,
  evAdClickTetris,
  evRemClickTetris,
  evAdOverPong,
  evRemOverPong,
  evAdOverTetris,
  evRemOverTetris,
  evAdClickLogoHome,
  evRemClickLogoHome,
 } from './zoneEvents.ts'
// Modales
import { modaleHide } from '../modales/modalesCore.ts';
//import { modale_signin, modale_signup } from '../modales/modalesHTML.ts';

///////////////////////////////////////////
// Variables
interface Zone {
  state: string;
  separatorCenter: number;
  separatorPos: number;
  separatorPosTogo: number;
  separatorShift: number;
  sepRatioCenter: number;
  sepRatio: number;
  sepRatioTogo: number;
  sepRatioShift: number;
}
let zone: Zone = {
  state: 'NO',
  separatorCenter: Math.floor(document.documentElement.clientWidth / 2),
  separatorPos: Math.floor(document.documentElement.clientWidth / 2),
  separatorPosTogo: Math.floor(document.documentElement.clientWidth / 2),
  separatorShift: Math.floor(document.documentElement.clientWidth / 24),
  sepRatioCenter: 50,
  sepRatio: 50,
  sepRatioTogo: 50,
  sepRatioShift: 42
};

// Création d'un Proxy pour écouter les changements
const stateProxy = new Proxy<Zone>(zone, {
  set(target, property: keyof Zone, value: any) {
    if (property in target) {
      target[property] = value as never;
      if (property === 'separatorPos') {
        zoneResize();
      }
      if (property === 'separatorPosTogo') {
        const intervalId = setInterval(() => {
          if (zoneAnimGhost(1.2)) {
            clearInterval(intervalId);
          }
        }, 16);
      }
      return true;
    }
    return false;
  }
});

const zoneAnimGhost = (dec: number = 1.3) => {
  zone.separatorPos = zone.separatorPosTogo - (zone.separatorPosTogo - zone.separatorPos) / dec;
  zoneResize();
  if (Math.abs(zone.separatorPos - zone.separatorPosTogo) < 1) {
    zone.separatorPosTogo = zone.separatorPos;
    zoneResize();
    return true;
  }
  return false;
}

const zoneResize = () => {
  if (EL.zonePong) {
    EL.zonePong.style.width = `${zone.separatorPos}px`;
  }
  if (EL.zoneTetris) {
    EL.zoneTetris.style.width = `${document.documentElement.clientWidth - zone.separatorPos}px`;
  }
  // if (EL.zoneModale) {
  //   EL.zoneModale.style.left = `${zone.separatorPos}px`;
  // }
}

export const documentResize = () => {
  if (zone.state === 'HOME') {
      zone.separatorCenter = Math.floor(document.documentElement.clientWidth / 2);
      stateProxy.separatorPos = zone.separatorCenter; // a verifier quand fd clique
      zone.separatorShift = Math.floor(document.documentElement.clientWidth / zone.sepRatioShift);
  }
  // a faire mettre en place un pourcentage... puis le multiplier pour avoir les positions  
}

///////////////////////////////////////////
// App Query selector

export const zoneSet = (state: string) => {
  if (!zone) {
    console.error('zoneSet: Unknown state');
    return;
  }
  if (zone.state === state) {
    return;
  }
  zone.state = state;
  switch (zone.state) {
    case 'HOME':        { zoneSetHOME(); break; }
    case 'OVER_PONG':   { zoneSetOVER_PONG(); break; }
    case 'OVER_TETRIS': { zoneSetOVER_TETRIS(); break; }
    case 'PONG':        { zoneSetPONG(); break; }
    case 'TETRIS':      { zoneSetTETRIS(); break; }
    case 'MODALE':      { zoneSetHOME(); break; }         
    default: {
      console.error('zoneSet: Unknown state');
    }
  }
}

const zoneSetHOME = () => {
  evAdOutDocument();
  evRemClickLogoHome();
  evAdOverPong();
  evAdOverTetris();
  evAdClickPong();
  evAdClickTetris();

  // modaleHide();
  // modaleDisplay(ModaleType.SIGNIN, modale_signin);
  // modaleDisplay(ModaleType.SIGNUP, modale_signup);

  stateProxy.separatorPosTogo = zone.separatorCenter;
  zone.state = "HOME";
  loadPongPage("logo");
  loadTetrisPage("logo");
  //page.show("/"); 
}

const zoneSetOVER_PONG = () => {
  stateProxy.separatorPosTogo = zone.separatorCenter + zone.separatorShift;
}

const zoneSetOVER_TETRIS = () => {
  stateProxy.separatorPosTogo = zone.separatorCenter - zone.separatorShift;
}

const zoneSetPONG = () => {
  evRemOutDocument();
  evAdClickLogoHome();
  evRemOverPong();
  evRemClickPong();
  evRemOverTetris();
  evAdClickTetris();

  modaleHide();

  stateProxy.separatorPosTogo = Math.floor(document.documentElement.clientWidth * 0.91);
  zone.state = "PONG";
  loadTetrisPage("empty");
  //page.show("/PONG");
  loadPongPage("idle");
}

const zoneSetTETRIS = () => {
  evRemOutDocument();
  evAdClickLogoHome();
  evRemOverPong();
  evAdClickPong();
  evRemOverTetris();
  evRemClickTetris();

  modaleHide();

  stateProxy.separatorPosTogo = Math.floor(document.documentElement.clientWidth * 0.09);
  zone.state = "TETRIS";
  loadPongPage("empty");
  //page.show("/TETRIS");
  loadTetrisPage("idle");
}
