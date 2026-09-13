import {text, LanguageCode} from "./data/text";
import {globals} from "./globals";
import {SectionManager, SectionRect, IS_MOBILE_LAYOUT, GAP} from "./SectionManager";
import {LAST_UPDATED} from "./data/lastUpdated";

// The timeline is pinned chrome flush against the title bar's bottom edge
// (see main.ts's timelineRect), a one-time value computed from the title
// bar's height when it was built. Opening the mobile menu (see
// title-menu-toggle below) grows the title bar's own height:auto box well
// past that, so both the timeline and — on mobile, where the panel stack is
// pushed down by #layout-sections' top padding, itself derived from that
// same one-time height — the padding need to be re-derived each time the
// menu opens or closes, the same way TimelineManager does for its own
// collapse/expand toggle.
function repositionBelowHeader(titleSection: HTMLElement): void {
    const timelineSection = document.getElementById("timelines-section");
    if (!timelineSection) {
        return;
    }
    const headerBottom = titleSection.getBoundingClientRect().bottom;
    timelineSection.style.top = `${headerBottom}px`;

    if (IS_MOBILE_LAYOUT) {
        const layoutSections = document.getElementById("layout-sections");
        if (layoutSections) {
            layoutSections.style.paddingTop =
                `${timelineSection.getBoundingClientRect().bottom + GAP}px`;
        }
    }
}

function showCredits(showOrHide: boolean) {
    const credits = document.getElementById('credits-anchor');
    if (credits) {
        credits.style.display = showOrHide ? 'block' : 'none';
    }

    const darken = document.getElementById('darken');
    if (darken) {
        darken.style.display = showOrHide ? 'block' : 'none';
    }
}

function getTheme(): 'dark' | 'light' {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function setTheme(theme: 'dark' | 'light') {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
}

function themeToggleLabel(): string {
    return getTheme() === 'dark' ? text.THEME_LIGHT[globals.language] : text.THEME_DARK[globals.language];
}

const LANGUAGES: { code: LanguageCode; label: string; page: string }[] = [
    { code: 'fr', label: 'Français', page: 'fr.html' },
    { code: 'en', label: 'English',  page: 'en.html' },
    { code: 'de', label: 'Deutsch',  page: 'de.html' },
    { code: 'pt', label: 'Português', page: 'pt.html' },
];

export class TitleSectionManager extends SectionManager {
    constructor(rect: SectionRect) {
        super("title-section", rect, false, true);
        const titleSection = this.element;
        if (titleSection) {
            const options = LANGUAGES.map(l =>
                `<option value="${l.page}"${l.code === globals.language ? ' selected' : ''}>${l.label}</option>`
            ).join('');

            titleSection.innerHTML = `<h1>` + text.TITLE[globals.language] + `</h1>
      <div class="title-header-controls">
      <div class="title-links-and-buttons"><h3 id="info-link">` + text.INFO[globals.language] + `</h3><h3 id="theme-toggle">${themeToggleLabel()}</h3><select id="language-select" class="language-select">${options}</select></div>
      <button id="title-menu-toggle" class="title-menu-toggle" aria-label="Show menu" aria-expanded="false">&#9654;</button>
      </div>`;

            // Both go on <body>, not in the title bar that opens them: the
            // title bar is a .pinned-section with a z-index, hence a stacking
            // context, and anything nested inside can only ever paint at that
            // one layer — leaving the modal and its dimming behind the other
            // pinned chrome (the timeline, the panel-visibility bar) and
            // unable to blur any of it, whatever z-index it's given. On
            // <body> their z-indexes are compared against everything else's.
            const darken = document.createElement("div");
            darken.id = 'darken';
            document.body.appendChild(darken);

            const creditsAnchor = document.createElement("div");
            creditsAnchor.setAttribute("id", "credits-anchor");
            creditsAnchor.innerHTML = `<div id="credits-box"><div id="credits-box-contents">
<div id="credits-box-text"><p>` + text.BYLINE[globals.language] + `</p><p id="credits-last-updated">© ${LAST_UPDATED}</p></div>
<div id="credits-box-buttons"><button id="close-credits-box">` + text.CLOSE[globals.language] + `</button></div>
</div></div>`;
            document.body.append(creditsAnchor);
            showCredits(false);
            document.getElementById("close-credits-box")?.addEventListener("click", () => showCredits(false), false);
            document.getElementById("info-link")?.addEventListener("click", () => showCredits(true), false);
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && document.getElementById("credits-anchor")?.style.display !== "none") {
                    showCredits(false);
                }
            });

            document.getElementById("theme-toggle")?.addEventListener("click", () => {
                const next = getTheme() === 'dark' ? 'light' : 'dark';
                setTheme(next);
                const toggle = document.getElementById("theme-toggle");
                if (toggle) toggle.textContent = themeToggleLabel();
            });

            document.getElementById("language-select")?.addEventListener("change", (e) => {
                window.location.href = (e.target as HTMLSelectElement).value;
            });

            document.getElementById("title-menu-toggle")?.addEventListener("click", (e) => {
                e.stopPropagation();
                const toggle = document.getElementById("title-menu-toggle");
                const menu = document.querySelector(".title-links-and-buttons");
                const nowOpen = !menu?.classList.contains("open");
                menu?.classList.toggle("open", nowOpen);
                toggle?.classList.toggle("open", nowOpen);
                toggle?.setAttribute("aria-expanded", String(nowOpen));
                repositionBelowHeader(titleSection);
            });

            document.addEventListener("click", (e) => {
                const controls = document.querySelector(".title-header-controls");
                if (controls && !controls.contains(e.target as Node)) {
                    const toggle = document.getElementById("title-menu-toggle");
                    const menu = document.querySelector(".title-links-and-buttons");
                    const wasOpen = menu?.classList.contains("open");
                    menu?.classList.remove("open");
                    toggle?.classList.remove("open");
                    toggle?.setAttribute("aria-expanded", "false");
                    if (wasOpen) {
                        repositionBelowHeader(titleSection);
                    }
                }
            });
        }
        this.initResizeHandles();
    }
}