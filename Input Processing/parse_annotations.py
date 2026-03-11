import csv
from os import listdir
from difflib import SequenceMatcher

def isTypoOf(a, b):
    similarity_ratio = SequenceMatcher(None, a, b).ratio()
    return similarity_ratio >= 0.6

def parseAnnotationCodes(codecell):
    annotation_codes = ('dy', 'du', 'for', 'int', 'mo', 'tim', 'graph')
    codes = [i.strip('-') for i in codecell.split()]
    good_codes = []
    for c in codes:
        if c in annotation_codes:
            good_codes.append(c)
        elif '-' in c:
                for subcode in c.split('-'):
                    if subcode in annotation_codes:
                        good_codes.append(subcode)
        else:
            for annotation_code in annotation_codes:
                if isTypoOf(annotation_code, c.lower()):
                    good_codes.append(annotation_code)
    return good_codes

def replaceSymbols(line):
    flat = "♭"
    sharp = "♯"
    note_names = ('Do', 'Ré', 'Mi', 'Fa', 'Sol', 'La', 'Si')

    parts = line.split(' ')
    for i, p in enumerate(parts):
        if p.startswith("#") and i > 1 and parts[i-1] in note_names:
            parts[i] = sharp + p[1:]
        elif p.startswith("b") and i > 1 and parts[i-1] in note_names and (len(p) == 1 or not p[1].isalpha()):
            parts[i] = flat + p[1:]
    return ' '.join(parts)

def parse_annotations(filename, act_number):
    annotations = []
    with open(filename, encoding='utf8') as csvfile:
        csvreader = csv.reader(csvfile, delimiter=',')
        is_header = True
        current_measures = None
        for row in csvreader:
            if is_header:
                is_header = False
            else:
                if row[2] == "":
                    continue
                a = {}
                a['code'] = parseAnnotationCodes(row[0])

                if row[1] != '':
                    measure_range = row[1].split('-')
                    try:
                        measure_range = [int(i) for i in measure_range]
                    except ValueError:
                        print("cannot parse measure range", measure_range, "on row", row, "in", filename)
                        measure_range = current_measures
                    if len(measure_range) == 1:
                        current_measures = [measure_range[0], measure_range[0]]
                    else:
                        if (len(str(measure_range[1])) < len(str(measure_range[0]))):
                            # Number format like 123-35
                            prefix = str(measure_range[0])[-len(str(measure_range[1]))+1:]
                            measure_range[1] = int(prefix + str(measure_range[1]))
                        current_measures = [measure_range[0], measure_range[1]]

                a['annotation'] = replaceSymbols(row[2])
                a['act'] = act_number
                a['measure_range'] = current_measures
                annotations.append(a)
    return annotations

def test_replaceFlatSymbols():
    print(replaceSymbols("Intervalle de Ré dièse-Si bécarre"))
    print(replaceSymbols("Accord important : Si b - Do # - Mi - Sol # - Mi b - Fa (3ce min. entre Si b et Do #, 5te entre Sol # et Mi b, 9e min entre Mi et Fa)"))
    print(replaceSymbols("al chromatique et sensation de pentatonique (sauf Mi) sur Ré b (Do #, note de la soumission) et cycle de 5te (sauf Mi) : Ré b - La b - Mi b - Si b - Fa"))

# test_replaceFlatSymbols()
# # print(parse_annotations("annotations/W-ActIIISce4_withCode.csv", 3))
all_annotations = []
for f in listdir("annotations"):
    act_number = 0
    if 'act1' in f.lower():
        act_number = 1
    elif 'actiii' in f.lower():
        act_number = 3
    else:
        print("Cannot determine act of", f)
        continue
    all_annotations += parse_annotations('annotations/' + f, act_number)
with open("../site/src/data/annotations.ts", 'w', encoding='utf8') as annotations_file:
    annotations_file.write("""export type AnnotationCode = 'dy' | 'du' | 'for' | 'int' | 'mo' | 'tim' | 'graph';

export interface Annotation {
    code : Array<AnnotationCode>;
    annotation : string;
    act : number;
    measure_range : [number, number];
}

export const annotations : Array<Annotation> =
""")
    annotations_file.write(str(all_annotations))