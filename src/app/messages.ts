export enum MessageType {
    CONVERT,
    CANCEL,
    ASCII,
    TERMINATE,
}

export class Message<T> {
    constructor(public type: MessageType, public data?: T) {
    }
}