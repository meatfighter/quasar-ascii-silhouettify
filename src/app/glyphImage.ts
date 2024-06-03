import { loadRgbas } from 'src/utils/images';
import { getGlyphInfo, GlyphInfo, setGlyphInfo, TERM_HEIGHT, TERM_WIDTH } from 'src/types/glyphInfo';
import Glyph from 'src/types/glyph';

const GLYPHS_IMAGE_FILENAME = 'src/assets/images/glyphs.png';

const PRINTABLE_ASCII
    = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

class GlyphImage {
    htmlEscapedCharacter: string;
    neofetchEscapedCharacter: string;
    count: number;

    constructor(public character: string,
                public pixels: boolean[][]) {

        this.character = character;
        this.pixels = pixels;

        this.count = 0;
        for (let i = pixels.length - 1; i >= 0; --i) {
            const row = pixels[i];
            for (let j = row.length - 1; j >= 0; --j) {
                if (row[j]) {
                    ++this.count;
                }
            }
        }

        switch (character) {
            case '&':
                this.htmlEscapedCharacter = '&amp;';
                break;
            case '<':
                this.htmlEscapedCharacter = '&lt;';
                break;
            case '>':
                this.htmlEscapedCharacter = '&gt;';
                break;
            case '"':
                this.htmlEscapedCharacter = '&quot;';
                break;
            case '\'':
                this.htmlEscapedCharacter = '&apos;';
                break;
            default:
                this.htmlEscapedCharacter = character;
                break;
        }

        switch (character) {
            case '\\':
                this.neofetchEscapedCharacter = '\\\\';
                break;
            case '$':
                this.neofetchEscapedCharacter = '\x24';
                break;
            default:
                this.neofetchEscapedCharacter = character;
                break;
        }
    }
}

async function loadGlyphs(): Promise<GlyphInfo> {
    const masks: number[][] = [];
    const glyphsImages = new Array<GlyphImage>(PRINTABLE_ASCII.length);
    const rgbas = await loadRgbas(GLYPHS_IMAGE_FILENAME, GLYPHS_IMAGE_FILENAME);
    const data = rgbas.data;

    for (let i = PRINTABLE_ASCII.length - 1; i >= 0; --i) {
        const glphyPixels = new Array<boolean[]>(TERM_HEIGHT);
        const I = i * TERM_WIDTH;
        for (let j = TERM_HEIGHT - 1; j >= 0; --j) {
            const row = glphyPixels[j] = new Array<boolean>(TERM_WIDTH);
            const J = I + j * rgbas.width;
            for (let k = row.length - 1; k >= 0; --k) {
                row[k] = (data[(J + k) << 2] !== 0);
            }
        }
        glyphsImages[i] = new GlyphImage(PRINTABLE_ASCII[i], glphyPixels);
    }

    glyphsImages.sort((a, b) => a.count - b.count);

    masks.length = TERM_WIDTH * TERM_HEIGHT;
    for (let i = masks.length - 1; i >= 0; --i) {
        masks[i] = [ 0, 0, 0 ];
    }
    for (let i = glyphsImages.length - 1; i >= 0; --i) {
        const pixels = glyphsImages[i].pixels;
        const index = i >> 5;
        const mask = 1 << (i & 31);
        for (let j = TERM_HEIGHT - 1; j >= 0; --j) {
            const row = pixels[j];
            const tableOffset = TERM_WIDTH * j;
            for (let k = row.length - 1; k >= 0; --k) {
                if (!row[k]) {
                    masks[tableOffset + k][index] |= mask;
                }
            }
        }
    }

    const glyphs = new Array<Glyph>(glyphsImages.length);
    for (let i = glyphsImages.length - 1; i >= 0; --i) {
        const glyphImage = glyphsImages[i];
        glyphs[i] = new Glyph(glyphImage.character, glyphImage.htmlEscapedCharacter,
                glyphImage.neofetchEscapedCharacter, glyphImage.count);
    }

    return new GlyphInfo(masks, glyphs, glyphs[1].count);
}

export async function initGlyphInfo() {
    const glyphInfo = getGlyphInfo();
    if (!glyphInfo) {
        setGlyphInfo(await loadGlyphs());
    }
}