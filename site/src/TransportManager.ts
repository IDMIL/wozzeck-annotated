import {ScoreTime, TimeManager, TimeManagerListener} from "./TimeManager";
import {scene_bar_ranges} from "./data/sceneBarRanges";

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


export class TransportManager extends TimeManagerListener {
    constructor(tm : TimeManager) {
        super();
        this.timeManager = tm;

        const prevBarButton = document.getElementById("prev-bar-button");
        if (prevBarButton !== null) {
            prevBarButton.onclick = () => {
                    this.timeManager.advanceBar(-1);
            }
        }

        const nextBarButton = document.getElementById("next-bar-button");

        if (nextBarButton !== null) {
            nextBarButton.onclick = () => {
                this.timeManager.advanceBar(1);
            }
        }
    }

    async timeUpdated(scoreTime : ScoreTime) {
        const transportActNumber = document.getElementById("transportActNumber");
        if (transportActNumber !== null) {
            transportActNumber.innerText = scoreTime.act.toString();
        }
        const transportSceneNumber = document.getElementById("transport-scene-number");
        if (transportSceneNumber !== null) {
            transportSceneNumber.innerText = getSceneNumber(scoreTime).toString();
        }
        const transportBarNumber = document.getElementById("transport-bar-number");
        if (transportBarNumber !== null) {
            transportBarNumber.innerText = scoreTime.bar.toString();
        }
        const transportBeatNumber = document.getElementById("transport-beat-number");
        if (transportBeatNumber !== null) {
            transportBeatNumber.innerText = scoreTime.beat.toString();
        }
    }

    timeManager;
}