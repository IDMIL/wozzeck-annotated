"""
Extracts the page images from the annotated Serge Garant orchestral-score scan
(garant_orchestral.pdf) into the site's data directory.

The PDF's first page is an unrelated cover; every following page is a single
embedded JPEG showing a two-page spread of the Act 3 orchestral score
(spread 1 = data/pages/Act3/sheet36 + sheet37, spread 2 = sheet38 + sheet39, ...).

The embedded JPEGs are written out as-is (no re-encoding).

Output: site/data/Garant_orchestral_pages/cover.jpg
        site/data/Garant_orchestral_pages/Act3/sheet<n>.jpg   (n = spread number, 1-indexed)
"""

import os
import pymupdf

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)

PDF_PATH = os.path.join(REPO_ROOT, "garant_orchestral.pdf")
OUT_DIR = os.path.join(REPO_ROOT, "site", "data", "Garant_orchestral_pages")


def main():
    os.makedirs(os.path.join(OUT_DIR, "Act3"), exist_ok=True)
    doc = pymupdf.open(PDF_PATH)
    print(f"{os.path.basename(PDF_PATH)}: {len(doc)} pages")

    for page_index, page in enumerate(doc):
        images = page.get_images()
        assert len(images) == 1, f"page {page_index} has {len(images)} images"
        info = doc.extract_image(images[0][0])
        assert info["ext"] == "jpeg", f"page {page_index}: unexpected format {info['ext']}"

        if page_index == 0:
            rel = "cover.jpg"
        else:
            rel = f"Act3/sheet{page_index}.jpg"
        with open(os.path.join(OUT_DIR, rel), "wb") as f:
            f.write(info["image"])
        print(f"  -> {rel} ({info['width']}x{info['height']})")

    doc.close()
    print("Done.")


if __name__ == "__main__":
    main()
