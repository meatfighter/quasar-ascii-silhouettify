import { loadHtmlColors, Palette } from 'src/app/colors';
import { loadGlyphs } from 'src/app/glyphs';
import ImageItem from 'src/types/imageItem';
import { Format } from 'src/app/format';
import { Message, MessageType } from 'src/app/messages';
import { ImageContentResult } from 'src/app/imageProcessor';
import Ascii from 'src/app/ascii';
import ImageTask from 'src/app/imageTask';
import Offset from 'src/app/offset';
import partitionArray from 'src/app/array';
import AsciiTask from 'src/app/asciiTask';

// ./dist/spa/assets/worker.js

export class ConvertOptions {
    constructor(public imageItems: ImageItem[],
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
    imageContentResult: ImageContentResult | null = null;
    ascii: Ascii | null = null;
    partitions = 0;

    constructor(public worker: Worker) {
    }
}

// TODO PINIA STORE!!!
const htmlColors = loadHtmlColors();
const glyphInfo = await loadGlyphs();

const processingIds: string[] = [];
const processingStates = new Map<string, ProcessingState>();
const asciiWorkers = new Map<string, Worker>();

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
            const worker = new Worker('worker.js');
            worker.onmessage = <T>(event: MessageEvent<Message<T>>) => {
                const message = event.data;
                switch (message.type) {
                    case MessageType.IMAGE_CONTENT_RESULT:
                        handleImageContentResult(message.data as ImageContentResult);
                        break;
                    case MessageType.ASCII_RESULT:
                        handleAsciiResult(message.data as Ascii);
                        break;
                }
            };
            workers.push(worker);
        }
    }
}

function handleImageContentResult(imageContentResult: ImageContentResult) {
    const state = processingStates.get(imageContentResult.id);
    if (!state) {
        return;
    }
    state.imageContentResult = imageContentResult;
    if (!imageContentResult.imageContent) {
        return;
    }
    const imageContent = imageContentResult.imageContent;

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
        worker.postMessage(new Message(MessageType.CONVERT_TO_ASCII, new AsciiTask(id, imageContentResult.id, off,
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
        const s = processingStates.get(processingIds[i]);
        if (!(s && s.imageContentResult)) {
            return;
        }
        if (!s.imageContentResult.imageContent) {
            continue;
        }
        if (s.partitions > 0) {
            return;
        }
    }

    const result = new Array<Ascii | null>(processingIds.length);
    for (let i = processingIds.length - 1; i >= 0; --i) {
        const s = processingStates.get(processingIds[i]);
        result[i] = s ? s.ascii : null;
    }

    console.log('FINISHED!!!!');
}

function cancelAll() {
    processingIds.length = 0;

    processingStates.forEach((value, id) => value.worker.postMessage(
            new Message(MessageType.CANCEL_EXTRACT_IMAGE_CONTENT, id)));
    processingStates.clear();

    asciiWorkers.forEach((worker, id) => worker.postMessage(new Message(MessageType.CANCEL_CONVERT_TO_ASCII, id)));
    asciiWorkers.clear();
}

function postImageTasks() {
    options.imageItems.forEach(imageItem => {
        workerIndex = (workerIndex + 1) % workers.length;
        const id = workerIndex.toString();
        const worker = workers[workerIndex];
        processingIds.push(id);
        processingStates.set(id, new ProcessingState(worker));
        worker.postMessage(new Message(MessageType.EXTRACT_IMAGE_CONTENT, new ImageTask(id, imageItem, options.palette,
                options.colors, options.darkness)));
    });
}

export function convert(convertOptions: ConvertOptions) {
    cancelAll();
    options = convertOptions;
    adjustWorkersPool(options.threads);
    postImageTasks();

}










