import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';

import { modaleAlert, modaleDisplay, modaleHide, ModaleType } from './modalesCore.ts';
import { address, postToApi, user } from "../utils.ts";
// @ts-ignore
import page from "page";
import { setZoneAvatar } from "../zone/zoneHTML.ts";
import { backgroundHandler, bgmPlayer, tetrisTexturesHandler, userKeys } from "../tetris/utils.ts";
import { pongPackHandler } from "../pong/utils.ts";

export const modaleSignUpHTML = () => {

	let SignUpHTML = `

  <div id="signupTitle" class="${TCS.modaleTitre}">
  ${imTexts.modalesSignupTitle}</div>
  
  <span id="signupBack" class="${TCS.modaleTexteLink}">
  ${imTexts.modalesFriendListBack}</span>
  
  <div class="h-[30px]"></div>
  
  <div id="signupText" class="${TCS.modaleTexte}">
  ${imTexts.modalesSignupText}</div>
  
  <div class="h-[30px]"></div>
  
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

	signupBack.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		modaleDisplay(ModaleType.SIGNIN);
	});
	signupForm.addEventListener('submit', (event: SubmitEvent) => {
		event.preventDefault();

		const username = (document.getElementById("signupUsername") as HTMLInputElement).value;
		const password = (document.getElementById("signupPassword") as HTMLInputElement).value;
		const confirmPassword = (document.getElementById("signupPasswordConfirm") as HTMLInputElement).value;

		if (username !== username.trim())
		{
			modaleAlert("Username cannot contain leading or trailing spaces");
			return;
		}

		if (password !== confirmPassword) {
			modaleAlert("Passwords do not match");
			return;
		}

		const data = {username: username, password: password};

		postToApi(`http://${address}/api/user/register`, data)
			.then(async () => {
				const info = await postToApi(`http://${address}/api/user/login`, data);
				user.setToken(info.token);
				user.setUsername(info.user.username);
				user.setAvatar(info.user.avatar);
				userKeys.resetKeys();
				pongPackHandler.setPack("retro1975");
				backgroundHandler.setActualBackground("bkg_1");
				tetrisTexturesHandler.setTexture("minimalist");
				bgmPlayer.choseBgm("none");
				setZoneAvatar(true);
				modaleHide()
			})
			.catch((error) => {
				console.error("Error signing up:", error.status, error.message);
				modaleAlert(error.message);
			});
	});

}