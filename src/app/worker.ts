import { Message, MessageType } from 'src/app/messages';
import AsciiTask from 'src/app/asciiTask';
import { cancelAsciiTask, toAscii } from 'src/app/asciiTaskProcessor';

self.onmessage = <T>(event: MessageEvent<Message<T>>) => {
    const message = event.data;
    switch (message.type) {
        case MessageType.CONVERT_TO_ASCII:
            handleConvertToAscii(message.data as AsciiTask);
            break;
        case MessageType.CANCEL_CONVERT_TO_ASCII:
            handleCancelConvertToAscii(message.data as string);
            break;
    }
};

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