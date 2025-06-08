import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';

import { modaleAlert, modaleDisplay, ModaleType } from './modalesCore.ts';
import { address, patchToApi, user } from "../utils.ts";
// @ts-ignore
import page from "page";

export const modaleEditHTML = () => {

	let SignUpHTML = `

    <div id="editUsername">
        <div id="editUsernameTitle" class="${TCS.modaleTitre}">
		${imTexts.modalesEditEditUsernameTitle}</div>

        <div id="editUserBack" class="${TCS.modaleTexteLink}">
		${imTexts.modalesFriendListBack}</div>

		<div class="h-[30px]"></div>

        <div id="editUsernameText" class="${TCS.modaleTexte} text-[20px]">
        ${imTexts.modalesEditEditUsernameText}</div>

		<div class="h-[20px]"></div>

        <form id="editUsernameForm" class="${TCS.form} w-full">
            
			<div id="previousUsernameDiv" class="${TCS.formDivInput} pb-[6px]">
                <input type="text" name="previousUsername" id="previousUsername" class="${TCS.formInput}" placeholder=" " required />
                <label for="previousUsername" name="previousUsernameLabel" id="previousUsernameLabel" class="${TCS.formLabel}">
                ${imTexts.modalesEditEditUsernamePrevious}</label>
            </div>
            
			<div id="newUsernameDiv" class="${TCS.formDivInput} pb-[6px]">
                <input type="text" name="newUsername" id="newUsername" class="${TCS.formInput}" placeholder=" " required />
                <label for="newUsername" name="newUsernameLabel" id="newUsernameLabel" class="${TCS.formLabel}">
				${imTexts.modalesEditEditUsernameNew}</label>
            </div>
            
			<button type="submit" id="editUsernameButton" class="${TCS.formButton} -translate-y-[15px]">
			${imTexts.modalesEditEditUsernameSubmit}</button>
        </form>
		
		<div class="h-[10px]"></div>
		
		<a id="editChosePassword" class="${TCS.modaleTexteLink}">
        ${imTexts.modalesEditChosePassword}</a>

		<div class="h-[30px]"></div>
    </div>

    <div id="editPassword">
	    <div id="editPasswordTitle" class="${TCS.modaleTitre}">
        ${imTexts.modalesEditEditPasswordTitle}</div>

        <div id="editPasswordBack" class="${TCS.modaleTexteLink}">
		${imTexts.modalesFriendListBack}</div>

		<div class="h-[30px]"></div>

        <div id="editPasswordText" class="${TCS.modaleTexte} text-[20px]">
        ${imTexts.modalesEditEditPasswordText}</div>

		<div class="h-[20px]"></div>

		<form id="editPasswordForm" class="${TCS.form} w-full">
			<div id="previousPasswordDiv" class="${TCS.formDivInput} pb-[6px]">
				<input type="password" name="previousPassword" id="previousPassword" class="${TCS.formInput}" placeholder=" " required />
				<label for="previousPassword" name="previousPasswordLabel" id="previousPasswordLabel" class="${TCS.formLabel}">
				${imTexts.modalesEditEditPasswordPrevious}</label>
			</div>

			<div id="newPasswordDiv" class="${TCS.formDivInput} pb-[6px]">
				<input type="password" name="newPassword" id="newPassword" class="${TCS.formInput}" placeholder=" " required />
				<label for="newPassword" name="newPasswordLabel" id="newPasswordLabel" class="${TCS.formLabel}">
					${imTexts.modalesEditEditPasswordNew}</label>
			</div>

			<div id="confirmPasswordDiv" class="${TCS.formDivInput} pb-[6px]">
				<input type="password" name="confirmPassword" id="confirmPassword" class="${TCS.formInput}" placeholder=" " required />
				<label for="confirmPassword" name="confirmPasswordLabel" id="confirmPasswordLabel" class="${TCS.formLabel}">
				${imTexts.modalesEditEditPasswordConfirm}</label>
			</div>

			<button type="submit" id="editPasswordButton" class="${TCS.formButton} -translate-y-[15px]">
			${imTexts.modalesEditEditPasswordSubmit}</button>
		</form>

		<div class="h-[10px]"></div>

		<a id="editChoseUsername" class="${TCS.modaleTexteLink}">
        ${imTexts.modalesEditChoseUsername}</a>

		<div class="h-[30px]"></div>
    </div>

	<div id="modaleAlert" class="${TCS.modaleTexte}"></div>
    


  <div class="h-[40px]" />

`;

	return SignUpHTML;
}

