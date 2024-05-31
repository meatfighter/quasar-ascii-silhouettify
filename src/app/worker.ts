import AsciiTask from 'src/types/asciiTask';
import { cancelAsciiTask, toAscii } from 'src/app/asciiTaskProcessor';
import { MessageType } from 'src/types/messageType';
import Message from 'src/types/message';
import ImageContentTask from 'src/types/imageContentTask';
import { cancelImageContentTask, toImageContent } from 'src/app/imageContentTaskProcessor';
import { initColors } from 'src/app/colors';

initColors();

self.onmessage = <T>(event: MessageEvent<Message<T>>) => {
    const message = event.data;
    switch (message.type) {
        case MessageType.MAKE_CONTENT:
            onMakeContent(message.data as ImageContentTask);
            break;
        case MessageType.CONVERT:
            onConvert(message.data as AsciiTask);
            break;
        case MessageType.CANCEL:
            onCancel(message.data as string);
            break;
        case MessageType.TERMINATE:
            onTerminate();
            break;
    }
};

let runningTasks = 0;
let terminate = false;

function onMakeContent(task: ImageContentTask) {
    ++runningTasks;
    toImageContent(task).then(imageContent => {
        if (imageContent) {
            self.postMessage(new Message(MessageType.CONTENT, imageContent));
        }

        --runningTasks;
        if (terminate && runningTasks === 0) {
            self.close();
        }
    });
}

function onConvert(task: AsciiTask) {
    ++runningTasks;
    toAscii(task).then(ascii => {
        if (ascii) {
            self.postMessage(new Message(MessageType.ASCII, ascii));
        }

        --runningTasks;
        if (terminate && runningTasks === 0) {
            self.close();
        }
    })
}

function onCancel(id: string) {
    cancelAsciiTask(id);
    cancelImageContentTask(id);
}

function onTerminate() {
    terminate = true;
    if (runningTasks === 0) {
        self.close();
    }
}

export {}