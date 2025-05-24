import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';
import { ModaleType, modaleDisplay, modaleAlert } from './modalesCore.ts';


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

  // TODO: enlever les événements modaleBKG pour ne pas pouvoir cliquer sur le fond et fermer la modale

  signinForm.addEventListener('submit', (event: SubmitEvent) => {

    // TODO: ajouter les événements pour le formulaire de connexion 

    event.preventDefault(); // TODO: supprimer
    modaleAlert("Vous avez appuye sur le bouton, dommage..."); // TODO: supprimer
  });

  signinRegisterLink.addEventListener('click', () => {
    console.log("signinRegisterLink: click");
    modaleDisplay(ModaleType.SIGNUP);
  });

}

