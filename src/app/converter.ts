import { loadHtmlColors, Palette } from 'src/app/colors';
import { loadGlyphs } from 'src/app/glyphs';
import { ImageItem } from 'src/types/imageItem';
import { Format } from 'src/app/format';
import { Message, MessageType } from 'src/app/messages';
import { ImageContentResult } from 'src/app/imageProcessor';
import Ascii from 'src/app/ascii';

// ./dist/spa/assets/worker.js

let workers: Worker[] = [];

const htmlColors = loadHtmlColors();
const glyphInfo = await loadGlyphs();

let taskSequence = 0;
let workerIndex = 0;

const imageContentResults = new Map<string, ImageContentResult>();
const asciiResults = new Map<string, Ascii>();
const taskWorkers = new Map<string, Worker>();

function adjustWorkersPool(threads: number) {
    if (workers.length > threads) {
        for (let i = threads; i < workers.length; ++i) {
            workers[i].terminate();
        }
        workers.length = threads;
    }
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

function handleImageContentResult(imageContentResult: ImageContentResult) {

}

function handleAsciiResult(ascii: Ascii) {

}

function postMessage() {

}

function postImageTasks(imageItems: ImageItem[])

export function convert(imageItems: ImageItem[], color: boolean, imageScale: number, fontSize: number,
                        lineHeight: number, format: Format, palette: Palette, htmlColors: string[], threads: number) {

    adjustWorkersPool(threads);
}










