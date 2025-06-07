import {TCS} from '../TCS.ts';
import {imTexts} from '../imTexts/imTexts.ts';

import {modaleAlert, modaleDisplay, modaleHide, ModaleType} from './modalesCore.ts';
import {address, postToApi, user} from "../utils.ts";
// @ts-ignore
import page from "page";

export const modaleSignUpHTML = () => {

	let SignUpHTML = `

  <div id="signupTitle" class="${TCS.modaleTitre} pb-[30px]">
  ${imTexts.modalesSignupTitle}</div>
  
  <span id="signupBack" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesFriendListBack}</span>
        
  <div id="signupText" class="${TCS.modaleTexte} pb-[40px]">
  ${imTexts.modalesSignupText}</div>
  
  <form id="signupForm" class="${TCS.form} w-full">
    <div id="signupUsernameDiv" class="${TCS.formDivInput} pb-[6px]">
        <input type="text" name="signupUsername" id="signupUsername" class="${TCS.formInput}" placeholder=" " required />
        <label for="signupUsername" name="signupUsernameLabel" id="signupUsernameLabel" class="${TCS.formLabel}">
        ${imTexts.modalesSignupUsername}</label>
    </div>
    <div id="signupPasswordDiv" class="${TCS.formDivInput} pb-[6px]">
        <input type="password" name="signupPassword" id="signupPassword" class="${TCS.formInput}" placeholder=" " required />
        <label for="signupPassword" name="signupPasswordLabel" id="signupPasswordLabel" class="${TCS.formLabel}">
        ${imTexts.modalesSignupPassword}</label>
    </div>
    <div id="signupPasswordConfirmDiv" class="${TCS.formDivInput} pb-[0px]">
        <input type="password" name="signupPasswordConfirm" id="signupPasswordConfirm" class="${TCS.formInput}" placeholder=" " required />
        <label for="signupPasswordConfirm" name="signupPasswordConfirmLabel" id="signupPasswordConfirmLabel" class="${TCS.formLabel}">
        ${imTexts.modalesSignupPasswordConfirm}</label>
    </div>

    <button type="submit" id="signupButton" class="${TCS.formButton} -translate-y-[15px]">
    ${imTexts.modalesSignupEnter}</button>
  </form>

  <div id="modaleAlert" class="${TCS.modaleTexte}"></div>

  <div class="h-[40px]" />

`;

	return SignUpHTML;
}

export const modaleSignUpEvents = () => {

	const   signupForm = document.getElementById('signupForm') as HTMLFormElement;
	const   signupBack = document.getElementById('signupBack') as HTMLAnchorElement;

	if (!signupForm)
		return;

	signupBack.addEventListener('click', () => {
		modaleDisplay(ModaleType.SIGNIN);
	});
	signupForm.addEventListener('submit', (event: SubmitEvent) => {
		event.preventDefault();

		const username = (document.getElementById("signupUsername") as HTMLInputElement).value;
		const password = (document.getElementById("signupPassword") as HTMLInputElement).value;
		const confirmPassword = (document.getElementById("signupPasswordConfirm") as HTMLInputElement).value;

		if (password !== confirmPassword) {
			modaleAlert("Passwords do not match");
			return;
		}

		const data = {username: username, password: password};

		// console.log(data);
		postToApi(`http://${address}/api/user/register`, data)
			.then(async () => {
				// console.log("User registered successfully");
				// alert("Registered successfully!");
				const info = await postToApi(`http://${address}/api/user/login`, data);
				user.setToken(info.token);
				user.setUsername(info.user.username);
				user.setAvatar(info.user.avatar);
				modaleHide()
			})
			.catch((error) => {
				console.error("Error signing up:", error.status, error.message);
				modaleAlert(error.message);
			});
	});

}