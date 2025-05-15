// @ts-ignore
import  page from 'page';
import {resetGamesSocket} from "./utils.ts";

// @ts-ignore
export const	address = import.meta.env.VITE_API_ADDRESS;
export const	content = document.getElementById("content");

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
			<a href="/sign-up">Register</a>
		</nav>
	`;

	resetGamesSocket("home");
}
