import pymupdf

def splitPdf(filename, destination, startingPage):
    doc = pymupdf.open(filename)
    pagenumber = startingPage
    for page in doc:
        print(pagenumber)
        pixmap = page.get_pixmap(dpi=300)
        img = pixmap.tobytes()
        with open(f'{destination}/sheet{pagenumber}.png', 'wb') as f:
            f.write(img)
        pagenumber += 1


splitPdf(r'C:\Users\Arden\Downloads\OneDrive_2026-03-11\W-Data for integration\Act III\W-AIIISce5.pdf', r'D:\Wozzeck\OperaVisualization\site\data\pages\Act3\annotated', 85)