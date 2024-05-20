import ImageItem from 'src/types/imageItem';
import { Palette } from 'src/app/colors';

export default class ImageTask {

    cancelled = false;

    constructor(
        public id: string,
        public imageItem: ImageItem,
        public palette: Palette,
        public colors: number,
        public darkness: number
    ) {
    }
}