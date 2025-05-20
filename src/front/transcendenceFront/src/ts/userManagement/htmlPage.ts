// import { content } from "../immanence.ts";
//
// // export const loadUserHtml = (page: ) => {
// // 	switch (page) {
// // 		case "login":
// // 			return ;
// // 		case "logout":
// // 			return ;
// // 		case "sing-up":
// // 			return ;
// // 	}
// // }
//
// export const   loginHtml = (error: string | null = null) => {
// 	if (!content)
// 		return;
//
// 	content.innerHTML = `
// 	<div class="login">
// 		<h1>Login</h1>
// 		<div id="error" >
// 			<p>${error}</p>
// 		</div>
// 		<form id="login-form">
// 			<label for="username">Username:</label>
// 			<input type="text" id="username" name="username" required placeholder="Username">
// 			<label for="password">Password:</label>
// 			<input type="password" id="password" name="password" required placeholder="Password">
// 			<input type="submit"/>
// 		</form>
// 		<a href="/sign-up">Register</a>
// 		<a href="/">Home</a>
// 	</div>`
//
// 	const   errorDiv = document.getElementById("error") as HTMLDivElement;
//
// 	if (error)
// 		errorDiv.style.display = "block";
// 	else
// 		errorDiv.style.display = "none";
//
// }
//
// export const   logoutHtml = (error: string | null = null) => {
// 	if (!content)
// 		return;
//
// 	content.innerHTML = `
// 	<div class="logout">
// 		<h1>Logout</h1>
// 		<div id="error" >
// 			<p>${error}</p>
// 		</div>
// 		<button id="logout">Logout</button>
// 		<a href="/">Home</a>
// 	</div>`
//
// 	const   errorDiv = document.getElementById("error") as HTMLDivElement;
//
// 	if (error)
// 		errorDiv.style.display = "block";
// 	else
// 		errorDiv.style.display = "none";
// }
//
//
// export const   signUpHtml = (error: string | null = null) => {
// 	if (!content)
// 		return;
//
// 	content.innerHTML = `
// 	<div class="sign-up">
// 		<h1>Sign-Up</h1>
// 		<div id="error" >
// 			<p>${error}</p>
// 		</div>
// 		<form id="sign-up-form">
// 			<label for="username">Username:</label>
// 			<input type="text" id="username" name="username" required placeholder="username">
// 			<label for="password">Password:</label>
// 			<input type="password" id="password" name="password" required placeholder="password">
// 			<label for="confirm-password">Confirm Password:</label>
// 			<input type="password" id="confirm-password" name="confirm-password" required placeholder="confirm password">
// 			<label for="avatar">Avatar:</label>
// 			<input type="text" id="avatar" name="avatar" required placeholder="avatar">
// 			<input type="submit">Login</input>
// 		</form>
// 		<a href="/">Home</a>
// 	</div>`
//
// 	const   errorDiv = document.getElementById("error") as HTMLDivElement;
//
// 	if (error)
// 		errorDiv.style.display = "block";
// 	else
// 		errorDiv.style.display = "none";
// }
