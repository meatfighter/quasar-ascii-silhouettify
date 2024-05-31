import { Rgbas } from 'src/types/rgbas';
import { Palette } from 'src/types/palette';

export default class ContentTask {

    cancelled = false;

    constructor(
        public rgbas: Rgbas,
        public palette: Palette,
        public colors: number,
        public darkness: number
    ) {
    }
}