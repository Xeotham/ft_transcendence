export type SupportedLanguages = 'fr' | 'en' | 'de' | 'es';

import imTextsJsonLoad from './imTexts.json';
export const imTextsJson = imTextsJsonLoad;
export const imTexts: {[key: string]: string} = {};
export let language: SupportedLanguages = localStorage.getItem('language') as SupportedLanguages || "fr";

function imTextsSet(obj: any, prefix: string = '') {
	for (const key in obj) {
		let newKey = "";
		if (prefix === '')
			newKey = key;
		else
			newKey = prefix + key.charAt(0).toUpperCase() + key.slice(1);
		if (typeof obj[key] === 'object') {
			imTextsSet(obj[key], newKey);
		} else {
			imTexts[newKey] = obj[key];
		}
	}
}

export const imSetLanguage = (lang: SupportedLanguages) => {
	if (lang !== 'fr' && lang !== 'en' && lang !== 'de' && lang !== 'es') {
		lang = "fr";
	}

	imTextsSet(imTextsJson[lang]);
	language = lang;
	localStorage.setItem('language', lang);
}
