import { MessageType } from 'src/types/messageType';

export default class Message<T> {
    constructor(public type: MessageType, public data?: T) {
    }
}