export class Ascii {
    constructor(public id: string,
                public processingId: string,
                public textBlocks: TextBlock[],
                public matched: number) {
    }
}

export class TextBlock {

    glyphIndices: Uint8Array;

    constructor(glyphIndices: number[],
                public colorIndex: number) {
        this.glyphIndices = new Uint8Array(glyphIndices);
    }
}