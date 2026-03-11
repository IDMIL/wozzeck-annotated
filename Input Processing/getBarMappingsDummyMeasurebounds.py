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
        mappings[act][b + 1] = {
            'page' : page,
            'system_number': 1,
            'x': 0,
            'y': 0,
            'w': 0,
            'h': 0,
            'image': f'data/pages/Act{act_number}/sheet{page}.png'
        }

print(mappings)