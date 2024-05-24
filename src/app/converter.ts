import { Palette } from 'src/app/colors';
import { getGlyphInfo } from 'src/app/glyphs';
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

class ProcessingState {
    ascii: Ascii | null = null;
    partitions = 0;

    constructor(public worker: Worker) {
    }
}

const processingIds: string[] = [];
const processingStates = new Map<string, ProcessingState>();

const workers: Worker[] = [];
let workerIndex = 0;
let options: ConvertOptions;

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

async function convertToAscii(imageContent: ImageContent) {

    const glyphInfo = await getGlyphInfo();

    const scaledGlyphWidth = glyphInfo.width * options.fontSize / 12;
    const scaledGlyphHeight = Math.round(options.lineHeight * options.fontSize * 96 / 72);
    const scaledImageWidth = options.imageScale * imageContent.width;
    const scaledImageHeight = options.imageScale * imageContent.height;
    const rows = Math.ceil(scaledImageHeight / scaledGlyphHeight);
    const cols = Math.ceil(scaledImageWidth / scaledGlyphWidth);
    const paddedWidth = Math.ceil(cols * scaledGlyphWidth);
    const paddedHeight = Math.ceil(rows * scaledGlyphHeight);
    const marginX = (scaledImageWidth - paddedWidth) / 2;
    const marginY = (scaledImageHeight - paddedHeight) / 2;
    const glyphScaleX = scaledGlyphWidth / (options.imageScale * glyphInfo.width);
    const glyphScaleY = scaledGlyphHeight / (options.imageScale * glyphInfo.height);
    const rowScale = scaledGlyphHeight / options.imageScale;
    const colScale = scaledGlyphWidth / options.imageScale;

    // Repeat the image conversion for various origins within a glyph-sized region and return the best one found.
    const offsets: Offset[] = [];
    for (let y = -glyphInfo.height; y <= 0; ++y) {
        for (let x = -glyphInfo.width; x <= 0; ++x) {
            offsets.push(new Offset(x, y));
        }
    }
    const offs = partitionArray(offsets, workers.length);
    state.partitions = offs.length;

    offs.forEach(off => {
        workerIndex = (workerIndex + 1) % workers.length;
        const id = workerIndex.toString();
        const worker = workers[workerIndex];
        asciiWorkers.set(id, worker);
        worker.postMessage(new Message(MessageType.CONVERT_TO_ASCII, new AsciiTask(id, imageContent.id, off,
                imageContent, glyphInfo, glyphScaleX, glyphScaleY, rows, cols, rowScale, colScale, marginX, marginY,
                options.color)));
    });
}

function handleAsciiResult(ascii: Ascii) {
    const state = processingStates.get(ascii.processingId);
    if (!state) {
        return;
    }
    --state.partitions;
    if (!state.ascii || ascii.matched > state.ascii.matched) {
        state.ascii = ascii;
    }

    for (let i = processingIds.length - 1; i >= 0; --i) {
        const state = processingStates.get(processingIds[i]);
        if (!state || state.partitions > 0) {
            return;
        }
    }

    const result = new Array<Ascii | null>(processingIds.length);
    for (let i = processingIds.length - 1; i >= 0; --i) {
        const state = processingStates.get(processingIds[i]);
        result[i] = state ? state.ascii : null;
    }

    console.log('FINISHED!!!!');
}

function cancelAll() {
    processingIds.length = 0;
    processingStates.forEach((state, id) => state.worker.postMessage(new Message(MessageType.CANCEL_CONVERT_TO_ASCII, id)));
    processingStates.clear();
}

export function convert(convertOptions: ConvertOptions) {
    cancelAll();
    options = convertOptions;
    adjustWorkersPool(options.threads);

}










