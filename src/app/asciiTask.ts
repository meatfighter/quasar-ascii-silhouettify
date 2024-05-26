import Offset from 'src/app/offset';
import { ImageContent } from 'src/app/imageContent';
import { GlyphInfo } from 'src/app/glyphs';

export default class AsciiTask {

    cancelled = false;

    constructor(
        public imageStateId: string,
        public id: string,
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
        public color: boolean
    ) {
    }
}