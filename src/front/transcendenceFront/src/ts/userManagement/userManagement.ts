import  { loginHtml, logoutHtml,signUpHtml } from "./htmlPage.ts";
import {postToApi} from "../utils.ts";
import {address} from "../main.ts";
// @ts-ignore
import page from "page";

export const loginUser = (error: string | null = null) => {
	loginHtml(error);

	document.getElementById("login-form")!.addEventListener("submit", async (event) => {
		event.preventDefault();

		const   username = (document.getElementById("username") as HTMLInputElement).value;
		const   password = (document.getElementById("password") as HTMLInputElement).value;

		const   data = { username: username, password:  password };
		postToApi(`http://${address}/api/user/login`, data)
			.then(() => {
				localStorage.setItem("username", username);
				page.show("/");
			})
			.catch((error) => {
				console.error("Error logging in:", error.status, error.message);
				loginUser(error.message);
			});
	})
}

export const logoutUser = (error: string | null = null) => {
	logoutHtml(error);

	document.getElementById("logout")!.addEventListener("click", async (event) => {
		event.preventDefault();

		const user = { username: localStorage.getItem("username")};
		postToApi(`http://${address}/api/user/logout`, user)
			.then(() => {
				localStorage.clear();
				page.show("/");
			})
			.catch((error) => {
				console.error("Error logging out:", error.status, error.message);
				logoutUser(error.message);
			});
	})
}


export const isLoggedIn = (): boolean => {
	
	if (localStorage.getItem("username"))
		return true;
	else
		return false;
}


export const    signUpUser = (error: string | null = null) => {
	signUpHtml(error);
	document.getElementById("sign-up-form")!.addEventListener("submit", async (event) => {
		event.preventDefault();

		const username = (document.getElementById("username") as HTMLInputElement).value;
		const password = (document.getElementById("password") as HTMLInputElement).value;
		const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;
		const avatar = (document.getElementById("avatar") as HTMLInputElement).value;

		if (password !== confirmPassword) {
			signUpUser("Passwords do not match");
			return;
		}

		const data = {username: username, password: password, avatar: avatar};

		postToApi(`http://${address}/api/user/register`, data)
		.then(() => {
			console.log("User registered successfully");
			page.show("/login");
		})
		.catch((error) => {
			console.error("Error signing up:", error.status, error.message);
			signUpUser(error.message);
		});
	});
}