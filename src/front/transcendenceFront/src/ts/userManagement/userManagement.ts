import { postToApi, address, user } from "../utils.ts";
// @ts-ignore
import page from "page";

export const signInUser = () => {

	document.getElementById("signinForm")!.addEventListener("submit", async (event) => {
		event.preventDefault();

		const   username = (document.getElementById("signinUsername") as HTMLInputElement).value;
		const   password = (document.getElementById("signinPassword") as HTMLInputElement).value;

		const   data = { username: username, password:  password };
		postToApi(`http://${address}/api/user/login`, data)
			.then(() => {
				localStorage.setItem("username", username);
				user.setUsername(username);
				page.show("/");
			})
			.catch((error) => {
				console.error("Error logging in:", error.status, error.message);
				alert(error.message);
			});
	})
}

export const signOutUser = () => {

	document.getElementById("logout")!.addEventListener("click", async (event) => {
		event.preventDefault();

		const user = { username: localStorage.getItem("username")};
		postToApi(`http://${address}/api/user/logout`, user)
			.then(() => {
				localStorage.clear();
				alert("User signed out successfully!");
				page.show("/");
			})
			.catch((error) => {
				console.error("Error logging out:", error.status, error.message);
				alert(error.message);
			});
	})
}


export const isLoggedIn = (): boolean => {

	if (localStorage.getItem("username"))
		return true;
	else
		return false;
}


export const    signUpUser = () => {
	document.getElementById("form_signup")!.addEventListener("submit", async (event) => {
		event.preventDefault();

		const username = (document.getElementById("username") as HTMLInputElement).value;
		const password = (document.getElementById("password") as HTMLInputElement).value;
		const confirmPassword = (document.getElementById("password_confirm") as HTMLInputElement).value;
		const avatar = "sss";

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		const data = {username: username, password: password, avatar: avatar};

		console.log(data);
		postToApi(`http://${address}/api/user/register`, data)
		.then(() => {
			alert("Registered successfully!");
		})
		.catch((error) => {
			console.error("Error signing up:", error.status, error.message);
			alert(error.message);
		});
	});
}