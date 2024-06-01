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
    DEFAULT_SCALE,
    DEFAULT_THREADS
} from 'stores/optionsStore';
import { ImageItem } from 'src/types/imageItem';
import Ascii from 'src/types/ascii';
import { partitionArray } from 'src/utils/arrays';
import { getGlyphInfo } from 'src/types/glyphInfo';
import { ImageContent } from 'src/types/imageContent';
import Message from 'src/types/message';
import { MessageType } from 'src/types/messageType';
import { useAsciiStore } from 'stores/asciiStore';
import ImageContentTask from 'src/types/imageContentTask';
import { toRaw } from 'vue';

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
    imageContent: ImageContent | null = null;
    ascii: Ascii | null = null;
    workers = new Map<string, Worker>();
}

const asciiStore = useAsciiStore();
const { setAsciis, clearAsciis, setProcessing } = asciiStore;

const workers: Worker[] = [];
let workerIndex = 0;
let idSequence = 0;

let imageStates = new Map<string, ImageState>();

export function initConverter() {
    onThreads(DEFAULT_THREADS);
}

function updateProcessing() {
    for (const imageState of imageStates.values()) {
        if (imageState.workers.size > 0) {
            setProcessing(true);
            return;
        }
    }
    setProcessing(false);
}

function requestAll() {
    clearAsciis();
    for (const imageState of imageStates.values()) {
        imageState.workers.forEach((worker, id) => worker.postMessage(new Message(MessageType.CANCEL, id)));
        imageState.workers.clear();
        imageState.imageContent = null;
        imageState.ascii = null;
    }
    imageItems.forEach(imageItem => {
        const imageState = imageStates.get(imageItem.id);
        if (imageState) {
            toImageContent(imageItem, imageState);
        }
    });
    updateProcessing();
}

function getColors(fmt: Format) {
    return (fmt === Format.NEOFETCH) ? Math.min(6, colors) : colors;
}

function addImageState(imgStates: Map<string, ImageState>, imageItem: ImageItem) {
    const imageState = new ImageState();
    imgStates.set(imageItem.id, imageState);
    toImageContent(imageItem, imageState);
}

function refreshImageStates() {
    clearAsciis();

    imageStates.forEach(imageState => imageState.workers.forEach((worker, id) =>
            worker.postMessage(new Message(MessageType.CANCEL, id))));
    imageStates.clear();

    imageItems.forEach(imageItem => addImageState(imageStates, imageItem));

    updateProcessing();
}

export function onImageItems(imgItems: ImageItem[]) {

    clearAsciis();

    imageItems = imgItems;

    const imgStates = new Map<string, ImageState>();
    let added = false;
    imageItems.forEach(imageItem => {
        const imageState = imageStates.get(imageItem.id);
        if (imageState) {
            imgStates.set(imageItem.id, imageState);
        } else {
            addImageState(imgStates, imageItem);
            added = true;
        }
    });

    imageStates.forEach((imageState, id) => {
        if (!imgStates.has(id)) {
            imageState.workers.forEach((worker, id) => worker.postMessage(new Message(MessageType.CANCEL, id)));
        }
    });

    imageStates = imgStates;

    if (!added) {
        updateAsciis();
    }

    updateProcessing();
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
                switch (message.type) {
                    case MessageType.CONTENT:
                        onImageContent(message.data as ImageContent);
                        break;
                    case MessageType.ASCII:
                        onAscii(message.data as Ascii);
                        break;
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

function toImageContent(imageItem: ImageItem, imageState: ImageState) {
    const id = idSequence.toString();
    ++idSequence;

    const worker = workers[workerIndex];
    workerIndex = (workerIndex + 1) % workers.length;

    imageState.workers.set(id, worker);

    worker.postMessage(new Message(MessageType.MAKE_CONTENT,
            new ImageContentTask(imageItem.id, id, toRaw(imageItem.rgbas), palette, getColors(format), darkness)));
}

function toAscii(imageStateId: string, imageState: ImageState) {

    if (!imageState.imageContent) {
        return;
    }
    const { imageContent } = imageState;

    const glyphInfo = getGlyphInfo();
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
        const id = idSequence.toString();
        ++idSequence;

        const worker = workers[workerIndex];
        workerIndex = (workerIndex + 1) % workers.length;

        imageState.workers.set(id, worker);

        worker.postMessage(new Message(MessageType.CONVERT, new AsciiTask(imageStateId, id, off,
                imageContent, glyphInfo, glyphScaleX, glyphScaleY, rows, cols, rowScale, colScale, marginX,
                marginY, color)));
    });
}

function updateAsciis() {
    const asciis: Ascii[] = [];
    imageStates.forEach(imageState => {
        if (imageState.ascii) {
            asciis.push(imageState.ascii);
        }
    });

    setAsciis(asciis);
}

function isRunningWorkers() {
    for (const imageState of imageStates.values()) {
        if (imageState.workers.size > 0) {
            return true;
        }
    }
    return false;
}

function onImageContent(imageContent: ImageContent) {
    const imageState = imageStates.get(imageContent.imageStateId);
    if (!(imageState && imageState.workers.has(imageContent.id))) {
        return;
    }
    imageState.workers.delete(imageContent.id);
    imageState.imageContent = imageContent;
    toAscii(imageContent.imageStateId, imageState);
    updateProcessing();
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

    if (isRunningWorkers()) {
        return;
    }

    updateProcessing();
    updateAsciis();
}