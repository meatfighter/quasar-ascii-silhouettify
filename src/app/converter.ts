import { loadHtmlColors, Palette } from 'src/app/colors';
import { loadGlyphs } from 'src/app/glyphs';
import ImageItem from 'src/types/imageItem';
import { Format } from 'src/app/format';
import { Message, MessageType } from 'src/app/messages';
import { ImageContentResult } from 'src/app/imageProcessor';
import Ascii from 'src/app/ascii';
import ImageTask from 'src/app/imageTask';
import AsciiTask from 'src/app/asciiTask';

// ./dist/spa/assets/worker.js

export interface ConvertParams {
    palette: Palette;
    colors: number;
    darkness: number;
    color: boolean;
    imageScale: number;
    fontSize: number;
    lineHeight: number;
    format: Format;
}

interface ProcessingState {
    id: string;
    worker: Worker;
    imageContentResult?: ImageContentResult;
    ascii?: Ascii;
}

const htmlColors = loadHtmlColors();
const glyphInfo = await loadGlyphs();

let workers: Worker[] = [];
let processingSequence = 0;
let workerIndex = 0;
let params: ConvertParams;

const processingStates = new Map<string, ProcessingState>;

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

}

function handleAsciiResult(ascii: Ascii) {

}

// function postTask(type: MessageType, task: { id: string; }) {
//     workerIndex = (workerIndex + 1) % workers.length;
//     const worker = workers[workerIndex];
//     const processingState = processingStates.get(task.id);
//     if (processingState) {
//         processingState.worker = worker;
//     } else {
//         processingStates.set(task.id, new ProcessingState(task.id, worker));
//     }
//     worker.postMessage(new Message(type, task));
// }

function cancelAll() {
    for (const processingState of processingStates.values()) {
        processingState.worker.postMessage(new Message(processingState.imageContentResult
                ? MessageType.CANCEL_CONVERT_TO_ASCII : MessageType.CANCEL_EXTRACT_IMAGE_CONTENT, processingState.id));
    }
    processingStates.clear();
}

export function convert(threads: number, imageItems: ImageItem[], convertParams: ConvertParams) {

    cancelAll();
    adjustWorkersPool(threads);
    params = convertParams;

}










