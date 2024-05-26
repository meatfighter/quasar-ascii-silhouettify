import { boot } from 'quasar/wrappers';
import { initGlyphInfo } from 'src/app/glyphImage';
import { initColors } from 'src/app/colors';
import { initConverter } from 'src/app/converter';

export default boot(async () => {
    initColors();
    await initGlyphInfo();
    initConverter();
});