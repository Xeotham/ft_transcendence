import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';

import { modaleAlert } from './modalesCore.ts';
import {postToApi} from "../utils.ts";
import {address} from "../immanence.ts";
// @ts-ignore
import  page from "page";

export const modaleSignUpHTML = () => {

  let SignUpHTML = `

  <div id="signupTitle" class="${TCS.modaleTitre} pb-[30px]">
  ${imTexts.modalesSignupTitle}</div>
        
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

  const signupForm = document.getElementById('signupForm') as HTMLFormElement;

  if (!signupForm)
    return;
  
  signupForm.addEventListener('submit', (event: SubmitEvent) => {
      event.preventDefault();

      const username = (document.getElementById("signupUsername") as HTMLInputElement).value;
      const password = (document.getElementById("signupPassword") as HTMLInputElement).value;
      const confirmPassword = (document.getElementById("signupPasswordConfirm") as HTMLInputElement).value;
      // const avatar = (document.getElementById("avatar") as HTMLInputElement).value;
      // const avatar = `http://${address}/src/medias/avatars/avatar1.png`;
      // console.log(username, password, confirmPassword);

      if (password !== confirmPassword) {
          modaleAlert("Passwords do not match");
          return;
      }

      const data = {username: username, password: password};

      // console.log(data);
      postToApi(`http://${address}/api/user/register`, data)
          .then(() => {
              // console.log("User registered successfully");
              // alert("Registered successfully!");
              page("/");
              // page.show("/login");
          })
          .catch((error) => {
              console.error("Error signing up:", error.status, error.message);
              alert(error.message);
          });
  });

}