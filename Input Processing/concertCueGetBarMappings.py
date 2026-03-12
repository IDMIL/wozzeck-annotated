from getBarMappingsDummyMeasurebounds import getMappingsNoMeasureBounds
import json

def getConcertCueMappings():
    mappings = getMappingsNoMeasureBounds()
    print(mappings)

    concertcue_coords = []
    for act in (1,2,3):
        with open(f'concertcue/act{act}.json', 'r') as f:
            data = json.load(f)['data']
            if 'piece' in data:
                score = data['piece']['score']
            else:
                score = data['score']

            concertcue_coords.append(score['barcoords'])
    print(concertcue_coords)

    for act_i in range(3):
        act_map = mappings[act_i]
        barmaps = concertcue_coords[act_i]
        barmap_i = 0
        for bar_i in act_map:
            if (barmap_i >= len(barmaps)):
                barmap_i = len(barmaps) - 1
            else:
                while barmaps[barmap_i]['pageIdx'] < act_map[bar_i]['page'] - 1:
                    barmap_i += 1
                while barmaps[barmap_i]['pageIdx'] > act_map[bar_i]['page'] - 1 or barmap_i >= len(barmaps):
                    barmap_i -= 1
            act_map[bar_i]['x'] = barmaps[barmap_i]['x1']
            act_map[bar_i]['y'] = barmaps[barmap_i]['y1']
            act_map[bar_i]['w'] = barmaps[barmap_i]['x2'] - barmaps[barmap_i]['x1']
            act_map[bar_i]['h'] = barmaps[barmap_i]['y2'] - barmaps[barmap_i]['y1']

            barmap_i += 1
    return mappings

if __name__ == '__main__':
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


    export const bar_to_page : Array<ActInfo> = """ + str(getConcertCueMappings()) + ";")

