import { TCS } from '../TCS.ts';
import { imTexts } from '../imTexts/imTexts.ts';

import closeIconImg from '../../medias/images/modales/croixSlate200.png';

export const modaleSignInHTML = `

  <!-- 
  <div id="closeIcon" class="${TCS.modaleClose} hidden">
  <img src="${closeIconImg}" class="w-[10px] h-[10px]"/></div>
  -->

  <div id="signinTitre" class="${TCS.modaleTitre} pb-[30px]">
  ${imTexts.modalesSigninTitre}</div>
        
  <div id="signinTexte" class="${TCS.modaleTexte} pb-[50px]">
  ${imTexts.modalesSigninTexte}</div>

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
  </form>

  <div id="to_register_text" class="${TCS.modaleToRegister} pt-[20px]">
    ${imTexts.modalesSigninNoAccount}
    <a id="to_register_link" href="#" class="${TCS.formButton}">
    ${imTexts.modalesSigninRegister}</a>
  </div>

  <div class="h-[40px]" />

`;
