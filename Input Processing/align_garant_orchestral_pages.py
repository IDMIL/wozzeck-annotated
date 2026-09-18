"""
Aligns the annotated Serge Garant orchestral-score scan (site/data/Garant_orchestral_pages/)
against the reference orchestral score pages (site/data/pages/Act3/) and produces
site/src/data/GarantOrchestralBarToPage.ts.

Each Garant image is a photographed two-page spread of consecutive sheets of the
reference score (left sheet, right sheet). Which sheets each spread shows was determined
by matching every spread half against every reference sheet (see SPREAD_LEFT_SHEET) --
the scan does not simply count up: spreads 2 and 3 are two photos of the same pair of
sheets, and sheets 78-81 are missing. For each sheet we estimate a homography from SIFT correspondences (restricted
to the half of the spread the sheet is on), then use it to map each bar's bounding box
(from site/src/data/barToPage.ts) into fractions of the spread image.

Bars whose sheet is not part of the scan point at the cover image with a 0,0,0,0 box.

Debug overlays (spread images with the mapped bar boxes drawn on) are written to
DEBUG_DIR if given on the command line: `python align_garant_orchestral_pages.py <debug_dir>`.
"""

import os
import re
import sys

import cv2
import numpy as np

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)

REF_PAGES_DIR = os.path.join(REPO_ROOT, "site", "data", "pages", "Act3")
GARANT_DIR = os.path.join(REPO_ROOT, "site", "data", "Garant_orchestral_pages")
BAR_TO_PAGE_TS = os.path.join(REPO_ROOT, "site", "src", "data", "barToPage.ts")
OUT_TS = os.path.join(REPO_ROOT, "site", "src", "data", "GarantOrchestralBarToPage.ts")

NUM_SPREADS = 31

# Left-hand reference sheet (Act 3 sheet number) shown in each spread; the right-hand
# page is always the next sheet. Verified by feature matching against all 106 sheets.
SPREAD_LEFT_SHEET = {1: 36, 2: 38, 3: 38}
SPREAD_LEFT_SHEET.update({n: 40 + 2 * (n - 4) for n in range(4, 23)})    # 40 .. 76
SPREAD_LEFT_SHEET[23] = 82                                                # 78-81 not scanned
SPREAD_LEFT_SHEET.update({n: 84 + 2 * (n - 24) for n in range(24, 32)})  # 84 .. 98

# Spread 3 is a second, tighter photo of spread 2's pages (its right edge is cropped),
# so its sheets are mapped from spread 2 and spread 3 is left unused.
UNUSED_SPREADS = {3}
NUM_BARS = [717, 818, 392]
COVER_IMAGE = "data/Garant_orchestral_pages/cover.jpg"

DETECT_MAX_DIM = 1600
RATIO_TEST = 0.75
MIN_INLIERS = 25
# Fraction of the spread width (from the left/right edge) searched for each sheet.
SIDE_SPAN = 0.58


def load_gray(path, max_dim=DETECT_MAX_DIM):
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    h, w = img.shape
    scale = max_dim / max(h, w)
    if scale < 1:
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    return img


def read_act3_bars():
    """Returns {bar: (sheet, x, y, w, h)} for Act 3 from barToPage.ts."""
    with open(BAR_TO_PAGE_TS, encoding="utf-8") as f:
        text = f.read()
    pattern = re.compile(
        r"(\d+): \{'page': \d+, 'x': ([-\d.e]+), 'y': ([-\d.e]+), 'w': ([-\d.e]+), 'h': ([-\d.e]+), "
        r"'image': 'data/pages/Act3/(?:annotated/)?sheet(\d+)\.png'\}"
    )
    bars = {}
    for m in pattern.finditer(text):
        bars[int(m.group(1))] = (int(m.group(6)),) + tuple(float(m.group(i)) for i in range(2, 6))
    assert len(bars) == NUM_BARS[2], f"expected {NUM_BARS[2]} Act 3 bars, found {len(bars)}"
    return bars


def estimate_homography(sift, bf, ref_img, spread_img, side):
    """Homography mapping ref-page fraction coords -> spread fraction coords, or None."""
    sh, sw = spread_img.shape
    mask = np.zeros_like(spread_img)
    span = int(sw * SIDE_SPAN)
    if side == "left":
        mask[:, :span] = 255
    else:
        mask[:, sw - span:] = 255

    kp_r, des_r = sift.detectAndCompute(ref_img, None)
    kp_s, des_s = sift.detectAndCompute(spread_img, mask)
    if des_r is None or des_s is None or len(kp_r) < 4 or len(kp_s) < 4:
        return None, 0

    good = [m for m, n in bf.knnMatch(des_r, des_s, k=2) if m.distance < RATIO_TEST * n.distance]
    if len(good) < 8:
        return None, len(good)

    rh, rw = ref_img.shape
    src = np.float32([[kp_r[m.queryIdx].pt[0] / rw, kp_r[m.queryIdx].pt[1] / rh] for m in good])
    dst = np.float32([[kp_s[m.trainIdx].pt[0] / sw, kp_s[m.trainIdx].pt[1] / sh] for m in good])
    # Work in pixel-ish units of the spread so the reprojection threshold is meaningful.
    scale = np.float32([sw, sh])
    H, inl = cv2.findHomography(src * scale, dst * scale, cv2.RANSAC, 6.0)
    if H is None:
        return None, 0
    # Convert back so it maps fractions -> fractions.
    S = np.diag([sw, sh, 1.0])
    H = np.linalg.inv(S) @ H @ S
    return H, int(inl.sum())


