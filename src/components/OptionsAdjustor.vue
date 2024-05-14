<script setup lang="ts">
import { ref, watch } from 'vue';
import { clamp } from 'src/utils/numbers';

const formatOptions = [ 'text', 'HTML', 'Neofetch' ];
const formatModel = ref('text');

const paletteOptions = [ '8', '16', '240', '256' ];
const paletteModel = ref('240');

const DEFAULT_COLORS = 255;
const MIN_COLORS = 1;
const MAX_COLORS = 255;
const COLORS_STEP = 1;
const colorsModel = ref(DEFAULT_COLORS);
watch(colorsModel, () => colorsModel.value = clamp(colorsModel.value, MIN_COLORS, MAX_COLORS, DEFAULT_COLORS, true));

const DEFAULT_FONT_SIZE = 12;
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 100;
const FONT_SIZE_STEP = MIN_FONT_SIZE;
const fontSizeModel = ref(DEFAULT_FONT_SIZE);
watch(fontSizeModel, () => fontSizeModel.value = clamp(fontSizeModel.value, MIN_FONT_SIZE, MAX_FONT_SIZE,
    DEFAULT_FONT_SIZE));

const DEFAULT_LINE_HEIGHT = 1.2;
const MIN_LINE_HEIGHT = 0.05;
const MAX_LINE_HEIGHT = 5;
const LINE_HEIGHT_STEP = MIN_LINE_HEIGHT;
const lineHeightModel = ref(DEFAULT_LINE_HEIGHT);
watch(lineHeightModel, () => lineHeightModel.value = clamp(lineHeightModel.value, MIN_LINE_HEIGHT, MAX_LINE_HEIGHT,
    DEFAULT_LINE_HEIGHT));

const DEFAULT_SCALE = 1;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const SCALE_STEP = MIN_SCALE;
const scaleModel = ref(DEFAULT_SCALE);
watch(scaleModel, () => scaleModel.value = clamp(scaleModel.value, MIN_SCALE, MAX_SCALE, DEFAULT_SCALE));

const DEFAULT_DARKNESS = 10;
const MIN_DARKNESS = 0;
const MAX_DARKNESS = 100;
const DARKNESS_STEP = 5;
const darknessModel = ref(DEFAULT_DARKNESS);
watch(darknessModel, () => darknessModel.value = clamp(darknessModel.value, MIN_DARKNESS, MAX_DARKNESS,
    DEFAULT_DARKNESS));

const DEFAULT_THREADS = navigator.hardwareConcurrency || 1;
const MIN_THREADS = 1;
const MAX_THREADS = DEFAULT_THREADS;
const THREADS_STEP = 1;
const threadsModel = ref(DEFAULT_THREADS);
watch(threadsModel, () => threadsModel.value = clamp(threadsModel.value, MIN_THREADS, MAX_THREADS, DEFAULT_THREADS,
    true));

const monochromeModel = ref(false);
</script>

<template>
  <q-scroll-area class="full-height-scroll-area">
    <q-select v-model="formatModel" :options="formatOptions" label="Format" filled/>
    <q-select v-model="paletteModel" :options="paletteOptions" label="Palette" filled/>
    <q-input label="Colors" v-model.number="colorsModel" type="number" filled :min="MIN_COLORS" :max="MAX_COLORS"
             :step="COLORS_STEP"/>
    <q-input label="Font Size" v-model.number="fontSizeModel" type="number" filled :min="MIN_FONT_SIZE"
             :max="MAX_FONT_SIZE" :step="FONT_SIZE_STEP"/>
    <q-input label="Line Height" v-model.number="lineHeightModel" type="number" filled :min="MIN_LINE_HEIGHT"
             :max="MAX_LINE_HEIGHT" :step="LINE_HEIGHT_STEP"/>
    <q-input label="Scale" v-model.number="scaleModel" type="number" filled :min="MIN_SCALE" :max="MAX_SCALE"
             :step="SCALE_STEP"/>
    <q-input label="Darkness" v-model.number="darknessModel" type="number" filled :min="MIN_DARKNESS"
             :max="MAX_DARKNESS" :step="DARKNESS_STEP"/>
    <q-input label="Threads" v-model.number="threadsModel" type="number" filled :min="MIN_THREADS" :max="MAX_THREADS"
             :step="THREADS_STEP"/>
    <q-field label="Monochrome" filled stack-label>
      <template v-slot:control>
        <q-toggle v-model="monochromeModel"></q-toggle>
      </template>
    </q-field>
    <div class="q-ma-md row justify-center">
      <q-btn label="Defaults" rounded no-caps color="primary"/>
    </div>
  </q-scroll-area>
</template>

<style scoped>
.full-height-scroll-area {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to right, #15181B 0px, #15181B calc(100% - 8px), #0F1316 100%);
}
</style>