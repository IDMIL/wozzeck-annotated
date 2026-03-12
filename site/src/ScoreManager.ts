import {ScoreTime, TimeManager, TimeManagerListener} from "./TimeManager";
import {bar_to_page} from "./data/barToPage";

export class ScoreManager extends TimeManagerListener {
    private currentPage: undefined | number;

    constructor(tm : TimeManager) {
        super();
        this.currentPage = undefined;
        this.timeManager = tm;
    }

    async preloadTime(time: ScoreTime) {
        this.preloadImage(bar_to_page[time.act - 1][time.bar].image);
    }

    preloadImage(url : string) {
        var img=new Image();
        img.src=url;
    }

    preloadAround(time : ScoreTime, numBars: number) {
        let timeCopy : ScoreTime = {act: time.act, bar: time.bar, beat: time.beat, barLength: time.barLength};
        for (let i = 0; i <= numBars; ++i) {
            this.timeManager.addToTime(timeCopy, i);
            this.preloadImage(bar_to_page[timeCopy.act - 1][timeCopy.bar].image);
        }
        timeCopy = {act: time.act, bar: time.bar, beat: time.beat, barLength: time.barLength};
        for (let i = 1; i <= numBars; ++i) {
            this.timeManager.addToTime(timeCopy, -i);
            this.preloadImage(bar_to_page[timeCopy.act - 1][timeCopy.bar].image);
        }
    }

    async timeUpdated(scoreTime : ScoreTime) {
        let newPage : number = bar_to_page[scoreTime.act-1][scoreTime.bar].page;
        let im = document.getElementById('score-viewer-image') as HTMLImageElement;

        if (newPage !== this.currentPage) {
            this.currentPage = newPage;
            im.src = bar_to_page[scoreTime.act-1][scoreTime.bar].image;
        }
        let w = im.width;
        let h = im.height;

        let overlay = document.getElementById('current-bar-overlay');
        if (overlay !== null) {
            const overlayX = bar_to_page[scoreTime.act-1][scoreTime.bar].x * w;
            const overlayY = bar_to_page[scoreTime.act-1][scoreTime.bar].y * h;
            const overlayWidth = bar_to_page[scoreTime.act-1][scoreTime.bar].w * w;
            const overlayHeight = bar_to_page[scoreTime.act-1][scoreTime.bar].h * h;
            overlay.style.top = overlayY + "px";
            overlay.style.left = overlayX + "px";
            overlay.style.width = overlayWidth + "px";
            overlay.style.height = overlayHeight + "px";
        }

        this.preloadAround(scoreTime, 5);
    }

    timeManager;
}