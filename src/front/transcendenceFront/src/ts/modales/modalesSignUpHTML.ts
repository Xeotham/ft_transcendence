import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';

import closeIconImg from '../../medias/images/modales/croixSlate200.png';
import { modaleAlert } from './modalesCore.ts';

export const modaleSignUpHTML = () => {

  let SignUpHTML = `

  <div id="signupTitle" class="${TCS.modaleTitre} pb-[30px]">
  ${imTexts.modalesSignupTitle}</div>
        
  <div id="signupText" class="${TCS.modaleTexte} pb-[40px]">
  ${imTexts.modalesSignupText}</div>

  <form id="signupForm" class="${TCS.form} w-full">
    <div id="signupUsernameDiv" class="${TCS.formDivInput} pb-[6px]">
        <input type="text" name="signinUsername" id="signinUsername" class="${TCS.formInput}" placeholder=" " required />
        <label for="signinUsername" name="signinUsernameLabel" id="signinUsernameLabel" class="${TCS.formLabel}">
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

    // TODO: ajouter les événements pour le formulaire de connexion 

    event.preventDefault(); // TODO: supprimer
    modaleAlert("<span class='blink'>ALERT:</span><br>Quoi vous avez encore appuye... pauvre <b>fou</b>..."); // TODO: supprimer
  });

}