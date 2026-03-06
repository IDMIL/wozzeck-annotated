import {ScoreTime, TimeManagerListener} from "./TimeManager";
import {bar_to_page} from "./data/barToPage";

export class ScoreManager extends TimeManagerListener {
    private currentPage: undefined | number;

    constructor() {
        super();
        this.currentPage = undefined;
    }

    timeUpdated(scoreTime : ScoreTime) {
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
            console.log("set overlay dimensions", overlayX, overlayY, overlayWidth, overlayHeight);
        }
    }
}