import { TCS } from "../TCS.ts";
import { EL } from "../zone/zoneHTML.ts";
import { imTexts } from "../imTexts/imTexts.ts";

// @ts-ignore
import  page from 'page';
import { pongPackHandler } from "./utils.ts";

export const   pongSettingsHtml = () => {
	if (!EL.contentPong)
		return ;
	EL.contentPong.innerHTML = `
	<div class="${TCS.tetrisWindowBkg}">

		<div id="pongSettingsTitle" class="${TCS.gameTitle}">
		${imTexts.pongModalesSettingsTitle}</div>
		
		<div class="${TCS.gameTexte} translate-y-[-5px]">
		<a id="pongSettingsBack" class="${TCS.modaleTexteLink}">
		${imTexts.pongModalesBack}</a></div>	

		<div class="h-[30px]"></div>

		<img id="packSelect1" src="/src/medias/images/packSelect/packSelect_1.jpg" alt="Retro" class="${TCS.gamePackImg}">
		<div class="h-[10px]"></div>

		<img id="packSelect2" src="/src/medias/images/packSelect/packSelect_2.jpg" alt="Phantom" class="${TCS.gamePackImg}">
		<div class="h-[10px]"></div>

		<img id="packSelect3" src="/src/medias/images/packSelect/packSelect_3.jpg" alt="Tv world" class="${TCS.gamePackImg}">
		<div class="h-[10px]"></div>

		<img id="packSelect4" src="/src/medias/images/packSelect/packSelect_4.jpg" alt="Retro 1975" class="${TCS.gamePackImg}">
		<div class="h-[10px]"></div>

		<img id="packSelect5" src="/src/medias/images/packSelect/packSelect_5.jpg" alt="Dark Hours" class="${TCS.gamePackImg}">

		<div class="h-[30px]"></div>

	</div>`;

	pongSettingsEvents();
}

const   pongSettingsEvents = () => {

	const pongSettingsBack = document.getElementById("pongSettingsBack");

	pongSettingsBack?.addEventListener("click", () => {
		page.show("/pong");
	});

	const packSelect1 = document.getElementById("packSelect1");
	const packSelect2 = document.getElementById("packSelect2");
	const packSelect3 = document.getElementById("packSelect3");
	const packSelect4 = document.getElementById("packSelect4");
	const packSelect5 = document.getElementById("packSelect5");	
	
	packSelect1?.addEventListener("click", () => {
		pongPackHandler.setPack("retro1975");
		page.show("/pong");
	});
	packSelect2?.addEventListener("click", () => {
		pongPackHandler.setPack("retro");
		page.show("/pong");
	});
	packSelect3?.addEventListener("click", () => {
		pongPackHandler.setPack("tv_world");
		page.show("/pong");
	});
	packSelect4?.addEventListener("click", () => {
		pongPackHandler.setPack("phantom");
		page.show("/pong");
	});
	packSelect5?.addEventListener("click", () => {
		pongPackHandler.setPack("dark_hour");
		page.show("/pong");
	});
}
