import Glyph from 'src/types/glyph';

export const SPACE = 0;
export const EOL = 255;

export class GlyphInfo {
    constructor(public masks: number[][],
                public glyphs: Glyph[],
                public width: number,
                public height: number,
                public minCount: number) {
    }
}

let glyphInfo: GlyphInfo;

export function setGlyphInfo(gi: GlyphInfo) {
    glyphInfo = gi;
}

export function getGlyphInfo(): GlyphInfo {
    return glyphInfo;
}