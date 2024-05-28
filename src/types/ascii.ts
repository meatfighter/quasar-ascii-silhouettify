import ColoredGlyphs from 'src/types/coloredGlyphs';

export default class Ascii {
    constructor(public imageStateId: string,
                public id: string,
                public coloredGlyphsArray: ColoredGlyphs[],
                public matched: number) {
    }
}