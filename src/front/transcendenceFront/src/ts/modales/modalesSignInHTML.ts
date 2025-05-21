import { TCS } from '../TCS.ts';

import closeIconImg from '../../medias/images/modales/croixSlate200.png';
import { imTexts } from '../imTexts/imTexts.ts';

export const modaleSignInHTML = `

  <div id="closeIcon" class="${TCS.modaleClose} hidden">
      <img src="${closeIconImg}" class="w-[10px] h-[10px]" />
  </div>

  <div id="signinTitre" class="${TCS.modaleTitre} pb-[30px]">${imTexts.modalesSigninTitre}<br></div>
        
  <div id="signinTexte" class="${TCS.modaleTexte} pb-[30px]">${imTexts.modalesSigninTexte}</div>

  <form id="signinForm" class="${TCS.form} w-full">
    <div id="signinUsernameDiv" class="${TCS.formDivInput} pb-[6px]">
        <input type="text" name="signinUsername" id="signinUsername" class="${TCS.formInput}" placeholder=" " required />
        <label for="signinUsername" name="signinUsernameLabel" id="signinUsernameLabel" class="${TCS.formLabel}">${imTexts.modalesSigninUsername}</label>
    </div>
    <div id="signinPasswordDiv" class="${TCS.formDivInput} pb-[0px]">
        <input type="password" name="signinPassword" id="signinPassword" class="${TCS.formInput}" placeholder=" " required />
        <label for="signinPassword" name="signinPasswordLabel" id="signinPasswordLabel" class="${TCS.formLabel}">${imTexts.modalesSigninPassword}</label>
    </div>

    <button type="button" id="signinButton" class="${TCS.modaleLink} flex justify-left w-full pb-[10px] y-[-200px]">${imTexts.modalesSigninContinue}</button>

    <div id="to_register_text" class="${TCS.modaleToRegister} pt-[20px] pb-[6px]">
      ${imTexts.modalesSigninNoAccount}
    </div>
    <a id="to_register_link" href="#" class="${TCS.modaleLink} flex justify-left w-full pb-[10px]">${imTexts.modalesSigninRegister}</a>
    <br><br>

    </form>

`;
