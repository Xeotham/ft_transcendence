import { TCS } from '../TCS.ts';

import closeIconImg from '../../medias/images/modales/croixSlate200.png';

export const modaleTetrisStatDetailHTML = `

  <div id="closeIcon" class="${TCS.modaleClose} hidden">
      <img src="${closeIconImg}" class="w-[10px] h-[10px]"/>
  </div>

  <div id="titre_signin" class="${TCS.modaleTitre}">
    Tetris Stats Detail<br>
  </div>
        
  <div id="texte_signin" class="${TCS.modaleTexte}">
    Texte signup<br>
    Texte signup<br>
    Texte signup<br><br>
  </div>

  <form id="form_signup" class="${TCS.form} w-5/6">
    <div id="username_div" class="${TCS.formDivInput}">
        <input type="email" name="username" id="username" class="${TCS.formInput}" placeholder=" " required />
        <label for="username" name="username_label" id="username_label" class="${TCS.formLabel}">Email address</label>
    </div>

    <div id="password_div" class="${TCS.formDivInput}">
        <input type="password" name="password" id="password" class="${TCS.formInput}" placeholder=" " required />
        <label for="password" name="password_label" id="password_label" class="${TCS.formLabel}">Password</label>
    </div>

    <div id="password_confirm_div" class="${TCS.formDivInput}">
        <input type="password" name="password_confirm" id="password_confirm" class="${TCS.formInput}" placeholder=" " required />
        <label for="password_confirm" name="password_confirm_label" id="password_confirm_label" class="${TCS.formLabel}">Password confirm</label>
    </div>

    <button type="button" id="signin_button" class="${TCS.formButton}">
      Continuer
    </button>
    <div id='h_space' class='h-4'/>

  </form>

`;