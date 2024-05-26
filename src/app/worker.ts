import AsciiTask from 'src/types/asciiTask';
import { cancelTask, toAscii } from 'src/app/asciiTaskProcessor';
import { MessageType } from 'src/types/messageType';
import Message from 'src/types/message';

self.onmessage = <T>(event: MessageEvent<Message<T>>) => {
    const message = event.data;
    switch (message.type) {
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
    cancelTask(id);
}

function onTerminate() {
    terminate = true;
    if (runningTasks === 0) {
        self.close();
    }
}

export {}