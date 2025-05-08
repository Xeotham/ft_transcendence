///////////////////////////////////////////
// Imports
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
 } from './frontZonesEvents.ts'

import { showModale, hideModale, ModaleType } from './frontModales.ts';
import { modale_signin, modale_signup } from './frontModalesHTML.ts';


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
  separatorShift: Math.floor(document.documentElement.clientWidth / 42),
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
      // console.log(`${String(property)} a changé: ${value}`);
      if (property === 'separatorPos') {
        resizeZones();
      }
      if (property === 'separatorPosTogo') {
        const intervalId = setInterval(() => {
          if (animGhost(1.2)) {
            clearInterval(intervalId);
          }
        }, 16);
      }
      return true;
    }
    return false;
  }
});

const animGhost = (dec: number = 1.3) => {
  zone.separatorPos = zone.separatorPosTogo - (zone.separatorPosTogo - zone.separatorPos) / dec;
  resizeZones();
  if (Math.abs(zone.separatorPos - zone.separatorPosTogo) < 1) {
    zone.separatorPosTogo = zone.separatorPos;
    resizeZones();
    return true;
  }
  return false;
}

const resizeZones = () => {
  const zonePong = document.querySelector<HTMLDivElement>('div[name="zonePong"]');
  if (zonePong) {
    zonePong.style.width = `${zone.separatorPos}px`;
  }
  const zoneTetris = document.querySelector<HTMLDivElement>('div[name="zoneTetris"]');
  if (zoneTetris) {
    zoneTetris.style.width = `${document.documentElement.clientWidth - zone.separatorPos}px`;
  }
  /*const modale = document.querySelector<HTMLDivElement>('div[name="zoneModale"]');
  if (modale) {
    modale.style.left = `${zone.separatorPos}px`;
  }*/
}

export const resizeDocument = () => {
  if (zone.state === 'HOME') {
      zone.separatorCenter = Math.floor(document.documentElement.clientWidth / 2);
      stateProxy.separatorPos = zone.separatorCenter; // a verifier quand fd clique
      zone.separatorShift = Math.floor(document.documentElement.clientWidth / zone.sepRatioShift);
  }
  // a faire mettre en place un pourcentage... puis le multiplier pour avoir les positions  
}

///////////////////////////////////////////
// App Query selector

export const setZone = (state: string) => {
  //console.log(state);
  if (!zone) {
    console.error('setZone: Unknown state');
    return;
  }
  if (zone.state === state) {
    return;
  }
  zone.state = state;
  console.log(zone.state);
  switch (zone.state) {
    case 'HOME':        { zoneSetHOME(); break; }
    case 'OVER_PONG':   { zoneSetOVER_PONG(); break; }
    case 'OVER_TETRIS': { zoneSetOVER_TETRIS(); break; }
    case 'PONG':        { zoneSetPONG(); break; }
    case 'TETRIS':      { zoneSetTETRIS(); break; }
    case 'MODALE':      { zoneSetHOME(); break; }         
    default: {
      console.error('setZone: Unknown state');
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
  stateProxy.separatorPosTogo = zone.separatorCenter;
  hideModale();
}

const zoneSetOVER_PONG = () => {
  stateProxy.separatorPosTogo = zone.separatorCenter + zone.separatorShift;
}

const zoneSetOVER_TETRIS = () => {
  stateProxy.separatorPosTogo = zone.separatorCenter - zone.separatorShift;
}

const zoneSetPONG = () => {
  stateProxy.separatorPosTogo = Math.floor(document.documentElement.clientWidth * 0.97);

  evRemOutDocument();
  evAdClickLogoHome();
  evRemOverPong();
  evRemClickPong();
  evRemOverTetris();
  evAdClickTetris();

  showModale(ModaleType.SIGNIN, modale_signin);
}

const zoneSetTETRIS = () => {
  stateProxy.separatorPosTogo = Math.floor(document.documentElement.clientWidth * 0.03);

  evRemOutDocument();
  evAdClickLogoHome();
  evRemOverPong();
  evAdClickPong();
  evRemOverTetris();
  evRemClickTetris();

  showModale(ModaleType.SIGNUP, modale_signup);
}