def map_box(H, x, y, w, h):
    corners = np.float32([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]).reshape(-1, 1, 2)
    out = cv2.perspectiveTransform(corners, H).reshape(-1, 2)
    x0, y0 = out.min(axis=0)
    x1, y1 = out.max(axis=0)
    return float(x0), float(y0), float(x1 - x0), float(y1 - y0)


def main():
    debug_dir = sys.argv[1] if len(sys.argv) > 1 else None
    if debug_dir:
        os.makedirs(debug_dir, exist_ok=True)

    bars = read_act3_bars()
    sift = cv2.SIFT_create()
    bf = cv2.BFMatcher(cv2.NORM_L2)

    # sheet -> (spread number, box mapper)
    sheet_homography = {}
    for spread in range(1, NUM_SPREADS + 1):
        if spread in UNUSED_SPREADS:
            continue
        spread_path = os.path.join(GARANT_DIR, "Act3", f"sheet{spread}.jpg")
        spread_img = load_gray(spread_path)
        left = SPREAD_LEFT_SHEET[spread]
        for side, sheet in (("left", left), ("right", left + 1)):
            ref_img = load_gray(os.path.join(REF_PAGES_DIR, f"sheet{sheet}.png"))
            H, inliers = estimate_homography(sift, bf, ref_img, spread_img, side)
            status = "OK" if H is not None and inliers >= MIN_INLIERS else "LOW"
            print(f"spread {spread:2d} {side:5s} sheet{sheet:3d}: {inliers:4d} inliers {status}")
            if H is not None:
                sheet_homography[sheet] = (spread, H, inliers)

    lines = []
    act3 = {}
    for bar in range(1, NUM_BARS[2] + 1):
        sheet, x, y, w, h = bars[bar]
        if sheet in sheet_homography:
            spread, H, _ = sheet_homography[sheet]
            bx, by, bw, bh = map_box(H, x, y, w, h)
            act3[bar] = (spread, bx, by, bw, bh, f"data/Garant_orchestral_pages/Act3/sheet{spread}.jpg")
        else:
            act3[bar] = (0, 0.0, 0.0, 0.0, 0.0, COVER_IMAGE)

    def fmt_act(entries):
        parts = []
        for bar, (page, x, y, w, h, image) in entries.items():
            parts.append(f"{bar}: {{'page': {page}, 'x': {x}, 'y': {y}, 'w': {w}, 'h': {h}, 'image': '{image}'}}")
        return "{" + ", ".join(parts) + "}"

    # Acts 1 and 2 are not part of this scan: every bar points at the cover.
    def cover_act(n):
        return {b: (0, 0.0, 0.0, 0.0, 0.0, COVER_IMAGE) for b in range(1, n + 1)}

    acts = [cover_act(NUM_BARS[0]), cover_act(NUM_BARS[1]), act3]
    with open(OUT_TS, "w", encoding="utf-8") as f:
        f.write('import {ActInfo} from "./barToPage";\n')
        f.write("export const Garant_orchestral_bar_to_page : Array<ActInfo> = ["
                + ", ".join(fmt_act(a) for a in acts) + "];\n")
    print(f"Wrote {OUT_TS}")

    if debug_dir:
        for spread in range(1, NUM_SPREADS + 1):
            img = cv2.imread(os.path.join(GARANT_DIR, "Act3", f"sheet{spread}.jpg"))
            ih, iw = img.shape[:2]
            for bar, (page, x, y, w, h, _) in act3.items():
                if page != spread:
                    continue
                p0 = (int(x * iw), int(y * ih))
                p1 = (int((x + w) * iw), int((y + h) * ih))
                cv2.rectangle(img, p0, p1, (0, 0, 255), 3)
                cv2.putText(img, str(bar), (p0[0] + 5, p0[1] + 40), cv2.FONT_HERSHEY_SIMPLEX, 1.4, (255, 0, 0), 3)
            scale = 2000 / iw
            img = cv2.resize(img, (2000, int(ih * scale)))
            cv2.imwrite(os.path.join(debug_dir, f"spread{spread}.jpg"), img)


if __name__ == "__main__":
    main()
