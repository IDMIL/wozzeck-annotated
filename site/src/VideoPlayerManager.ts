import {TimeManager, TimeManagerListener} from "./TimeManager";
import {text} from "./data/text";
import {globals} from "./globals";

export class VideoPlayerManager extends TimeManagerListener {
    constructor(tm : TimeManager) {
        super();
        this.timeManager = tm;

        const videoPlayer = document.getElementById("video-player-section");
        if (videoPlayer) {
            const header = document.createElement("h2");
            header.innerText = text[globals.language].VIDEO_PLAYER;
            videoPlayer.appendChild(header);
        }
    }
    timeManager : TimeManager;
}