const   handleChangeUsernameForm =  async () => {
	const   changeUsernameForm = document.getElementById('editUsernameForm') as HTMLFormElement;

	if (!changeUsernameForm)
		return;
	changeUsernameForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const previousUsername = (document.getElementById('previousUsername') as HTMLInputElement).value;
		const newUsername = (document.getElementById('newUsername') as HTMLInputElement).value;

		if (previousUsername !== user.getUsername()) {
			modaleAlert("Previous username is not correct");
			return;
		}

		if (previousUsername === newUsername) {
			modaleAlert("New username must be different from previous username");
			return;
		}

		if (newUsername !== newUsername.trim())
		{
			modaleAlert("Username cannot contain leading or trailing spaces");
			return;
		}

		try {
			await patchToApi(`http://${address}/api/user/update-username`, { username: user.getUsername(), newUsername: newUsername });
			user.setUsername(newUsername);
			return await modaleDisplay(ModaleType.PROFILE);
		}
		catch (e: any) {
			modaleAlert(e.message);
			return;
		}
	});
}

const   handleChangePasswordForm = async () => {
	const   changePasswordForm = document.getElementById('editPasswordForm') as HTMLFormElement;

	if (!changePasswordForm)
		return;
	changePasswordForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const   previousPassword = (document.getElementById('previousPassword') as HTMLInputElement).value;
		const   newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
		const   confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

		if (newPassword !== confirmPassword) {
			modaleAlert(imTexts.modalesEditEditPasswordConfirmError);
			return;
		}

		if (previousPassword === newPassword) {
			modaleAlert(imTexts.modalesEditEditPasswordSameError);
			return;
		}
		try {
			await patchToApi(`http://${address}/api/user/update-password`, { username: user.getUsername(), previousPassword: previousPassword, newPassword: newPassword });
			return await modaleDisplay(ModaleType.PROFILE);
		}
		catch (error: any) {
			if (error.message == "Invalid password") {
				modaleAlert(imTexts.modalesEditEditPasswordPreviousError);
			}
			return;
		}
	});
}

export const modaleEditEvents = async (actualForm: string = "username") => {
	const   editChoseUsername = document.getElementById('editChoseUsername') as HTMLAnchorElement;
	const   editChosePassword = document.getElementById('editChosePassword') as HTMLAnchorElement;
	const   editUsername = document.getElementById('editUsername') as HTMLDivElement;
	const   editPassword = document.getElementById('editPassword') as HTMLDivElement;
	const   editUserBack = document.getElementById('editUserBack') as HTMLAnchorElement;
	const   editPasswordBack = document.getElementById('editPasswordBack') as HTMLAnchorElement;

	editUserBack.addEventListener('click', async (e: Event) => {
		e.stopPropagation();
		modaleDisplay(ModaleType.PROFILE);
	});
	editPasswordBack.addEventListener('click', async (e: Event) => {
		e.stopPropagation();
		modaleDisplay(ModaleType.PROFILE);
	})
	editChoseUsername?.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		modaleEditEvents("username");
	});
	editChosePassword?.addEventListener('click', (e: Event) => {
		e.stopPropagation();
		modaleEditEvents("password");
	});

	if (actualForm === "username") {
		editPassword.style.display = 'none';
		editUsername.style.display = 'block';
		return await handleChangeUsernameForm();
	}
	else {
		editPassword.style.display = 'block';
		editUsername.style.display = 'none';
		return await handleChangePasswordForm();
	}
}