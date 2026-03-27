import { LanguageCode } from "./data/text";

export interface Globals {
    language : LanguageCode;
}


export var globals : Globals = { language: 'fr'};

export function getRomanNumerals(n : number) {
    switch (n) {
        case 1: return 'I';
        case 2: return 'II';
        case 3: return 'III';
        case 4: return 'IV';
        case 5: return 'V';
        default: return '';
    }
}