import csv


def parse_annotations(filename, act_number):
    annotations = []
    with open(filename) as csvfile:
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
                a['code'] = row[0]
                if row[1] != '':
                    measure_range = row[1].split('-')
                    try:
                        measure_range = [int(i) for i in measure_range]
                    except ValueError:
                        print("cannot parse measure range", measure_range, "on row", row)
                        measure_range = current_measures
                    if len(measure_range) == 1:
                        current_measures = [measure_range[0], measure_range[0]]
                    else:
                        current_measures = [measure_range[0], measure_range[1]]

                a['annotation'] = row[2]
                a['act'] = act_number
                a['measure_range'] = current_measures
                annotations.append(a)
    return annotations

print(parse_annotations("annotations/W-ActIIISce4_withCode.csv", 3))
