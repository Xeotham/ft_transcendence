// @ts-ignore
import  page from 'page';

// Define your routes
import  { homePage } from "../main.ts";
import  { pongRouter } from "./pongRouter.ts";
import  { tetrisRouter } from "./tetrisRouter.ts";
import  { loadTetrisTextures } from "../tetris/tetris.ts";
import {loginUser, logoutUser,signUpUser} from "../userManagement/userManagement.ts";
import { displayProfil } from '../dashboards/dasboards.ts';
import {loadPongTextures} from "../pong/pong.ts";

page('/', homePage);

pongRouter();

tetrisRouter();

page('/login', () => {
	loginUser();
	// alert("Page under construction");
});

page('/logout', () => {
	logoutUser();
	// alert("Page under construction");
});

page('/logout', () => {
	logoutUser();
	// alert("Page under construction");
});

page('/sign-up', () => {
	signUpUser();
	// alert("Page under construction");
});

page('/profil', () => {
	displayProfil();
	// alert("Page under construction");
});

page('/profil', () => {
	displayProfil();
	// alert("Page under construction");
});

// TODO: Change all the route to return to a more SPA work (Matchmaking, solo, private room, tournament)

page('*', () => {
	console.log('404 Not Found');
	page.show("/")
});


await loadTetrisTextures().then(() => {console.log("Tetris Textures Loaded");}).catch( (error) => (console.error(error)));
await loadPongTextures  ().then(() => {console.log("Pong Textures Loaded");}).catch( (error) => (console.error(error)));
// Start the router
page();
