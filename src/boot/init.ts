import { boot } from 'quasar/wrappers';
import { initGlyphInfo } from 'src/app/glyphImage';

export default boot(async () => {
    await initGlyphInfo();
});