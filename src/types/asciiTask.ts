import Offset from 'src/types/offset';
import { GlyphInfo } from 'src/types/glyphInfo';
import { ImageContent } from 'src/types/imageContent';

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