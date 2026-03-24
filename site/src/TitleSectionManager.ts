import {text} from "./data/text";
import {globals} from "./globals";

export class TitleSectionManager {
    constructor() {
        const titleSection = document.getElementById("title-section");
        if (titleSection) {
            const otherLangPage = globals.language === 'en' ? 'fr.html' : 'en.html';
            const otherLangName = globals.language === 'en' ? 'FR' : 'EN';

            titleSection.innerHTML = `<h1>` + text[globals.language].TITLE + `</h1>
      <h3><a href="`+ otherLangPage + `">` + otherLangName + `</a></h3>`;
        }
    }
}