import Glyph from 'src/types/glyph';

export const TERM_WIDTH = 9;
export const TERM_HEIGHT = 19;

export const HTML_WIDTH = 9.363636363636363;
export const HTML_HEIGHT = 19.2;

export const SPACE = 0;

export class GlyphInfo {
    constructor(public masks: number[][],
                public glyphs: Glyph[],
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