import {ScoreTime, TimeManager, TimeManagerListener} from "./TimeManager";
import {Annotation, AnnotationCode, annotations} from "./data/annotations";
import {globals} from "./globals";
import {text} from "./data/text";

export class AnnotationManager extends TimeManagerListener {
    annotationCodes : { [code in AnnotationCode] : string; } = {
        'dy' : 'Dynamiques',
        'du': 'Durée',
        'form' : 'Formes',
        'int' : 'Intonation',
        'mo' : 'Motifs',
        'tim' : 'Timbre'
    }

    soloedAnnotationCategories : Array<AnnotationCode> = [];
    private timeManager: TimeManager;

    constructor(timeManager : TimeManager) {
        super();

        this.timeManager = timeManager;

        let annotationsSection = document.getElementById('annotations-section');
        if (annotationsSection === null) {
            return;
        }

        let annotationTypeSelectorDiv = document.createElement('div');
        annotationTypeSelectorDiv.id = 'annotation-type-selectors';

        Object.keys(this.annotationCodes).forEach((key) => {
            const code = key as AnnotationCode;
            let codeButton = document.createElement('button');
            codeButton.innerText = this.annotationCodes[code];
            codeButton.classList.add('annotation-type');
            codeButton.classList.add(code + '-annotation-type');
            codeButton.onclick = (event) => {
                console.log(event.shiftKey);
                if (event.shiftKey && !this.soloedAnnotationCategories.includes(code)) {
                    this.soloedAnnotationCategories.push(code);
                } else if (event.shiftKey) {
                    return;
                } else if (this.soloedAnnotationCategories.includes(code)) {
                    this.soloedAnnotationCategories = this.soloedAnnotationCategories.filter(item => item !== code);
                } else {
                    this.soloedAnnotationCategories = [code];
                }
                this.setAnnotationVisibilityFromState();
            }
            annotationTypeSelectorDiv.appendChild(codeButton);
        });

        annotationsSection.appendChild(annotationTypeSelectorDiv);

        let scrollerDiv = document.createElement('div');
        scrollerDiv.id = 'annotations-scroller';
        scrollerDiv.classList.add('scroller-area');
        annotationsSection.appendChild(scrollerDiv);

        for (const annotation of annotations) {
            let annotationDiv = document.createElement("div");
            annotationDiv.classList.add("annotation");
            annotationDiv.classList.add(annotation.code + "-annotation");
            let timeStampDiv = document.createElement("div");
            timeStampDiv.classList.add("annotation-time-stamp");
            timeStampDiv.innerText = this.getStringForTimestamp(annotation);
            annotationDiv.appendChild(timeStampDiv);

            let annotationTextDiv = document.createElement("div");
            annotationTextDiv.classList.add("annotation-text");
            annotationTextDiv.innerText = annotation.annotation;
            annotationDiv.appendChild(annotationTextDiv);

            annotationDiv.onclick = () => {
                this.timeManager.goToTime(annotation.act, annotation.measure_range[0], 1);
            }

            scrollerDiv.appendChild(annotationDiv);
        }
    }

    getStringForTimestamp(annotation : Annotation) {
        const act_scene = text[globals.language]["ACT"] + ' ' +
            annotation.act + ', ' + text[globals.language]["SCENE"] + ' ' +
            this.timeManager.getScene(annotation.act, annotation.measure_range[0]);

        const mr = annotation.measure_range;
        const measure = (mr[0] === mr[1]) ?
            (text[globals.language]["BAR"] + ' ' + mr[0]) :
            (text[globals.language]["BARS"] + ' ' + mr[0] + '–' + mr[1]);

        return act_scene + ', ' + measure;
    }

    setAnnotationVisibilityFromState() {
        if (this.soloedAnnotationCategories.length === 0) {
            for (const elem of document.getElementsByClassName('annotation-type')) {
                elem.classList.remove('annotation-type-hidden');
            }

            for (const elem of document.getElementsByClassName('annotation')) {
                elem.classList.remove('annotation-hidden');
            }
            return;
        }

        for (const key in this.annotationCodes) {
            for (const elem of document.getElementsByClassName(key + '-annotation-type')) {
                if (this.soloedAnnotationCategories.includes(key as AnnotationCode)) {
                    elem.classList.remove('annotation-type-hidden');
                } else {
                    elem.classList.add('annotation-type-hidden');
                }
            }
        }

        for (const key in this.annotationCodes) {
            if (this.soloedAnnotationCategories.includes(key as AnnotationCode)) {
                for (const elem of document.getElementsByClassName(key + '-annotation')) {
                    elem.classList.remove('annotation-hidden');
                }
            } else {
                for (const elem of document.getElementsByClassName(key + '-annotation')) {
                    elem.classList.add('annotation-hidden');
                }
            }
        }
    }

    timeUpdated(scoreTime : ScoreTime) {
        const scroller = document.getElementById('annotations-scroller');
        if (scroller === null) {
            return;
        }
        let annotationDivs = scroller.children;
        for (let i = 0; i < annotationDivs.length; i++) {
            if ((annotations[i].act === scoreTime.act) &&
                (annotations[i].measure_range[0] <= scoreTime.bar) &&
                (annotations[i].measure_range[1] >= scoreTime.bar)) {
                annotationDivs[i].classList.add("current-annotation");
                annotationDivs[i].scrollIntoView();
            } else {
                annotationDivs[i].classList.remove("current-annotation");
            }
        }
    }
}