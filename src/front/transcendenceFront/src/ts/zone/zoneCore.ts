///////////////////////////////////////////
// Imports
// @ts-ignore
import  page from "page"
// HTML
import { EL } from './zoneHTML.ts';
import { loadPongPage } from '../pong/pong.ts';
import { loadTetrisPage } from '../tetris/tetris.ts';
import { modaleDisplay, ModaleType } from '../modales/modalesCore.ts';

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

} from './zoneEvents.ts'
// Modales
import { modaleHide } from '../modales/modalesCore.ts';
import { user } from "../utils.ts";

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
export const zone: Zone = {
	state: 'NO',
	separatorCenter: Math.floor(document.documentElement.clientWidth / 2),
	separatorPos: Math.floor(document.documentElement.clientWidth / 2),
	separatorPosTogo: Math.floor(document.documentElement.clientWidth / 2),
	separatorShift: Math.floor(document.documentElement.clientWidth / 12),
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
						if (zone.state === 'PONG')
							loadTetrisPage("empty");
						else if (zone.state === 'TETRIS')
							loadPongPage("empty");
						else {
							loadPongPage("logo");
							loadTetrisPage("logo");
						}

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
	if (EL.zoneAvatar) {
		EL.zoneAvatar.style.left = `${zone.separatorPos - 50}px`;
	}

}

export const documentResize = () => {
	if (zone.state === 'HOME' || zone.state === 'OVER_PONG' || zone.state === 'OVER_TETRIS') {
		zone.separatorCenter = Math.floor(document.documentElement.clientWidth / 2);
		stateProxy.separatorPos = zone.separatorCenter;
		zone.separatorShift = Math.floor(document.documentElement.clientWidth / zone.sepRatioShift);
	}
}

///////////////////////////////////////////
// App Query selector

export const zoneSet = (state: string) => {
	if (!zone) {
		console.error('zoneSet: Unknown state');
		return;
	}
	if (!user.isAuthenticated()) {
		modaleDisplay(ModaleType.SIGNIN);
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
	evAdOverPong();
	evAdOverTetris();
	evAdClickPong();
	evAdClickTetris();

	if (EL.zonePong ) { EL.zonePong.style.cursor = "pointer"; }
	if (EL.zoneTetris) { EL.zoneTetris.style.cursor = "pointer"; }

	stateProxy.separatorPosTogo = zone.separatorCenter;
	zone.state = "HOME";
	loadPongPage("logo");
	loadTetrisPage("logo");
}

const zoneSetOVER_PONG = () => {
	stateProxy.separatorPosTogo = zone.separatorCenter + zone.separatorShift;
}

const zoneSetOVER_TETRIS = () => {
	stateProxy.separatorPosTogo = zone.separatorCenter - zone.separatorShift;
}

const zoneSetPONG = () => {
	evRemOutDocument();
	evRemOverPong();
	evRemClickPong();
	evRemOverTetris();
	evAdClickTetris();
	if (EL.zonePong ) EL.zonePong.style.cursor = "default";
	if (EL.zoneTetris) EL.zoneTetris.style.cursor = "pointer";

	modaleHide();

	stateProxy.separatorPosTogo = Math.floor(document.documentElement.clientWidth * 0.91);
	zone.state = "PONG";
	loadTetrisPage("empty");
}

const zoneSetTETRIS = () => {
	evRemOutDocument();
	evRemOverPong();
	evAdClickPong();
	evRemOverTetris();
	evRemClickTetris();
	if (EL.zonePong ) EL.zonePong.style.cursor = "pointer";
	if (EL.zoneTetris) EL.zoneTetris.style.cursor = "default";

	modaleHide();

	stateProxy.separatorPosTogo = Math.floor(document.documentElement.clientWidth * 0.09);
	zone.state = "TETRIS";
	loadPongPage("empty");
	//loadTetrisPage("idle");
}

export const	hideZoneGame = () => {
	if (EL.zoneGame && !EL.zoneGame.classList.contains("hidden"))
		EL.zoneGame.classList.add("hidden");
	if (EL.zonePong && EL.zonePong.classList.contains("hidden"))
		EL.zonePong.classList.remove("hidden");
	if (EL.zoneTetris && EL.zoneTetris.classList.contains("hidden"))
		EL.zoneTetris.classList.remove("hidden");
	if (EL.zoneAvatar && EL.zoneAvatar.classList.contains("hidden"))
		EL.zoneAvatar.classList.remove("hidden");
}

export const	showZoneGame = () => {
	if (EL.zoneGame && EL.zoneGame.classList.contains("hidden"))
		EL.zoneGame.classList.remove("hidden");
	if (EL.zonePong && !EL.zonePong.classList.contains("hidden"))
		EL.zonePong.classList.add("hidden");
	if (EL.zoneTetris && !EL.zoneTetris.classList.contains("hidden"))
		EL.zoneTetris.classList.add("hidden");
	if (EL.zoneAvatar && !EL.zoneAvatar.classList.contains("hidden"))
		EL.zoneAvatar.classList.add("hidden");
}
