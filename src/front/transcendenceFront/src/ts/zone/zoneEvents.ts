import {
	zoneSet,
	documentResize,
} from './zoneCore.ts'

// @ts-ignore
import  page from "page"
import { signUpUser, signInUser } from "../userManagement/userManagement.ts";

let outDocumentHandler: EventListener | null = null;
let overPongHandler: EventListener | null = null;
let overTetrisHandler: EventListener | null = null;
let clickPongHandler: EventListener | null = null;
let clickTetrisHandler: EventListener | null = null;
let clickLogoHomeHandler: EventListener | null = null;
let clickSignUpHandler: EventListener | null = null;
let clickSignInHandler: EventListener | null = null;

///////////////////////////////////////////
// mouseout - HOME
export const evAdOutDocument = () => {
	if (window && !outDocumentHandler) {
		outDocumentHandler = (event: Event) => {
			const mouseEvent = event as MouseEvent;

			const activeElement = document.activeElement;
			const isInModale = activeElement?.closest('#contentModale') !== null;

			if (!mouseEvent.relatedTarget && !isInModale) {
				zoneSet('HOME');
			}
		};
		window.addEventListener('mouseout', outDocumentHandler);
	}
}
export const evRemOutDocument = () => {
	if (window && outDocumentHandler) {
		window.removeEventListener('mouseout', outDocumentHandler);
		outDocumentHandler = null;
	}
}

///////////////////////////////////////////
// click - PONG
export const evAdClickPong = () => {
	const target = document.querySelector<HTMLDivElement>('div[name="zonePong"]');
	if (target && !clickPongHandler) {
		clickPongHandler = () => {
			page.show("/pong");
		};
		target.addEventListener('click', clickPongHandler);
	}
}
export const evRemClickPong = () => {
	const target = document.querySelector<HTMLDivElement>('div[name="zonePong"]');
	if (target && clickPongHandler) {
		target.removeEventListener('click', clickPongHandler);
		clickPongHandler = null;
	};
}

///////////////////////////////////////////
// click - Tetris
export const evAdClickTetris = () => {
	const target = document.querySelector<HTMLDivElement>('div[name="zoneTetris"]');
	if (target && !clickTetrisHandler) {
		clickTetrisHandler = () => {
			page.show("/tetris");
		};
		target.addEventListener('click', clickTetrisHandler);
	}
}
export const evRemClickTetris = () => {
	const target = document.querySelector<HTMLDivElement>('div[name="zoneTetris"]');
	// const target = document.getElementById('logoTetris');
	if (target && clickTetrisHandler) {
		target.removeEventListener('click', clickTetrisHandler);
		clickTetrisHandler = null;
	};
}

///////////////////////////////////////////
// over - Pong
export const evAdOverPong = () => {
	const target = document.querySelector<HTMLDivElement>('div[name="zonePong"]');
	if (target && !overPongHandler) {
		overPongHandler = () => {
			zoneSet('OVER_PONG');
		};
		target.addEventListener('mouseover', overPongHandler);
	}
}
export const evRemOverPong = () => {
	const target = document.querySelector<HTMLDivElement>('div[name="zonePong"]');
	if (target && overPongHandler) {
		target.removeEventListener('mouseover', overPongHandler);
		overPongHandler = null;
	};
}

///////////////////////////////////////////
// over - Tetris
export const evAdOverTetris = () => {
	const target = document.querySelector<HTMLDivElement>('div[name="zoneTetris"]');
	if (target && !overTetrisHandler) {
		overTetrisHandler = () => {
			zoneSet('OVER_TETRIS');
		};
		target.addEventListener('mouseover', overTetrisHandler);
	}
}
export const evRemOverTetris = () => {
	const target = document.querySelector<HTMLDivElement>('div[name="zoneTetris"]');
	if (target && overTetrisHandler) {
		target.removeEventListener('mouseover', overTetrisHandler);
		overTetrisHandler = null;
	};
}

///////////////////////////////////////////
// click - Home

export const evAdClickLogoHome = () => {
	const target = document.querySelector<HTMLImageElement>('#logoImmanence');
	if (target && !clickLogoHomeHandler) {
		clickLogoHomeHandler = () => {
			page.show("/");
		};
		target.addEventListener('click', clickLogoHomeHandler);
	}
}
export const evRemClickLogoHome = () => {
	const target = document.querySelector<HTMLImageElement>('#logoImmanence');
	if (target && clickLogoHomeHandler) {
		target.removeEventListener('click', clickLogoHomeHandler);
		clickLogoHomeHandler = null;
	};
}

// Écouteur d'événement pour redimensionner
export const evAddDocResize = () => {
	window.addEventListener('resize', documentResize);
}

///////////////////////////////////////////
// click - SignUp

export const  evAdClickSignUp = () => {
	//const target = document.querySelector<HTMLButtonElement>('#signup_button');
	const target = document.getElementById('signup_button');
	if (target && !clickSignUpHandler) {
		clickSignUpHandler = () => {
			signUpUser();
		};
		target.addEventListener('click', clickSignUpHandler);
	}
}

///////////////////////////////////////////
// click - SigIn

export const evAdClickSignIn = () => {
	const target = document.getElementById('signin_button');
	if (target && !clickSignInHandler) {
		clickSignInHandler = () => {
			signInUser();
		}
		target.addEventListener('click', clickSignInHandler);
	}
}