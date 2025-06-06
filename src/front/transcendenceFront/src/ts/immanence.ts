// Events & core
import { address, postToApi, resetGamesSocket, user } from "./utils.ts";
//import { evAddDocResize } from './zone/zoneEvents.ts'
import { EL, setHtmlFront, awaitMedias, setZoneAvatar } from './zone/zoneHTML.ts';
import { modaleInit } from './modales/modalesCore.ts'
//import { zoneSet } from './zone/zoneCore.ts'
import { startRouter } from "./page/router.ts";

// @ts-ignore page
import page from 'page';

///////////////////////////////////////////

// MAIN  
const main = () => {
    resetGamesSocket("home");
    setHtmlFront();
    EL.init();
    if (!EL.check())
      return;
    setZoneAvatar(false); //TODO: false -> true 
    awaitMedias();
    startRouter();
    modaleInit();
}

window.onload = async () => {
    if (user.getToken()) {
        try {
            console.log("User already connected, loading user data...");
            const response = await postToApi(`http://${address}/api/user/connect-user`, { username: user.getUsername() })
            if (response)
                user.setAvatar(response.user.avatar);
        } catch (error) {
            console.error('Error connecting user:', error);
        }
    }
}

window.onbeforeunload = async () => {
    if (user.getToken()) {
        try {
            await postToApi(`http://${address}/api/user/disconnect-user`, { username: user.getUsername() });
        } catch (error) {
            console.error('Error disconnecting user:', error);
        }
    }
}


// Start the app
document.addEventListener('DOMContentLoaded', () => {
    main();
    // syncKeys()
});
