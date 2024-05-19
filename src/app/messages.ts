export enum MessageType {
    EXTRACT_IMAGE_CONTENT,
    CANCEL_EXTRACT_IMAGE_CONTENT,
    IMAGE_CONTENT_RESULT,

    CONVERT_TO_ASCII,
    CANCEL_CONVERT_TO_ASCII,
    ASCII_RESULT,
}

export class Message<T> {
    constructor(public type: MessageType, public data: T) {
    }
}