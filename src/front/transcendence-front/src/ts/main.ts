// import	{ responseFormat, Game, RoomInfo, TournamentInfo } from "./utils";
import	{ idlePage } from "./pong/pong.ts";

export const	address = "localhost";
export const	content = document.getElementById("content");

export const	homePage = () => {
	if (!content)
		return ;

	content.innerHTML = `
		<h1>Welcome to Immanence</h1>
		<button id="tetris">Tetris</button>
		<button id="pong">Pong</button>
		<button id="login">Login</button>
		<button id="register">Register</button>
	`;

	document.getElementById("tetris")?.addEventListener("click", () => {
		alert("Page under construction");
	});
	document.getElementById("pong")?.addEventListener("click", () => {
		idlePage();
	});
	document.getElementById("login")?.addEventListener("click", () => {
		alert("Page under construction");
	});
	document.getElementById("register")?.addEventListener("click", () => {
		alert("Page under construction");
	});
}

homePage()
