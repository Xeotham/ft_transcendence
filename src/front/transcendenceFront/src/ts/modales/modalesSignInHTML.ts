import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay, modaleAlert, modaleHide } from './modalesCore.ts';
import { postToApi, address, user } from "../utils.ts";
import { backgroundHandler, bgmPlayer, tetrisTexturesHandler, userKeys } from "../tetris/utils.ts";
import { setZoneAvatar } from "../zone/zoneHTML.ts";
import { pongPackHandler } from "../pong/utils.ts";


export const modaleSignInHTML = () => {
	let SignInHTML = `

  <div id="signinTitle" class="${TCS.modaleTitre} pb-[30px]">
  ${imTexts.modalesSigninTitle}</div>

  <div id="signinText" class="${TCS.modaleTexte} pb-[50px]">
  ${imTexts.modalesSigninText}</div>

  <form id="signinForm" class="${TCS.form} w-full">
    <div id="signinUsernameDiv" class="${TCS.formDivInput} pb-[6px]">
        <input type="text" name="signinUsername" id="signinUsername" class="${TCS.formInput}" placeholder=" " required />
        <label for="signinUsername" name="signinUsernameLabel" id="signinUsernameLabel" class="${TCS.formLabel}">
        ${imTexts.modalesSigninUsername}</label>
    </div>
    <div id="signinPasswordDiv" class="${TCS.formDivInput}">
        <input type="password" name="signinPassword" id="signinPassword" class="${TCS.formInput}" placeholder=" " required />
        <label for="signinPassword" name="signinPasswordLabel" id="signinPasswordLabel" class="${TCS.formLabel}">
        ${imTexts.modalesSigninPassword}</label>
    </div>

    <button type="submit" id="signinButton" class="${TCS.formButton} -translate-y-[15px]">
    ${imTexts.modalesSigninEnter}</button>

    <div id="modaleAlert" class="${TCS.modaleTexte}"></div>
  </form>

  <div id="signinRegisterText" class="${TCS.modaleToRegister} pt-[20px]">
    ${imTexts.modalesSigninNoAccount}
    <a id="signinRegisterLink" class="${TCS.formButton}">
    ${imTexts.modalesSigninRegister}</a>
  </div>

  <div class="h-[40px]" />

`;

	return SignInHTML;
}

export const modaleSignInEvents = () => {

	const signinForm = document.getElementById('signinForm') as HTMLFormElement;
	const signinRegisterLink = document.getElementById('signinRegisterLink') as HTMLAnchorElement;

	if (!signinForm || !signinRegisterLink)
		return;

	signinForm.addEventListener('submit', (event: SubmitEvent) => {
		event.preventDefault();

		const   username = (document.getElementById("signinUsername") as HTMLInputElement).value;
		const   password = (document.getElementById("signinPassword") as HTMLInputElement).value;

		const   data = { username: username, password:  password };
		// console.log(data);
		postToApi(`http://${address}/api/user/login`, data)
			.then(async (info: any) => {
				localStorage.setItem("username", username);
				user.setToken(info.token);
				user.setUsername(info.user.username);
				user.setAvatar(info.user.avatar);
				userKeys.resetKeys();
				pongPackHandler.setPack("retro1975");
				backgroundHandler.setActualBackground("bkg_1");
				tetrisTexturesHandler.setTexture("minimalist");
				bgmPlayer.choseBgm("none");
				setZoneAvatar(true);
				modaleHide();
			})
			.catch((error) => {
				console.error("Error logging in:", error.status, error.message);
				modaleAlert(error.message);
			});
	});

	signinRegisterLink.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		modaleDisplay(ModaleType.SIGNUP);
	});

}

