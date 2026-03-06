import {scene_bar_ranges} from "./data/sceneBarRanges";


export type Act = number;
export type Bar = number;
export type Beat = number;
export type Scene = number;
export type BarLength = number;

export interface ScoreTime {
    act: Act,
    bar: Bar,
    beat: Beat,
    barLength: BarLength,
}

export class TimeManagerListener {
    timeUpdated(scoreTime : ScoreTime) {
        console.log(scoreTime);
    }
}

export class TimeManager {
    constructor() {

    }

    goToTime(act : Act, bar : Bar, beat : Beat) {
        console.log(`goToTime(${act}, ${bar}, ${beat})`);
        this.scoreTime.act = act;
        this.scoreTime.bar = bar;
        this.scoreTime.beat = beat;

        this.notifyListeners();
    }

    advanceBar(numBars : number) {
        this.scoreTime.bar += numBars;
        this.notifyListeners();
    }

    notifyListeners() {
        console.log("notifying listeners of scoreTime", this.scoreTime);
        for (const listener of this.listeners) {
            listener.timeUpdated(this.scoreTime);
        }
    }

    getCurrentAct() : Act {
        return this.scoreTime.act;
    }

    getCurrentBarWithinAct() : Bar {
        return this.scoreTime.bar;
    }

    getCurrentScene() : Scene  {
        return this.getScene(this.getCurrentAct(), this.getCurrentBarWithinAct());
        // const sceneRanges = scene_bar_ranges[this.getCurrentAct() - 1];
        // for (let i = 0; i < sceneRanges.length; i++) {
        //   if (sceneRanges[i][0] <= this.getCurrentBarWithinAct() && this.getCurrentBarWithinAct() <= sceneRanges[i][1]) {
        //     return i + 1;
        //   }
        // }
    }

    getScene(act : Act, bar : Bar) : Scene {
        const sceneRanges = scene_bar_ranges[act - 1];
        for (let i = 0; i < sceneRanges.length; i++) {
            if (sceneRanges[i][0] <= bar && bar <= sceneRanges[i][1]) {
                return i + 1;
            }
        }
        return 1;
    }

    getProportionOfCurrentScene() : number {
        const sceneRanges = scene_bar_ranges[this.getCurrentAct() - 1];
        for (let i = 0; i < sceneRanges.length; ++i) {
            if (sceneRanges[i][0] <= this.getCurrentBarWithinAct() && this.getCurrentBarWithinAct() <= sceneRanges[i][1]) {
                return (this.getCurrentBarWithinAct() - sceneRanges[i][0]) / (sceneRanges[i][1] + 1 - sceneRanges[i][0]);
            }
        }
        return 0;
    }

    scoreTime : ScoreTime = {
        act: 1,
        bar: 1,
        beat: 1,
        barLength: 4
    }

    listeners : TimeManagerListener[] = [];
}