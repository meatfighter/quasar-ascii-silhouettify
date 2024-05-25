import { Palette } from 'src/app/colors';
import { GlyphInfo } from 'src/app/glyphs';
import { Format } from 'src/app/format';
import { Message, MessageType } from 'src/app/messages';
import { Ascii } from 'src/app/ascii';
import Offset from 'src/app/offset';
import partitionArray from 'src/app/array';
import AsciiTask from 'src/app/asciiTask';
import { ImageContent } from 'src/app/imageContent';

export class ConvertOptions {
    constructor(public imageContents: ImageContent[],
                public format: Format,
                public palette: Palette,
                public colors: number,
                public fontSize: number,
                public lineHeight: number,
                public imageScale: number,
                public darkness: number,
                public threads: number,
                public color: boolean) {
    }
}

export type ConvertCallback = (asciiResults: AsciiResult[]) => void;

class AsciiResult {
    ascii: Ascii | null = null;
    workers = new Map<string, Worker>();
}

const asciiResults: AsciiResult[] = [];

const workers: Worker[] = [];
let workerIndex = 0;

let callback: ConvertCallback;

function adjustWorkersPool(threads: number) {
    if (workers.length > threads) {
        for (let i = threads; i < workers.length; ++i) {
            workers[i].terminate();
        }
        workers.length = threads;
    } else {
        while (workers.length < threads) {
            const worker = new Worker(new URL('./worker', import.meta.url), { type: 'module' });
            worker.onmessage = <T>(event: MessageEvent<Message<T>>) => {
                const message = event.data;
                if (message.type === MessageType.ASCII_RESULT) {
                    handleAsciiResult(message.data as Ascii);
                }
            };
            workers.push(worker);
        }
    }
}

function convertToAscii(imageContent: ImageContent, convertOptions: ConvertOptions, glyphInfo: GlyphInfo) {

    const asciiResult = new AsciiResult();
    const imageIndex = asciiResults.length;
    asciiResults.push(asciiResult);

    const scaledGlyphWidth = glyphInfo.width * convertOptions.fontSize / 12;
    const scaledGlyphHeight = Math.round(convertOptions.lineHeight * convertOptions.fontSize * 96 / 72);
    const scaledImageWidth = convertOptions.imageScale * imageContent.width;
    const scaledImageHeight = convertOptions.imageScale * imageContent.height;
    const rows = Math.ceil(scaledImageHeight / scaledGlyphHeight);
    const cols = Math.ceil(scaledImageWidth / scaledGlyphWidth);
    const paddedWidth = Math.ceil(cols * scaledGlyphWidth);
    const paddedHeight = Math.ceil(rows * scaledGlyphHeight);
    const marginX = (scaledImageWidth - paddedWidth) / 2;
    const marginY = (scaledImageHeight - paddedHeight) / 2;
    const glyphScaleX = scaledGlyphWidth / (convertOptions.imageScale * glyphInfo.width);
    const glyphScaleY = scaledGlyphHeight / (convertOptions.imageScale * glyphInfo.height);
    const rowScale = scaledGlyphHeight / convertOptions.imageScale;
    const colScale = scaledGlyphWidth / convertOptions.imageScale;

    // Repeat the image conversion for various origins within a glyph-sized region and return the best one found.
    const offsets: Offset[] = [];
    for (let y = -glyphInfo.height; y <= 0; ++y) {
        for (let x = -glyphInfo.width; x <= 0; ++x) {
            offsets.push(new Offset(x, y));
        }
    }
    const offs = partitionArray(offsets, workers.length);

    offs.forEach(off => {
        const id = workerIndex.toString();
        const worker = workers[workerIndex];
        workerIndex = (workerIndex + 1) % workers.length;
        asciiResult.workers.set(id, worker);
        worker.postMessage(new Message(MessageType.CONVERT_TO_ASCII, new AsciiTask(imageIndex, id, off,
                imageContent, glyphInfo, glyphScaleX, glyphScaleY, rows, cols, rowScale, colScale, marginX, marginY,
                convertOptions.color)));
    });
}

function handleAsciiResult(ascii: Ascii) {
    if (ascii.imageIndex >= asciiResults.length) {
        return;
    }
    const asciiResult = asciiResults[ascii.imageIndex];
    if (!asciiResult.workers.has(ascii.id)) {
        return;
    }
    asciiResult.workers.delete(ascii.id);

    if (!asciiResult.ascii || asciiResult.ascii.matched < ascii.matched) {
        asciiResult.ascii = ascii;
    }

    for (let i = asciiResults.length - 1; i >= 0; --i) {
        if (asciiResults[i].workers.size > 0) {
            return;
        }
    }

    callback(asciiResults);
}

function cancelAll() {
    asciiResults.forEach(asciiResult => {
        asciiResult.workers.forEach((worker, id) => {
            worker.postMessage(new Message(MessageType.CANCEL_CONVERT_TO_ASCII, id));
        });
    });
    asciiResults.length = 0;
}

export function convert(convertOptions: ConvertOptions, glyphInfo: GlyphInfo, convertCallback: ConvertCallback) {
    cancelAll();
    adjustWorkersPool(convertOptions.threads);
    callback = convertCallback;
    convertOptions.imageContents.forEach(imageContent => convertToAscii(imageContent, convertOptions, glyphInfo));
}