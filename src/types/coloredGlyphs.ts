export default class ColoredGlyphs {

    glyphIndices: Uint8Array;

    constructor(glyphIndices: number[],
                public colorIndex: number) {
        this.glyphIndices = new Uint8Array(glyphIndices);
    }
}