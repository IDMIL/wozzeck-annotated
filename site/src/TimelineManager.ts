import {ScoreTime, TimeManager} from "./TimeManager";
import {scene_bar_ranges} from "./data/sceneBarRanges";
import {getRomanNumerals, globals} from "./globals";
import {text} from "./data/text";
import {SectionManager, SectionRect, IS_MOBILE_LAYOUT, GAP} from "./SectionManager";
import {bar_to_page} from "./data/barToPage";

export class TimelineManager extends SectionManager {
    constructor(tm : TimeManager, rect: SectionRect) {
        // Pinned chrome like the title bar (see TitleSectionManager) — always
        // visible right below it, not draggable/resizable. Still one of
        // PanelVisibilityManager's toggleable panels, but has no × of its own
        // and no floating title tab — its h2 just stays in normal flow at the
        // panel's top left.
        super("timelines-section", rect, false, false, false);
        this.timeManager = tm;

        let actLengths = [];
        let totalLength = 0;
        for (const actBarRanges of scene_bar_ranges) {
            const l = actBarRanges[actBarRanges.length - 1][1] + 1 - actBarRanges[0][0];
            totalLength += l;
            actLengths.push(l);
        }

        let timelineSection = this.element;
        if (timelineSection === null) {
            return;
        }

        const heading = document.createElement("h2");
        heading.innerText = text.TIMELINES[globals.language];
        timelineSection.appendChild(heading);

        let actsSection = document.createElement("div");
        actsSection.id = "acts-timeline";
        actsSection.classList.add("timeline-container");
        let actsHeading = document.createElement("h3");
        actsHeading.innerText = text.ACTS[globals.language];
        let actsTimeline = document.createElement("div");
        actsTimeline.classList.add("timeline");

        actsSection.appendChild(actsHeading);
        actsSection.appendChild(actsTimeline);
        timelineSection.appendChild(actsSection);


        let scenesSection = document.createElement("div");
        scenesSection.id = "scenes-timeline";
        scenesSection.classList.add("timeline-container");
        let scenesHeading = document.createElement("h3");
        scenesHeading.innerText = text.SCENES[globals.language];
        let scenesTimeline = document.createElement("div");
        scenesTimeline.classList.add("timeline");

        scenesSection.appendChild(scenesHeading);
        scenesSection.appendChild(scenesTimeline);
        timelineSection.appendChild(scenesSection);


        let sceneStructureSection = document.createElement("div");
        sceneStructureSection.id = "scene-structure-timeline";
        sceneStructureSection.classList.add("timeline-container");
        let sceneStructureHeading = document.createElement("h3");
        sceneStructureHeading.innerText = text.SCENE_STRUCTURE[globals.language];
        let sceneStructureTimeline = document.createElement("div");
        sceneStructureTimeline.id = "scene-structure-bars";
        sceneStructureTimeline.classList.add("timeline");
        this.sceneStructureTimeline = sceneStructureTimeline;

        sceneStructureSection.appendChild(sceneStructureHeading);
        sceneStructureSection.appendChild(sceneStructureTimeline);
        timelineSection.appendChild(sceneStructureSection);

        // Bar cells are too narrow to hold their own number (see
        // #renderSceneStructureBars), so the current measure's number is
        // shown in this free-floating label instead, positioned in
        // #positionMeasureLabel just outside the current cell. A second,
        // identically-styled label tracks whatever measure the mouse is
        // hovering, and takes priority if the two would overlap (see
        // #updateLabelCollision).
        let currentMeasureLabel = document.createElement("div");
        currentMeasureLabel.id = "timeline-current-measure-label";
        currentMeasureLabel.classList.add("timeline-measure-label");
        sceneStructureSection.appendChild(currentMeasureLabel);
        this.currentMeasureLabel = currentMeasureLabel;

        let hoverMeasureLabel = document.createElement("div");
        hoverMeasureLabel.id = "timeline-hover-measure-label";
        hoverMeasureLabel.classList.add("timeline-measure-label");
        hoverMeasureLabel.style.display = "none";
        sceneStructureSection.appendChild(hoverMeasureLabel);
        this.hoverMeasureLabel = hoverMeasureLabel;

        this.sceneStructureSection = sceneStructureSection;

        window.addEventListener("resize", () => this.#updateCurrentMeasureLabel());

        for (let i = 0; i < actLengths.length; i++) {
            let actDiv = document.createElement("div");
            actDiv.id = "timeline-act-" + (i + 1);
            actDiv.classList.add("timeline-button");
            actDiv.classList.add("timeline-act");
            let actDivText = document.createElement("span");
            actDivText.innerText = getRomanNumerals(i + 1);
            actDiv.append(actDivText);
            actDiv.style.width = (actLengths[i] * 100 / totalLength) + "%";
            actDiv.onclick = () => {
                this.timeManager.goToTime(i + 1, 1, 'timeline-click');
            }
            actDiv.onmouseenter = () => {
                this.timeManager.preloadTime({act: i + 1, bar: 1, barLength: 1});
            }

            actsTimeline.appendChild(actDiv);
        }

        let actNumber = 1;
        for (const actBarRange of scene_bar_ranges) {
            // Scenes are grouped into a per-act wrapper sized with the exact
            // same width expression as the corresponding act div above
            // (actLengths[i] * 100 / totalLength), rather than each scene
            // being sized as a fraction of totalLength directly. Flexbox
            // rounds each item's fractional pixel width independently per
            // container, accumulating the leftover remainder differently
            // depending on how many siblings are in that row — so on narrow
            // screens, the many-item scenes row and the 3-item acts row
            // round to different pixel boundaries even though the
            // percentages are mathematically equal, leaving the two rows
            // misaligned. Giving the acts row and the scenes row identical
            // 3-item flex structure (one wrapper per act, same widths, same
            // order) makes the browser round them identically, and scenes
            // are then sized relative to their own act's length so they
            // exactly fill their wrapper regardless of rounding.
            let actWrapper = document.createElement("div");
            actWrapper.classList.add("timeline-scene-group");
            actWrapper.style.width = (actLengths[actNumber - 1] * 100 / totalLength) + "%";

            let sceneNumber = 1;
            for (const sceneBarRange of actBarRange) {
                let sceneDiv = document.createElement("div");
                sceneDiv.id = "timeline-act-" + actNumber + "-scene-" + sceneNumber;
                sceneDiv.classList.add("timeline-button");
                sceneDiv.classList.add("timeline-scene");
                sceneDiv.style.width = ((sceneBarRange[1] + 1 - sceneBarRange[0]) * 100 / actLengths[actNumber - 1]) + "%";
                let sceneDivText = document.createElement("span");
                sceneDivText.innerText = sceneNumber.toString();
                sceneDiv.appendChild(sceneDivText);
                const a = actNumber;
                const sceneBar = sceneBarRange[0];
                sceneDiv.onclick = () => {
                    this.timeManager.goToTime(a, sceneBar, 'timeline-click');
                }

                sceneDiv.onmouseenter = () => {
                    this.timeManager.preloadTime({act: a, bar: sceneBar, barLength: 1});
                }
                actWrapper.appendChild(sceneDiv);
                sceneNumber++;
            }
            scenesTimeline.appendChild(actWrapper);
            actNumber++;
        }

        this.#renderSceneStructureBars();

        this.initResizeHandles();
    }

    // On mobile, this bar is pinned chrome outside the flex-stacked panels
    // (see main.ts buildWindow), which reserves room for it by padding the
    // stack's container — closing/reopening the bar here needs to shrink or
    // restore that padding to match, or the stack is left with a dead gap
    // (or overlaps the bar) where it used to be. Desktop doesn't need this:
    // there the stack isn't padded to make room, panels just get dragged
    // out from underneath it.
    protected onVisibilityChanged(_visible: boolean): void {
        if (!IS_MOBILE_LAYOUT) return;
        const layoutSections = document.getElementById("layout-sections");
        const titleElement = document.getElementById("title-section");
        if (layoutSections === null || titleElement === null || this.element === null) return;
        const titleHeight = titleElement.getBoundingClientRect().height;
        const timelineHeight = this.element.getBoundingClientRect().height;
        layoutSections.style.paddingTop = `${titleHeight + timelineHeight + GAP}px`;
    }

    // The scene-structure row is rebuilt whenever the current scene changes
    // (see timeUpdated), since each scene has a different number of bars —
    // one equal-width button per bar, matching the look of the act/scene
    // rows above.
    #renderSceneStructureBars() {
        this.sceneStructureTimeline.innerHTML = "";
        // The bar div a hover listener refers to is about to be discarded,
        // and no mouseleave fires for that — reset the hover label so it
        // can't be left showing stale info pointing at a removed cell.
        this.hoverMeasureLabel.style.display = "none";

        const act = this.timeManager.getCurrentAct();
        const scene = this.timeManager.getCurrentScene();
        const sceneRange = scene_bar_ranges[act - 1][scene - 1];
        const sceneStart = sceneRange[0];
        const numBars = sceneRange[1] + 1 - sceneRange[0];

        for (let bar = sceneRange[0]; bar <= sceneRange[1]; bar++) {
            let barDiv = document.createElement("div");
            barDiv.id = "timeline-structure-bar-" + bar;
            barDiv.dataset.bar = String(bar);
            barDiv.classList.add("timeline-button", "timeline-structure-bar");
            barDiv.style.width = (100 / numBars) + "%";
            barDiv.onclick = () => {
                this.timeManager.goToTime(act, bar, 'timeline-click');
            }
            barDiv.onmouseenter = () => {
                this.timeManager.preloadTime({act, bar, barLength: 1});
                this.#positionMeasureLabel(this.hoverMeasureLabel, bar, barDiv, sceneStart, numBars);
                this.hoverMeasureLabel.style.display = "flex";
                this.#updateLabelCollision();
            }
            barDiv.onmouseleave = () => {
                this.hoverMeasureLabel.style.display = "none";
                this.#updateLabelCollision();
            }
            this.sceneStructureTimeline.appendChild(barDiv);
        }

        this.#renderedStructureAct = act;
        this.#renderedStructureScene = scene;
    }

