// Events & core
import {resetGamesSocket, UserInfo} from "./utils.ts";
//import { evAddDocResize } from './zone/zoneEvents.ts'
import { EL, setHtmlFront, awaitMedias } from './zone/zoneHTML.ts';
import { modaleInit } from './modales/modalesCore.ts'
//import { zoneSet } from './zone/zoneCore.ts'
import {startRouter} from "./page/router.ts";
// adress
export const	address = import.meta.env.VITE_API_ADDRESS;
export const	user = new UserInfo();

// @ts-ignore page
import page from 'page';

///////////////////////////////////////////
// MAIN  
const main = () => {
    resetGamesSocket("HOME");
    setHtmlFront();
    EL.init();
    if (EL.check()) {
      modaleInit();
    }
    awaitMedias();
    startRouter();
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    main();
  });
