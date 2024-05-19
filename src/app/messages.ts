export enum RequestType {
    IMAGE_DATA,
}

export enum ResponseType {
    IMAGE_DATA,
}

export class Message<T> {
    constructor(public type: RequestType | ResponseType, public data: T) {
    }
}