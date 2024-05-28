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
const { asciis, processing } = storeToRefs(asciiStore);

const optionsStore = useOptionsStore();
const { fontSize, lineHeight } = storeToRefs(optionsStore);

function toText(coloredGlyphs: ColoredGlyphs) {
  let text = '';
  coloredGlyphs.glyphIndices.forEach(index => text += glyphs[index].character);
  return text;
}

function getStyle(coloredGlyphs: ColoredGlyphs) {
  if (coloredGlyphs.color) {
    return {
      color: '#' + htmlColors[coloredGlyphs.colorIndex],
    };
  } else {
    return {};
  }
}
</script>

<template>
  <div v-if="processing" class="flex flex-center items-center" style="width: 100%; height: 100%; background: #0C0C0C;">
    <q-spinner-grid color="primary" size="5em"/>
  </div>
  <q-scroll-area v-else class="full-height-scroll-area">
      <p :style="{ fontSize: fontSize + 'pt', lineHeight: lineHeight }">
        <template v-for="(ascii, asciiIndex) in asciis" :key="`${asciiIndex}`">
          <template v-for="(coloredGlyphs, coloredGlyphsIndex) in ascii.coloredGlyphsArray"
                :key="`${asciiIndex}-${coloredGlyphsIndex}`">
            <span :style="getStyle(coloredGlyphs)">
              {{ toText(coloredGlyphs) }}
            </span>
            <br v-if="coloredGlyphs.endOfLine">
          </template>
        </template>
      </p>
  </q-scroll-area>
</template>

<style scoped>
.full-height-scroll-area {
  height: 100%;
  background: #0C0C0C;
  overflow: hidden;
}

p {
  font-family: 'Cascadia Code', sans-serif;
  color: #CCCCCC;
  white-space: pre;
  text-align: center;
}
</style>