    async timeUpdated(_ : ScoreTime) {

        const act = this.timeManager.getCurrentAct();
        const scene = this.timeManager.getCurrentScene();

        const actsElement = document.getElementById("acts-timeline");
        if (actsElement !== null) {
            for (const child of actsElement.getElementsByClassName('timeline-button')) {
                if (child.id === "timeline-act-" + act) {
                    child.classList.add("current-act");
                } else {
                    child.classList.remove("current-act");
                }
            }
        }

        const scenesElement = document.getElementById("scenes-timeline");
        if (scenesElement !== null) {
            for (const child of scenesElement.getElementsByClassName('timeline-button')) {
                if (child.id === "timeline-act-" + act + "-scene-" + scene) {
                    child.classList.add("current-scene");
                } else {
                    child.classList.remove("current-scene");
                }
            }
        }

        if (act !== this.#renderedStructureAct || scene !== this.#renderedStructureScene) {
            this.#renderSceneStructureBars();
        }

        // Bars sharing the current page's image are highlighted a lighter
        // blue (see .current-page-bar) — the same page-membership check
        // ScoreManager uses to decide which bars to overlay on the score
        // image itself.
        const bar = this.timeManager.getCurrentBarWithinAct();
        const currentImage = bar_to_page[act - 1][bar]?.image;
        for (const child of this.sceneStructureTimeline.children) {
            const barDiv = child as HTMLElement;
            const isCurrent = barDiv.id === "timeline-structure-bar-" + bar;
            barDiv.classList.toggle("current-scene", isCurrent);

            const onCurrentPage = !isCurrent && currentImage !== undefined
                && bar_to_page[act - 1][Number(barDiv.dataset.bar)]?.image === currentImage;
            barDiv.classList.toggle("current-page-bar", onCurrentPage);
        }

        this.#updateCurrentMeasureLabel();
    }

