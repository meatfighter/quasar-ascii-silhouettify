import Rgbas from 'src/types/rgbas';
import { Palette } from 'src/types/palette';

export default class ImageContentTask {

    cancelled = false;

    constructor(
        public imageStateId: string,
        public id: string,
        public rgbas: Rgbas,
        public palette: Palette,
        public colors: number,
        public darkness: number
    ) {
    }
}