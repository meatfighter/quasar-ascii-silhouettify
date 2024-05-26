<script setup lang="ts">
import { useAsciiStore } from 'stores/asciiStore';
import { storeToRefs } from 'pinia';
import { useOptionsStore } from 'stores/optionsStore';
import { toText } from '../app/formatter';
import { getHtmlColors } from 'src/app/colors';

const htmlColors = getHtmlColors();

const asciiStore = useAsciiStore();
const { asciis } = storeToRefs(asciiStore);

const optionsStore = useOptionsStore();
const { fontSize, lineHeight, monochrome } = storeToRefs(optionsStore);
console.log(monochrome); // TODO REMOVE
</script>

<template>
  <q-scroll-area class="full-height-scroll-area">
    <pre :style="{ fontSize: `${fontSize}pt`, lineHeight: `${lineHeight}` }">
      <template v-for="(ascii, asciiIndex) in asciis" :key="`${asciiIndex}`">
        <span v-for="(coloredGlyph, coloredGlyphIndex) in ascii.coloredGlyphs"
              :key="`${asciiIndex}-${coloredGlyphIndex}`"
              :style="{ color: `#${htmlColors[Math.max(0, coloredGlyph.colorIndex)]}`}">
         {{ toText(coloredGlyph) }}
        </span>
      </template>
    </pre>
  </q-scroll-area>
</template>

<style scoped>
@font-face{
  font-family: cascadia code;
  font-style: normal;
  font-weight: 400;
  src: local('Cascadia Code'),url('./fonts/Cascadia.woff') format('woff');
}

.full-height-scroll-area {
  height: 100%;
  background: #0C0C0C;
  overflow: hidden;
}

pre {
  font-family: 'Cascadia Code', sans-serif;
  color: #CCCCCC;
}
</style>