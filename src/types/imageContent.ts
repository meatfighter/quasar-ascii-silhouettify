export class ImageContent {
    constructor(public imageStateId: string,
                public id: string,
                public indices: Uint8Array,
                public width: number,
                public height: number) {
    }
}