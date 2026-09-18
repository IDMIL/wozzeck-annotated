import {ScoreTime, TimeManager} from "./TimeManager";
import {scene_bar_ranges} from "./data/sceneBarRanges";
import {capitalizeFirstLetter, text} from "./data/text";
import {getRomanNumerals, globals} from "./globals";
import {SectionManager, SectionRect} from "./SectionManager";

function getSceneNumber(scoreTime : ScoreTime) {
    const act = scoreTime.act;
    const bar = scoreTime.bar;
    const sceneRanges = scene_bar_ranges[act-1];
    let sceneNumber = 1;
    for (const range of sceneRanges) {
        if (bar >= range[0] && bar <= range[1]) {
            return sceneNumber;
        }
        sceneNumber++;
    }
    console.error("scene not found for", scoreTime);
    return 1;
}

function getSceneStartBar(act : number, scene : number) : number {
    return scene_bar_ranges[act - 1][scene - 1][0];
}

function getNumScenesInAct(act : number) : number {
    return scene_bar_ranges[act - 1].length;
}

// Shared by the page and measure icons: an arrow along the top, pointing the
// way the button goes, above a small pictogram of what it steps through.
// `direction` mirrors the arrow (and nothing else — the pictograms are
// symmetric).
const ICON_ATTRS = `xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`;

function arrowSvg(direction : "prev" | "next") : string {
    return direction === "prev"
        ? `<path d="M17 3.5H7M10 1L7 3.5L10 6"/>`
        : `<path d="M7 3.5H17M14 1L17 3.5L14 6"/>`;
}

// Open book: two facing pages that curve down into the spine.
function pageIcon(direction : "prev" | "next") : string {
    return `<svg ${ICON_ATTRS}>${arrowSvg(direction)}` +
        `<path d="M12 11C9.5 9.5 6 9.5 2.5 10.5V21C6 20 9.5 20 12 21.5C14.5 20 18 20 21.5 21V10.5C18 9.5 14.5 9.5 12 11Z"/>` +
        `<path d="M12 11V21.5"/></svg>`;
}

// One measure of sheet music: five staff lines closed off by a barline at
// each end.
function measureIcon(direction : "prev" | "next") : string {
    const staffLines = [11, 13.5, 16, 18.5, 21]
        .map(y => `<path d="M2.5 ${y}H21.5" stroke-width="1"/>`)
        .join('');
    return `<svg ${ICON_ATTRS}>${arrowSvg(direction)}${staffLines}` +
        `<path d="M2.5 11V21M21.5 11V21"/></svg>`;
}

function stepperButton(id : string, label : string, icon : string) : string {
    return `<button id="${id}" class="nav-step-button" title="${label}" aria-label="${label}">${icon}</button>`;
}

