///////////////////////////////////////////
// Imports
import './style/style.css'
import { TCS } from './style/TCS.ts';

import immanenceLogo from '/src/medias/images/front/flamingtext_3.png';

import { evAddDocResize } from './frontZonesEvents.ts'
import { setZone } from './frontZones.ts'
import { initModale } from './frontModales.ts'

///////////////////////////////////////////
// setHtmlFront
const setHtmlFront = () => {
  // html & body
  document.querySelectorAll('html, body').forEach((el) => {
    el.classList.add('m-0', 'h-full');
  });
  // #app
  let app = document.querySelector<HTMLDivElement>('#app');
  if(app) {
    app.classList.add('h-full');
    app.innerHTML = 
    `
<div name="zoneTop" id="zoneTop" class="${TCS.zoneTop}">
    <img id="logoImmanence" src="${immanenceLogo}" alt="Immanence" class="${TCS.immanenceLogo}" />
</div>

<div name="zonePong" id="zonePong" class="${TCS.zonePong}"></div>

<div name="zoneTetris" id="zoneTetris" class="${TCS.zoneTetris}"></div>

<div name="zoneModale" id="zoneModale" class="${TCS.modale} hidden"></div>

  `
  }
}

///////////////////////////////////////////
// MAIN  

document.addEventListener('DOMContentLoaded', () => {
  evAddDocResize();  
  setHtmlFront();
  initModale();
  setZone('HOME');
});
