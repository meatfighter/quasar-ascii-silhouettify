import { GlyphInfo } from 'src/app/glyphs';
import { DEFAULT_FORMAT, Format } from 'src/types/format';
import { Message, MessageType } from 'src/app/messages';
import { Ascii } from 'src/app/ascii';
import Offset from 'src/app/offset';
import partitionArray from 'src/app/array';
import AsciiTask from 'src/app/asciiTask';
import { ImageContent } from 'src/app/imageContent';
import AsciiWorker from './worker?worker';
import { DEFAULT_PALETTE, Palette } from 'src/types/palette';
import {
    DEFAULT_COLORS,
    DEFAULT_DARKNESS,
    DEFAULT_FONT_SIZE,
    DEFAULT_LINE_HEIGHT, DEFAULT_MONOCHROME,
    DEFAULT_SCALE
} from 'stores/optionsStore';

export type ConvertCallback = (asciiResults: AsciiResult[]) => void;

let format = DEFAULT_FORMAT;
let palette = DEFAULT_PALETTE;
let colors = DEFAULT_COLORS;
let fontSize = DEFAULT_FONT_SIZE;
let lineHeight = DEFAULT_LINE_HEIGHT;
let scale = DEFAULT_SCALE;
let darkness = DEFAULT_DARKNESS;
let color = !DEFAULT_MONOCHROME;

class AsciiResult {
    ascii: Ascii | null = null;
    workers = new Map<string, Worker>();
}

const asciiResults: AsciiResult[] = [];

const workers: Worker[] = [];
let workerIndex = 0;

let callback: ConvertCallback;

export function onFormat(fmt: Format) {
    format = fmt;
}

export function onPalette(pal: Palette) {
    palette = pal;
}

export function onColors(cols: number) {
    colors = cols;
}

export function onFontSize(fntSze: number) {
    fontSize = fntSze;
}

export function onLineHeight(lnHght: number) {
    lineHeight = lnHght;
}

export function onScale(scl: number) {
    scale = scl;
}

export function onDarkness(drknss: number) {
    darkness = drknss;
}

export function onThreads(threads: number) {
    if (workers.length > threads) {
        for (let i = threads; i < workers.length; ++i) {
            workers[i].postMessage(new Message(MessageType.TERMINATE));
        }
        workers.length = threads;
    } else {
        while (workers.length < threads) {
            const worker = new AsciiWorker();
            worker.onmessage = <T>(event: MessageEvent<Message<T>>) => {
                const message = event.data;
                if (message.type === MessageType.ASCII) {
                    onAscii(message.data as Ascii);
                }
            };
            workers.push(worker);
        }
    }
}

export function onColor(clr: boolean) {
    color = clr;
}

function toAscii(imageContent: ImageContent, glyphInfo: GlyphInfo) {

    const asciiResult = new AsciiResult();
    const imageIndex = asciiResults.length;
    asciiResults.push(asciiResult);

    const scaledGlyphWidth = glyphInfo.width * fontSize / 12;
    const scaledGlyphHeight = Math.round(lineHeight * fontSize * 96 / 72);
    const scaledImageWidth = scale * imageContent.width;
    const scaledImageHeight = scale * imageContent.height;
    const rows = Math.ceil(scaledImageHeight / scaledGlyphHeight);
    const cols = Math.ceil(scaledImageWidth / scaledGlyphWidth);
    const paddedWidth = Math.ceil(cols * scaledGlyphWidth);
    const paddedHeight = Math.ceil(rows * scaledGlyphHeight);
    const marginX = (scaledImageWidth - paddedWidth) / 2;
    const marginY = (scaledImageHeight - paddedHeight) / 2;
    const glyphScaleX = scaledGlyphWidth / (scale * glyphInfo.width);
    const glyphScaleY = scaledGlyphHeight / (scale * glyphInfo.height);
    const rowScale = scaledGlyphHeight / scale;
    const colScale = scaledGlyphWidth / scale;

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
        worker.postMessage(new Message(MessageType.CONVERT, new AsciiTask(imageIndex, id, off,
                imageContent, glyphInfo, glyphScaleX, glyphScaleY, rows, cols, rowScale, colScale, marginX, marginY,
                color)));
    });
}

function onAscii(ascii: Ascii) {
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
            worker.postMessage(new Message(MessageType.CANCEL, id));
        });
    });
    asciiResults.length = 0;
}

export function convert(glyphInfo: GlyphInfo, convertCallback: ConvertCallback) {
}