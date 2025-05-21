import { TCS } from '../TCS.ts';

import closeIconImg from '../../medias/images/modales/croixSlate200.png';

export const modaleSignInHTML = `

  <div id="closeIcon" class="${TCS.modaleClose} hidden">
      <img src="${closeIconImg}" class="w-[10px] h-[10px]" />
  </div>

  <div id="signinTitre" class="${TCS.modaleTitre} pb-[30px]">
    Immanence<br>
  </div>
        
  <div id="signinTexte" class="${TCS.modaleTexte} pb-[30px]">
    Nous te proposons de jouer à deux jeux, dans deux salles, avec deux ambiances différentes.<br>
    À droite Pong pour jouer en solo contre notre IA, en multijoueur ou en tournoi. <br>
    À gauche Tetris est disponible en solo, en multijoueur ou en tournoi.
  </div>

  <form id="signinForm" class="${TCS.form} w-full">
    <div id="signinUsernameDiv" class="${TCS.formDivInput} pb-[6px]">
        <input type="text" name="signinUsername" id="signinUsername" class="${TCS.formInput}" placeholder=" " required />
        <label for="signinUsername" name="signinUsernameLabel" id="signinUsernameLabel" class="${TCS.formLabel}">Email address</label>
    </div>
    <div id="signinPasswordDiv" class="${TCS.formDivInput} pb-[0px]">
        <input type="password" name="signinPassword" id="signinPassword" class="${TCS.formInput}" placeholder=" " required />
        <label for="signinPassword" name="signinPasswordLabel" id="signinPasswordLabel" class="${TCS.formLabel}">Password</label>
    </div>

    <button type="submit" id="signin_button" class="${TCS.formButton} flex justify-left w-full pb-[10px] y-[-200px]">Continuer</button>

    <div id="to_register_text" class="${TCS.modaleToRegister} pt-[20px] pb-[6px]">
      Tu n'as pas de compte ?
    </div>
    <a id="to_register_link" href="#" class="${TCS.modaleLink} flex justify-left w-full pb-[10px]">Enregistre-toi !</a>
    <br><br>

    </form>

`;
