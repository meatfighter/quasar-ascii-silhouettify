<script setup lang="ts">
import { useAsciiStore } from 'stores/asciiStore';
import { storeToRefs } from 'pinia';
import { useOptionsStore } from 'stores/optionsStore';
import { getHtmlColors } from 'src/app/colors';
import ColoredGlyphs from 'src/types/coloredGlyphs';
import { getGlyphInfo } from 'src/types/glyphInfo';

const { glyphs } = getGlyphInfo();
const htmlColors = getHtmlColors();

const asciiStore = useAsciiStore();
const { asciis } = storeToRefs(asciiStore);

const optionsStore = useOptionsStore();
const { fontSize, lineHeight, monochrome } = storeToRefs(optionsStore);
console.log(monochrome); // TODO REMOVE

function toText(coloredGlyphs: ColoredGlyphs) {
  let text = '';
  coloredGlyphs.glyphIndices.forEach(index => text += glyphs[index].character);
  return text;
}
</script>

<template>
  <q-scroll-area class="full-height-scroll-area">
    <p :style="{ fontSize: fontSize + 'pt', lineHeight: lineHeight }">
      <template v-for="(ascii, asciiIndex) in asciis" :key="`${asciiIndex}`">
        <template v-for="(coloredGlyphs, coloredGlyphsIndex) in ascii.coloredGlyphs"
              :key="`${asciiIndex}-${coloredGlyphsIndex}`">
          <span v-if="coloredGlyphs.color" :style="{ color: '#' + htmlColors[coloredGlyphs.colorIndex] }">
            {{ toText(coloredGlyphs) }}
          </span>
          <div v-else>
            {{ toText(coloredGlyphs) }}
          </div>
          <br v-if="coloredGlyphs.endOfLine">
        </template>
      </template>
    </p>
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

p {
  font-family: 'Cascadia Code', sans-serif;
  color: #CCCCCC;
  white-space: pre;
}
</style>