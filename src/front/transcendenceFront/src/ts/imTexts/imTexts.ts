type SupportedLanguages = 'fr' | 'en' | 'de' | 'ja';

import imTextsJson from './imTexts.json';
export const imTexts: {[key: string]: string} = {};
export let language: SupportedLanguages = 'fr';

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

// Initialisation avec la langue par défaut
imTextsSet(imTextsJson[language]);
