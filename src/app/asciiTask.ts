import Offset from 'src/app/offset';
import { ImageContent } from 'src/app/imageProcessor';
import { GlyphInfo } from 'src/app/glyphs';
import { Format } from 'src/app/format';
import { Palette } from 'src/app/colors';

export default class AsciiTask {

    cancelled = false;

    constructor(
        public id: string,
        public processingId: string,
        public offsets: Offset[],
        public image: ImageContent,
        public glyphInfo: GlyphInfo,
        public glyphScaleX: number,
        public glyphScaleY: number,
        public rows: number,
        public cols: number,
        public rowScale: number,
        public colScale: number,
        public marginX: number,
        public marginY: number,
        public color: boolean,
        public format: Format,
        public palette: Palette,
        public htmlColors: string[]
    ) {
    }
}