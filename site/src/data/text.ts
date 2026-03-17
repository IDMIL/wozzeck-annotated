export type LanguageCode = "en" | "fr";

export const text = {
    'en' : {
        ACT: 'act',
        ACTS: 'acts',
        SCENE: 'scene',
        SCENES: 'scenes',
        SCENE_STRUCTURE: 'scene structure',
        BAR: 'bar',
        BARS: 'bars',
        BEAT: 'beat',
        PREV: 'previous',
        NEXT: 'next',
        TITLE: '<i>Wozzeck</i> Visual Score',
        BYLINE: 'By Arden Butterfield, François-Hugues Leclair, and Matthieu Galliker',
        ANNOTATIONS: 'Annotations',
        TIMELINES: 'Temporal Structure',
        VIDEO_PLAYER: 'Video Player',
        PAGE: 'page'
    },
    'fr' : {
        ACT: 'acte',
        ACTS: 'actes',
        SCENE: 'scène',
        SCENES: 'scenes',
        SCENE_STRUCTURE: 'structure scénique',
        BAR: 'mesure',
        BARS: 'mesures',
        BEAT: 'temps',
        PREV: 'précédent',
        NEXT: 'suivant',
        TITLE: 'Partition visuelle de <i>Wozzeck</i>',
        BYLINE: 'Par Arden Butterfield, François-Hugues Leclair et Matthieu Galliker',
        ANNOTATIONS: 'Annotations',
        TIMELINES: 'Structure temporelle',
        VIDEO_PLAYER: 'Lecteur vidéo',
        PAGE: 'page'
    }
}

export const capitalizeFirstLetter = <T extends string>(s: T) =>
    (s[0].toUpperCase() + s.slice(1)) as Capitalize<typeof s>;