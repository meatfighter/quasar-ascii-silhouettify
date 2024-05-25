import { clearClosestColorCache, findClosestColorIndex, findClosestColorIndexAmong } from 'src/app/colors';
import { Palette } from 'src/types/palette';

export class ImageContent {
    constructor(public indices: Uint8Array, public width: number, public height: number) {
    }
}

export function getIndex(imageContent: ImageContent, x: number, y: number) {
    const X = Math.round(x);
    const Y = Math.round(y);
    if (X < 0 || Y < 0 || X >= imageContent.width || Y >= imageContent.height) {
        return 0;
    }
    return imageContent.indices[imageContent.width * Y + X];
}

export function makeImageContent(imageData: ImageData, palette: Palette, colors: number, darkness: number) {

    const data = imageData.data;
    const indices = new Uint8Array(imageData.width * imageData.height);
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
        return new ImageContent(indices, imageData.width, imageData.height);
    }

    indexSet.length = colors;

    for (let i = 0, j = 0; i < indices.length; ++i) {
        indices[i] = findClosestColorIndexAmong(indexSet, darkness, data[j++], data[j++], data[j++], data[j++]);
    }
    clearClosestColorCache();

    return new ImageContent(indices, imageData.width, imageData.height);
}