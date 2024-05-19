import { Message, MessageType } from 'src/app/messages';
import { ImageTask } from 'src/app/imageTask';
import AsciiTask from 'src/app/asciiTask';
import { cancelImageTask, extractImageContent } from 'src/app/imageProcessor';
import { cancelAsciiTask, toAscii } from 'src/app/asciiTaskProcessor';

self.onmessage = <T>(event: MessageEvent<Message<T>>) => {
    const message = event.data;
    switch (message.type) {
        case MessageType.EXTRACT_IMAGE_CONTENT:
            handleExtractImageContent(message.data as ImageTask);
            break;
        case MessageType.CANCEL_EXTRACT_IMAGE_CONTENT:
            handleCancelExtractImageContent(message.data as string);
            break;
        case MessageType.CONVERT_TO_ASCII:
            handleConvertToAscii(message.data as AsciiTask);
            break;
        case MessageType.CANCEL_CONVERT_TO_ASCII:
            handleCancelConvertToAscii(message.data as string);
            break;
    }
};

function handleExtractImageContent(task: ImageTask) {
    extractImageContent(task).then(imageContentResult => self.postMessage(
            new Message(MessageType.IMAGE_CONTENT_RESULT, imageContentResult)));
}

function handleCancelExtractImageContent(id: string) {
    cancelImageTask(id);
}

function handleConvertToAscii(task: AsciiTask) {
    toAscii(task).then(ascii => {
        if (ascii) {
            self.postMessage(new Message(MessageType.ASCII_RESULT, ascii));
        }
    })
}

function handleCancelConvertToAscii(id: string) {
    cancelAsciiTask(id);
}

export {}