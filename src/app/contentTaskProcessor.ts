import { Palette } from 'src/types/palette';
import { clearClosestColorCache, findClosestColorIndex, findClosestColorIndexAmong } from 'src/app/colors';
import { ImageContent } from 'src/types/imageContent';
import { Rgbas } from 'src/types/rgbas';

function makeImageContent(rgbas: Rgbas, palette: Palette, colors: number, darkness: number) {

    const data = rgbas.data;
    const indices = new Uint8Array(rgbas.width * rgbas.height);
    const frequencies = new Array<number>(256).fill(0);

    clearClosestColorCache();
    for (let i = 0, j = 0; i < indices.length; ++i) {
        ++frequencies[indices[i] = findClosestColorIndex(palette, darkness, data[j++], data[j++], data[j++],
                data[j++])];
    }
    clearClosestColorCache();

    const indexSet: number[] = [];
    while (true) {
        let maxIndex = -1;
        let maxFrequency = 0;
        for (let i = frequencies.length - 1; i > 0; --i) {
            if (frequencies[i] > maxFrequency) {
                maxIndex = i;
                maxFrequency = frequencies[i];
            }
        }
        if (maxIndex < 0) {
            break;
        }
        frequencies[maxIndex] = 0;
        indexSet.push(maxIndex);
    }

    if (indexSet.length <= colors) {
        return new ImageContent(indices, rgbas.width, rgbas.height);
    }

    indexSet.length = colors;

    for (let i = 0, j = 0; i < indices.length; ++i) {
        indices[i] = findClosestColorIndexAmong(indexSet, darkness, data[j++], data[j++], data[j++], data[j++]);
    }

    return new ImageContent(indices, rgbas.width, rgbas.height);
}