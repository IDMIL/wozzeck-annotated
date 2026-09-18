## Instructions for adding garant_orchestral.pdf to the site

As you can see in site/data, there are several different scores divided into pages. Garant_orchestral.md contains scans
of the same orchestral score as in site/data/pages, but with it is a different scan, and there are handwritten annotations
on top of it. Additionally, it is only part of the score, the scans cover a 2-page spread, rather than a single page, and
the first page of the pdf is an unrelated cover page.

After the cover page, the next image in the pdf is data/pages/Act3/sheet36.png and data/pages/Act3/sheet37.png, then the next
image is data/pages/Act3/sheet38.png and data/pages/Act3/sheet39.png, and so on counting up.

Your task:

- separate the pdf into images in the site/data directory.
- generate a bar to page mappings file. For bars that are not included in this score, use the cover page image file, with a dummy 0,0,0,0 bar bounding box.
- create a new GarantOrchestralScoreManager panel, following the style of the existing scoremanager panels.