    #updateCurrentMeasureLabel() {
        const act = this.timeManager.getCurrentAct();
        const scene = this.timeManager.getCurrentScene();
        const sceneRange = scene_bar_ranges[act - 1][scene - 1];
        const bar = this.timeManager.getCurrentBarWithinAct();
        const currentBarDiv = document.getElementById("timeline-structure-bar-" + bar);
        if (currentBarDiv === null) {
            return;
        }

        this.#positionMeasureLabel(
            this.currentMeasureLabel, bar, currentBarDiv,
            sceneRange[0], sceneRange[1] + 1 - sceneRange[0]);
        this.#updateLabelCollision();
    }

    // Shared placement logic for both the current-measure and hovered-measure
    // labels: sits just outside its bar, flipping to the other side once
    // that bar is past the halfway point of the scene so it never runs off
    // the edge of the row.
    #positionMeasureLabel(label : HTMLDivElement, bar : number, barDiv : HTMLElement, sceneStart : number, sceneLength : number) {
        const sectionRect = this.sceneStructureSection.getBoundingClientRect();
        const barRect = barDiv.getBoundingClientRect();
        const pastHalfway = (bar - sceneStart) / sceneLength > 0.5;

        label.innerText = String(bar);
        label.classList.toggle("left", pastHalfway);
        label.style.left = (pastHalfway ? barRect.left : barRect.right) - sectionRect.left + "px";
    }

    // The hovered-measure label takes priority over the current-measure one
    // whenever showing both would let them overlap.
    #updateLabelCollision() {
        if (this.hoverMeasureLabel.style.display === "none") {
            this.currentMeasureLabel.style.visibility = "visible";
            return;
        }

        const hoverRect = this.hoverMeasureLabel.getBoundingClientRect();
        const currentRect = this.currentMeasureLabel.getBoundingClientRect();
        const overlap = hoverRect.left < currentRect.right && currentRect.left < hoverRect.right;
        this.currentMeasureLabel.style.visibility = overlap ? "hidden" : "visible";
    }

    timeManager;
    sceneStructureTimeline! : HTMLDivElement;
    sceneStructureSection! : HTMLDivElement;
    currentMeasureLabel! : HTMLDivElement;
    hoverMeasureLabel! : HTMLDivElement;
    #renderedStructureAct : number | null = null;
    #renderedStructureScene : number | null = null;
}