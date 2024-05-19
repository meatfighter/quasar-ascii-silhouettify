import { clearClosestColorCache, findClosestColorIndex, findClosestColorIndexAmong, Palette } from 'src/app/colors';
import { ImageItem } from 'src/types/imageItem';

export class ImageContent {
    constructor(public indices: Uint8Array, public width: number, public height: number,
                public neofetchIndices: number[], public neofetchStyles: string[]) {
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

export async function loadImageData(src: string): Promise<ImageData> {
    return new Promise<ImageData>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx === null) {
                reject(new Error('Failed to get 2D image context.'));
                return;
            }
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            resolve(ctx.getImageData(0, 0, img.width, img.height));
        };
        img.onerror = () => {
            reject(new Error('Error loading image.'));
        };
    });
}

export async function extractImageContent(imageItem: ImageItem, pal: Palette, colors: number, darkness: number):
        Promise<ImageContent> {

    return new Promise<ImageContent>((resolve, reject) => {
        loadImageData(imageItem.blobUrl)
            .then(imageData => resolve(createImageContent(imageData, pal, colors, darkness)))
            .catch(() => reject(new Error(`Error loading image ${imageItem.displayName}`)));
    });
}

function createImageContent(imageData: ImageData, pal: Palette, colors: number, darkness: number) {
    const data = imageData.data;
    const indices = new Uint8Array(imageData.width * imageData.height);
    const frequencies = new Array<number>(256).fill(0);

    clearClosestColorCache();
    for (let i = 0, j = 0; i < indices.length; ++i) {
        ++frequencies[indices[i] = findClosestColorIndex(pal, darkness, data[j++], data[j++], data[j++], data[j++])];
    }
    clearClosestColorCache();

    const neofetchIndices: number[] = [];
    const neofetchStyles = new Array<string>(256);
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
        neofetchIndices.push(maxIndex);
        if (neofetchIndices.length <= 6) {
            neofetchStyles[maxIndex] = `\${c${neofetchIndices.length}}`;
        }
    }

    if (neofetchIndices.length <= colors) {
        return new ImageContent(indices, imageData.width, imageData.height, neofetchIndices, neofetchStyles);
    }

    neofetchIndices.length = colors;

    for (let i = 0, j = 0; i < indices.length; ++i) {
        indices[i] = findClosestColorIndexAmong(neofetchIndices, darkness, data[j++], data[j++], data[j++], data[j++]);
    }
    clearClosestColorCache();

    return new ImageContent(indices, imageData.width, imageData.height, neofetchIndices, neofetchStyles);
}