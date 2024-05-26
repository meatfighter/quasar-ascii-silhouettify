import { DEFAULT_FORMAT, Format } from 'src/types/format';
import Offset from 'src/types/offset';
import AsciiTask from 'src/types/asciiTask';
import AsciiWorker from './worker?worker';
import { DEFAULT_PALETTE, Palette } from 'src/types/palette';
import {
    DEFAULT_COLORS,
    DEFAULT_DARKNESS,
    DEFAULT_FONT_SIZE,
    DEFAULT_LINE_HEIGHT,
    DEFAULT_MONOCHROME,
    DEFAULT_SCALE
} from 'stores/optionsStore';
import { ImageItem } from 'src/types/imageItem';
import Ascii from 'src/types/ascii';
import { partitionArray } from 'src/utils/arrays';
import { getGlyphInfo } from 'src/types/glyphInfo';
import { makeImageContent } from 'src/app/imageContentManip';
import { ImageContent } from 'src/types/imageContent';
import Message from 'src/types/message';
import { MessageType } from 'src/types/messageType';

let imageItems: ImageItem[] = [];
let format = DEFAULT_FORMAT;
let palette = DEFAULT_PALETTE;
let colors = DEFAULT_COLORS;
let fontSize = DEFAULT_FONT_SIZE;
let lineHeight = DEFAULT_LINE_HEIGHT;
let scale = DEFAULT_SCALE;
let darkness = DEFAULT_DARKNESS;
let color = !DEFAULT_MONOCHROME;

class ImageState {
    ascii: Ascii | null = null;
    workers = new Map<string, Worker>();

    constructor(public imageContent: ImageContent) {
    }
}

const workers: Worker[] = [];
let workerIndex = 0;

let imageStates = new Map<string, ImageState>();

function requestAll() {
    imageStates.forEach((imageState, imageStateId) => {
        imageState.workers.forEach((worker, id) => worker.postMessage(new Message(MessageType.CANCEL, id)))
        imageState.workers.clear();
        imageState.ascii = null;
        toAscii(imageStateId, imageState);
    });
}

function getColors(fmt: Format) {
    return (fmt === Format.NEOFETCH) ? Math.min(6, colors) : colors;
}

function addImageState(imgStates: Map<string, ImageState>, imageItem: ImageItem) {
    const imageState = new ImageState(makeImageContent(imageItem.imageData, palette, getColors(format), darkness));
    imgStates.set(imageItem.id, imageState);
    toAscii(imageItem.id, imageState);
}

function refreshImageStates() {
    imageStates.forEach(imageState => imageState.workers.forEach((worker, id) =>
            worker.postMessage(new Message(MessageType.CANCEL, id))));
    imageStates.clear();

    imageItems.forEach(imageItem => addImageState(imageStates, imageItem));
}

export function onImageItems(imgItems: ImageItem[]) {
    imageItems = imgItems;

    const imgStates = new Map<string, ImageState>();
    imageItems.forEach(imageItem => {
        const imageState = imageStates.get(imageItem.id);
        if (imageState) {
            imgStates.set(imageItem.id, imageState);
        } else {
            addImageState(imgStates, imageItem);
        }
    });

    imageStates.forEach((imageState, id) => {
        if (!imgStates.has(id)) {
            imageState.workers.forEach((worker, id) => worker.postMessage(new Message(MessageType.CANCEL, id)));
        }
    });

    imageStates = imgStates;
}

export function onFormat(fmt: Format) {
    const refresh = getColors(fmt) !== getColors(format);
    format = fmt;
    if (refresh) {
        refreshImageStates();
    }
}

export function onPalette(pal: Palette) {
    palette = pal;
    refreshImageStates();
}

export function onColors(cols: number) {
    colors = cols;
    refreshImageStates();
}

export function onFontSize(fntSze: number) {
    fontSize = fntSze;
    requestAll();
}

export function onLineHeight(lnHght: number) {
    lineHeight = lnHght;
    requestAll();
}

export function onScale(scl: number) {
    scale = scl;
    requestAll();
}

export function onDarkness(drknss: number) {
    darkness = drknss;
    refreshImageStates();
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
    requestAll();
}

function toAscii(imageStateId: string, imageState: ImageState) {

    const glyphInfo = getGlyphInfo();
    const scaledGlyphWidth = glyphInfo.width * fontSize / 12;
    const scaledGlyphHeight = Math.round(lineHeight * fontSize * 96 / 72);
    const scaledImageWidth = scale * imageState.imageContent.width;
    const scaledImageHeight = scale * imageState.imageContent.height;
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
        imageState.workers.set(id, worker);
        worker.postMessage(new Message(MessageType.CONVERT, new AsciiTask(imageStateId, id, off,
                imageState.imageContent, glyphInfo, glyphScaleX, glyphScaleY, rows, cols, rowScale, colScale, marginX,
                marginY, color)));
    });
}

function onAscii(ascii: Ascii) {
    const imageState = imageStates.get(ascii.imageStateId);
    if (!(imageState && imageState.workers.has(ascii.id))) {
        return;
    }
    imageState.workers.delete(ascii.id);
    if (!imageState.ascii || imageState.ascii.matched < ascii.matched) {
        imageState.ascii = ascii;
    }

    for (const imageState of imageStates.values()) {
        if (imageState.workers.size > 0) {
            return;
        }
    }

    // DONE
    console.log(imageStates); // TODO
}