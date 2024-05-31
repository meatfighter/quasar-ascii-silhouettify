import { loadRgbas } from 'src/utils/images';
import { Rgbas } from 'src/types/rgbas';

const DOWNLOAD_RETRIES = 3;
const DOWNLOAD_RETRY_DELAY_MILLIS = 500;

export class ImageItem {
    constructor(public id: string,
                public blobUrl: string,
                public rgbas: Rgbas,
                public displayName: string) {
    }
}

let idSequence = 0;

async function makeImageItem(displayName: string, blobUrl: string): Promise<ImageItem> {
    const id = idSequence.toString();
    ++idSequence;

    let rgbas;
    try {
        rgbas = await loadRgbas(blobUrl, displayName);
    } catch (e) {
        URL.revokeObjectURL(blobUrl);
        throw e;
    }

    return new ImageItem(id, blobUrl, rgbas, displayName);
}

export async function makeImageItemFromFile(file: File): Promise<ImageItem> {
    return makeImageItem(file.name, URL.createObjectURL(file));
}

export async function makeImageItemFromUrl(url: string) {
    for (let i = DOWNLOAD_RETRIES - 1; i >= 0; --i) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return makeImageItem(url.split('/').pop() || url, URL.createObjectURL(await response.blob()));
            }
        } catch {
        }
        if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, DOWNLOAD_RETRY_DELAY_MILLIS));
        }
    }

    throw new Error(`Error downloading ${url}`);
}