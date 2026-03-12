import os.path

mappings = [{}, {}, {}]
num_bars = [717, 818, 392]
for act in range(3):
    act_number = act + 1
    with open(f'act{act_number}pagebars.txt', 'r') as f:
        lines = f.readlines()
    lines = [int(l.split("#")[0].strip().split(".")[0]) for l in lines]
    print(lines)
    for b in range(num_bars[act]):
        page = -1
        for pagei, start_bar in enumerate(lines):
            if start_bar <= b + 1 and (pagei + 1 == len(lines) or lines[pagei + 1] > b + 1):
                page = pagei + 1
                break
        if page < 0:
            raise ValueError

        if os.path.exists(f'../site/data/pages/Act{act_number}/annotated/sheet{page}.png'):
            imagePath = f'data/pages/Act{act_number}/annotated/sheet{page}.png'
        else:
            imagePath = f'data/pages/Act{act_number}/sheet{page}.png'
        mappings[act][b + 1] = {
            'page' : page,
            'system_number': 1,
            'x': 0,
            'y': 0,
            'w': 0,
            'h': 0,
            'image': imagePath
        }

with open(f'../site/src/data/barToPage.ts', 'w') as f:
    f.write("""export interface BarInfo {
    page: number;
    system_number: number;
    x: number;
    w: number;
    y: number;
    h: number;
    image: string;
}

export interface ActInfo {
    [index : string] : BarInfo;
}


export const bar_to_page : Array<ActInfo> = """ + str(mappings) + ";")