export class TransportManager extends SectionManager {
    constructor(tm : TimeManager, rect: SectionRect) {
        super("transport-section", rect);
        this.timeManager = tm;

        const transportSection = this.element;
        if (transportSection === null) {
            return;
        }

        const prevPage = capitalizeFirstLetter(text.PREV_PAGE[globals.language]);
        const nextPage = capitalizeFirstLetter(text.NEXT_PAGE[globals.language]);
        const prevBar = capitalizeFirstLetter(text.PREV_BAR[globals.language]);
        const nextBar = capitalizeFirstLetter(text.NEXT_BAR[globals.language]);
        const pageLabel = capitalizeFirstLetter(text.PAGE[globals.language]);
        const barLabel = capitalizeFirstLetter(text.BAR[globals.language]);

        const actButtons = Array.from({length: tm.getNumActs()}, (_, i) => i + 1)
            .map(act => `<button class="nav-choice" data-act="${act}">${getRomanNumerals(act)}</button>`)
            .join('');

        transportSection.innerHTML = `
      <h2>` + text.TRANSPORT[globals.language] + `</h2>
      <div id="nav-panel">
        <div class="nav-row">
          <span class="nav-label">` + text.ACT[globals.language] + `:</span>
          <div id="nav-act-choices" class="nav-choices">${actButtons}</div>
        </div>
        <div class="nav-row">
          <span class="nav-label">` + text.SCENE[globals.language] + `:</span>
          <div id="nav-scene-choices" class="nav-choices"></div>
        </div>
        <div class="nav-row nav-stepper">
          ${stepperButton("nav-prev-page", prevPage, pageIcon("prev"))}
          <input type="number" id="nav-page-input" title="${pageLabel}" aria-label="${pageLabel}"
                 min="${tm.getFirstPage()}" max="${tm.getLastPage()}" step="1">
          ${stepperButton("nav-next-page", nextPage, pageIcon("next"))}
        </div>
        <div class="nav-row nav-stepper">
          ${stepperButton("nav-prev-bar", prevBar, measureIcon("prev"))}
          <input type="number" id="nav-bar-input" title="${barLabel}" aria-label="${barLabel}" min="1" step="1">
          ${stepperButton("nav-next-bar", nextBar, measureIcon("next"))}
        </div>
      </div>`;

        // Rebuilds the scene buttons whenever the act changes, since each act
        // has its own number of scenes (see scene_bar_ranges).
        const sceneChoices = document.getElementById("nav-scene-choices");
        if (sceneChoices !== null) {
            sceneChoices.innerHTML = this.sceneButtonsHtml(tm.getCurrentAct());
        }

        document.getElementById("nav-act-choices")?.addEventListener("click", (e) => {
            const button = (e.target as HTMLElement).closest<HTMLElement>("[data-act]");
            if (button === null) return;
            const act = Number(button.dataset.act);
            this.timeManager.goToTime(act, getSceneStartBar(act, 1), "transport-click");
        });

        sceneChoices?.addEventListener("click", (e) => {
            const button = (e.target as HTMLElement).closest<HTMLElement>("[data-scene]");
            if (button === null) return;
            const act = this.timeManager.getCurrentAct();
            this.timeManager.goToTime(act, getSceneStartBar(act, Number(button.dataset.scene)), "transport-click");
        });

        document.getElementById("nav-prev-page")?.addEventListener("click",
            () => this.timeManager.advancePage(-1, "transport-click"));
        document.getElementById("nav-next-page")?.addEventListener("click",
            () => this.timeManager.advancePage(1, "transport-click"));
        document.getElementById("nav-prev-bar")?.addEventListener("click",
            () => this.timeManager.advanceBar(-1, "transport-click"));
        document.getElementById("nav-next-bar")?.addEventListener("click",
            () => this.timeManager.advanceBar(1, "transport-click"));

        const barInput = document.getElementById("nav-bar-input") as HTMLInputElement | null;
        if (barInput !== null) {
            barInput.addEventListener("change", () => {
                const act = this.timeManager.getCurrentAct();
                const bar = Math.max(1, Math.min(this.timeManager.getLengthOfAct(act), Math.round(Number(barInput.value)) || 1));
                this.timeManager.goToTime(act, bar, "transport-click");
            });
        }

        const pageInput = document.getElementById("nav-page-input") as HTMLInputElement | null;
        if (pageInput !== null) {
            pageInput.addEventListener("change", () => {
                const page = Math.max(this.timeManager.getFirstPage(), Math.min(this.timeManager.getLastPage(), Math.round(Number(pageInput.value)) || this.timeManager.getFirstPage()));
                this.timeManager.goToPage(page, "transport-click");
            });
        }

        this.initResizeHandles();
    }

    // The panel is a fixed cluster of controls, sized to fit them (see
    // computeDefaultRects in main.ts) — stretching it would only add dead space.
    protected isResizable(): boolean {
        return false;
    }

    private sceneButtonsHtml(act : number) : string {
        return Array.from({length: getNumScenesInAct(act)}, (_, i) => i + 1)
            .map(scene => `<button class="nav-choice" data-scene="${scene}">${scene}</button>`)
            .join('');
    }

    async timeUpdated(scoreTime : ScoreTime) {
        const actChoices = document.getElementById("nav-act-choices");
        const sceneChoices = document.getElementById("nav-scene-choices");
        const scene = getSceneNumber(scoreTime);

        if (actChoices !== null && sceneChoices !== null) {
            // The scene buttons depend on the act, so they must be rebuilt
            // whenever the act changes rather than just re-highlighted.
            if (sceneChoices.dataset.act !== scoreTime.act.toString()) {
                sceneChoices.dataset.act = scoreTime.act.toString();
                sceneChoices.innerHTML = this.sceneButtonsHtml(scoreTime.act);
            }
            for (const button of actChoices.querySelectorAll<HTMLElement>("[data-act]")) {
                button.classList.toggle("active", Number(button.dataset.act) === scoreTime.act);
            }
            for (const button of sceneChoices.querySelectorAll<HTMLElement>("[data-scene]")) {
                button.classList.toggle("active", Number(button.dataset.scene) === scene);
            }
        }

        const barInput = document.getElementById("nav-bar-input") as HTMLInputElement | null;
        if (barInput !== null && document.activeElement !== barInput) {
            barInput.value = scoreTime.bar.toString();
        }

        const pageInput = document.getElementById("nav-page-input") as HTMLInputElement | null;
        if (pageInput !== null && document.activeElement !== pageInput) {
            pageInput.value = this.timeManager.getCurrentAbsolutePage().toString();
        }
    }

    timeManager;
}
