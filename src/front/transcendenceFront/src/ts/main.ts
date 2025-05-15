// @ts-ignore
import  page from 'page';
import {resetGamesSocket, UserInfo} from "./utils.ts";

// @ts-ignore
export const	address = import.meta.env.VITE_API_ADDRESS;
export const	content = document.getElementById("content");
export const	user = new UserInfo();

/**
 * localStorage:
 *  |    Key     |   Value  |
 *  |------------|----------|
 *  | "username" |  string  |
 */


export const	homePage = () => {
	if (!content)
		return ;

	content.innerHTML = `
		<h1>Welcome to Immanence</h1>
		<nav>
			<a href="/">Home</a>
			<a href="/tetris">Tetris</a>
			<a href="/pong">Pong</a>
			<a href="/login">Login</a>
			<a href="/logout">Logout</a>
			<a href="/sign-up">Register</a>
			${localStorage.getItem("username") !== null ? '<a href="/profil">Profile</a>' : '' }
		</nav>
	`;

	resetGamesSocket("home");
}
