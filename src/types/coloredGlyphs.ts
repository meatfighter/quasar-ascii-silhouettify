export default class ColoredGlyphs {

    glyphIndices: Uint8Array;

    constructor(glyphIndices: number[],
                public colorIndex: number,
                public color = true,
                public endOfLine = false) {
        this.glyphIndices = new Uint8Array(glyphIndices);
    }
}