// @ts-ignore
import  page from 'page';

// Define your routes
import  { homePage } from "../main.ts";
import  { pongRouter } from "./pongRouter.ts";
import  { tetrisRouter } from "./tetrisRouter.ts";
import {loadTetrisTextures} from "../tetris/tetris.ts";

page('/', homePage);

pongRouter();

tetrisRouter();

page('/login', () => {
	alert("Page under construction");
});

page('/register', () => {
	alert("Page under construction");
});

// TODO: Change all the route to return to a more SPA work (Matchmaking, solo, private room, tournament)

page('*', () => {
	console.log('404 Not Found');
	page.show("/")
});


await loadTetrisTextures().then(() => {console.log("Textures Loaded");}).catch( (error) => (console.error(error)));

// Start the router
page();
