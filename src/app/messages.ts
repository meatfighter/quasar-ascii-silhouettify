export enum MessageType {
    CONVERT_TO_ASCII,
    CANCEL_CONVERT_TO_ASCII,
    ASCII_RESULT,
}

export class Message<T> {
    constructor(public type: MessageType, public data: T) {
    }
}