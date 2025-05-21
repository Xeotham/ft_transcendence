import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';

import closeIconImg from '../../medias/images/modales/croixSlate200.png';

export const modaleSignUpHTML = `

  <!-- 
  <div id="closeIcon" class="${TCS.modaleClose} hidden">
  <img src="${closeIconImg}" class="w-[10px] h-[10px]"/></div>
  -->

  <div id="signupTitre" class="${TCS.modaleTitre} pb-[30px]">
  ${imTexts.modalesSignupTitre}</div>
        
  <div id="signupTexte" class="${TCS.modaleTexte} pb-[40px]">
  ${imTexts.modalesSignupTexte}</div>

  <form id="signinForm" class="${TCS.form} w-full">
    <div id="signinUsernameDiv" class="${TCS.formDivInput} pb-[6px]">
        <input type="text" name="signinUsername" id="signinUsername" class="${TCS.formInput}" placeholder=" " required />
        <label for="signinUsername" name="signinUsernameLabel" id="signinUsernameLabel" class="${TCS.formLabel}">
        ${imTexts.modalesSignupUsername}</label>
    </div>
    <div id="signinPasswordDiv" class="${TCS.formDivInput} pb-[6px]">
        <input type="password" name="signinPassword" id="signinPassword" class="${TCS.formInput}" placeholder=" " required />
        <label for="signinPassword" name="signinPasswordLabel" id="signinPasswordLabel" class="${TCS.formLabel}">
        ${imTexts.modalesSignupPassword}</label>
    </div>
    <div id="signinPasswordConfirmDiv" class="${TCS.formDivInput} pb-[0px]">
        <input type="password" name="signinPasswordConfirm" id="signinPasswordConfirm" class="${TCS.formInput}" placeholder=" " required />
        <label for="signinPasswordConfirm" name="signinPasswordConfirmLabel" id="signinPasswordConfirmLabel" class="${TCS.formLabel}">
        ${imTexts.modalesSignupPasswordConfirm}</label>
    </div>

    <button type="submit" id="signupButton" class="${TCS.formButton} -translate-y-[15px]">
    ${imTexts.modalesSignupEnter}</button>
  </form>

<div class="h-[40px]" />

`;