import {ScoreTime, TimeManager, TimeManagerListener} from "./TimeManager";
import {scene_bar_ranges} from "./data/sceneBarRanges";

export class TimelineManager extends TimeManagerListener {
    constructor(tm : TimeManager) {
        super();
        this.timeManager = tm;

        let actLengths = [];
        let totalLength = 0;
        for (const actBarRanges of scene_bar_ranges) {
            const l = actBarRanges[actBarRanges.length - 1][1] - actBarRanges[0][0];
            totalLength += l;
            actLengths.push(l);
        }

        let actsTimeline = document.getElementById("acts-timeline");
        if (actsTimeline !== null) {
            for (let i = 0; i < actLengths.length; i++) {
                let actDiv = document.createElement("div");
                actDiv.id = "timeline-act-" + (i + 1);
                actDiv.classList.add("timeline-button");
                actDiv.classList.add("timeline-act");
                actDiv.innerText = (i + 1).toString();
                actDiv.style.width = (actLengths[i] * 100 / totalLength) + "%";
                actDiv.onclick = () => {
                    this.timeManager.goToTime(i + 1, 1, 1);
                }
                actDiv.onmouseenter = () => {
                    this.timeManager.preloadTime({act: i + 1, bar: 1, beat: 1, barLength: 1});
                }


                actsTimeline.appendChild(actDiv);
            }
        }

        let scenesTimeline = document.getElementById("scenes-timeline");
        if (scenesTimeline !== null) {
            let actNumber = 1;
            for (const actBarRange of scene_bar_ranges) {
                let sceneNumber = 1;
                for (const sceneBarRange of actBarRange) {
                    let sceneDiv = document.createElement("div");
                    sceneDiv.id = "timeline-act-" + actNumber + "-scene-" + sceneNumber;
                    sceneDiv.classList.add("timeline-button");
                    sceneDiv.classList.add("timeline-scene");
                    sceneDiv.style.width = ((sceneBarRange[1] - sceneBarRange[0]) * 100 / totalLength) + "%";
                    sceneDiv.innerText = sceneNumber.toString();
                    const a = actNumber;
                    const sceneBar = sceneBarRange[0];
                    sceneDiv.onclick = () => {
                        this.timeManager.goToTime(a, sceneBar, 1);
                    }

                    sceneDiv.onmouseenter = () => {
                        this.timeManager.preloadTime({act: a, bar: sceneBar, beat: 1, barLength: 1});
                    }
                    scenesTimeline.appendChild(sceneDiv);
                    sceneNumber++;
                }
                actNumber++;
            }
        }

        let sceneStructureTimeline = document.getElementById("scene-structure-timeline");
        if (sceneStructureTimeline !== null) {
            let sceneStructureDiv = document.createElement("div");
            sceneStructureDiv.classList.add("timeline-button");
            sceneStructureDiv.id = "scene-structure-button";
            sceneStructureDiv.style.width = "100%";
            sceneStructureTimeline.appendChild(sceneStructureDiv);

            let currentBarCursorDiv = document.createElement("div");
            currentBarCursorDiv.id = "timeline-current-bar-cursor";
            sceneStructureDiv.appendChild(currentBarCursorDiv);

            let cursorDiv = document.createElement("div");
            cursorDiv.id = "timeline-cursor";
            sceneStructureDiv.appendChild(cursorDiv);
            let cursorLabel = document.createElement("div");
            cursorLabel.id = "timeline-cursor-label";
            cursorDiv.appendChild(cursorLabel);

            sceneStructureDiv.addEventListener("mouseenter", () => {
                let timelineCursor = document.getElementById("timeline-cursor");
                if (timelineCursor !== null) {
                    timelineCursor.style.display = "block";
                }
            });

            sceneStructureDiv.addEventListener("mouseleave", () => {
                let timelineCursor = document.getElementById("timeline-cursor");
                if (timelineCursor !== null) {
                    timelineCursor.style.display = "none";
                }
            });


            sceneStructureDiv.addEventListener("mousemove", (event) => {
                let timelineCursor = document.getElementById("timeline-cursor");
                if (timelineCursor !== null) {
                    const rect = sceneStructureDiv.getBoundingClientRect();
                    timelineCursor.style.left = event.clientX - rect.x + "px";
                    const proportion = (event.clientX - rect.x) / (rect.width);
                    let barNumber = this.#getBarAtProportionOfCurrentScene(proportion);
                    cursorLabel.innerText = "bar " + barNumber;
                    this.timeManager.preloadTime({act: this.timeManager.getCurrentAct(), bar: barNumber, beat: 1, barLength: 1})
                }


            });

            sceneStructureDiv.addEventListener("click", (event) => {
                const rect = sceneStructureDiv.getBoundingClientRect();
                const clickProportion = (event.clientX - rect.x) / (rect.width);

                this.timeManager.goToTime(
                    this.timeManager.getCurrentAct(),
                    this.#getBarAtProportionOfCurrentScene(clickProportion),
                    1);
            });
        }
    }

    async timeUpdated(_ : ScoreTime) {

        const act = this.timeManager.getCurrentAct();
        const scene = this.timeManager.getCurrentScene();

        const actsElement = document.getElementById("acts-timeline");
        if (actsElement !== null) {
            for (const child of actsElement.children) {
                if (child.id === "timeline-act-" + act) {
                    child.classList.add("current-act");
                } else {
                    child.classList.remove("current-act");
                }
            }
        }

        const scenesElement = document.getElementById("scenes-timeline");
        if (scenesElement !== null) {
            for (const child of scenesElement.children) {
                if (child.id === "timeline-act-" + act + "-scene-" + scene) {
                    child.classList.add("current-scene");
                } else {
                    child.classList.remove("current-scene");
                }
            }
        }

        const currentBarCursor = document.getElementById("timeline-current-bar-cursor");
        let sceneStructure = document.getElementById("scene-structure-button");
        if (sceneStructure !== null && currentBarCursor !== null) {
            const rect = sceneStructure.getBoundingClientRect();
            const p = rect.width * this.timeManager.getProportionOfCurrentScene();
            currentBarCursor.style.left = p + "px";
        }
    }

    #getBarAtProportionOfCurrentScene(proportion : number) {
        const sceneRange = scene_bar_ranges[this.timeManager.getCurrentAct()-1][this.timeManager.getCurrentScene()-1];
        return Math.floor(sceneRange[0] + proportion * (sceneRange[1] - sceneRange[0]));
    }

    timeManager;
}