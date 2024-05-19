import { ImageItem } from 'src/types/imageItem';
import { Palette } from 'src/app/colors';

export class ImageTask {

    cancelled = false;

    constructor(
        public id: string,
        public imageItem: ImageItem,
        public pal: Palette,
        public colors: number,
        public darkness: number
    ) {
    }
}