import { LanguageCode, text } from "./data/text";
import {TimeManager} from "./TimeManager";
import {ScoreManager} from "./ScoreManager";
import {TransportManager} from "./TransportManager";
import {TimelineManager} from "./TimelineManager";
import {AnnotationManager} from "./AnnotationManager";
import {globals} from "./globals";

function buildWindow(lang : LanguageCode ) {
    globals.language = lang;

    const otherLangPage = lang === 'en' ? 'fr.html' : 'en.html';
    const otherLangName = lang === 'en' ? 'FR' : 'EN';

    document.body.innerHTML  = `
        <div id="content">
  <div id="layout-sections">
    <div class="section" id="title-section">
      <h1>` + text[globals.language].TITLE + `</h1>
      <h2>` + text[globals.language].BYLINE + `</h2>
      <h3><a href="`+ otherLangPage + `">` + otherLangName + `</a></h3>
    </div>
    <div class="section" id="timelines-section">
      <h2>` + text[globals.language].TIMELINES + `</h2>
    </div>
    <div class="section" id="score-viewer-section">
    <div id="image-holder">
      <img class="score-page-image" id="score-viewer-image" src="data/pages/sheet5.png" alt="Page 5"/>
      <div id="current-bar-overlay" class="score-overlay"></div>
    </div>
    </div>
    <div class="section" id="annotations-section">
      <h2>` + text[lang].ANNOTATIONS + `</h2>
    </div>
    <div class="section" id="transport-section">
      <div id="position-text">
        <p class="level-name">` + text[lang].ACT + `</p>
        <p id="transport-act-number">1</p>
        <p class="level-name">` + text[lang].SCENE + `</p>
        <p id="transport-scene-number">1</p>
        <p class="level-name">` + text[lang].BAR + `</p>
        <p id="transport-bar-number">1</p>
        <p class="level-name">` + text[lang].BEAT + `</p>
        <p id="transport-beat-number">1</p>
      </div>
      <div class="transport buttons">
        <button id="prev-bar-button">` + text[lang].PREV + `</button>
        <button id="next-bar-button">` + text[lang].NEXT + `</button>
      </div>
    </div>
    <div class="section" id="video-player-section">
      <h2>` + text[lang].VIDEO_PLAYER + `</h2>
    </div>
  </div>
</div>
    `;

    let timeManager = new TimeManager();

    let scoreManager = new ScoreManager(timeManager);
    let transportManager = new TransportManager(timeManager);
    let timelineManager = new TimelineManager(timeManager);
    let annotationManager = new AnnotationManager(timeManager);

    timeManager.listeners.push(scoreManager);
    timeManager.listeners.push(transportManager);
    timeManager.listeners.push(timelineManager);
    timeManager.listeners.push(annotationManager);

    timeManager.notifyListeners();

}

// Expose to window so index.html can call it
(window as any).buildWindow = buildWindow;