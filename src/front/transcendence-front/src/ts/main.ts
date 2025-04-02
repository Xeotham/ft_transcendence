// @ts-ignore
import  page from 'page';

// @ts-ignore
export const	address = "DUMMY_ADDRESS";
export const	content = document.getElementById("content");

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
			<a href="/register">Register</a>
		</nav>
	`;
}
