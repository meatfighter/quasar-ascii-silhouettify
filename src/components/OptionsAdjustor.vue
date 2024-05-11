<script setup lang="ts">
import { ref, watch } from 'vue';

const DEFAULT_FONT_SIZE = 12;
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 100;
const FONT_SIZE_STEP = MIN_FONT_SIZE;
const fontSizeModel = ref(DEFAULT_FONT_SIZE);
watch(fontSizeModel, () => {
  if (isNaN(fontSizeModel.value) || fontSizeModel.value < MIN_FONT_SIZE || fontSizeModel.value > MAX_FONT_SIZE) {
    fontSizeModel.value = DEFAULT_FONT_SIZE;
  }
});

const DEFAULT_LINE_HEIGHT = 1.2;
const MIN_LINE_HEIGHT = 0.05;
const MAX_LINE_HEIGHT = 5;
const LINE_HEIGHT_STEP = MIN_LINE_HEIGHT;
const lineHeightModel = ref(DEFAULT_LINE_HEIGHT);
watch(lineHeightModel, () => {
  if (isNaN(lineHeightModel.value) || lineHeightModel.value < MIN_LINE_HEIGHT
      || lineHeightModel.value > MAX_LINE_HEIGHT) {
    lineHeightModel.value = DEFAULT_LINE_HEIGHT;
  }
});

const DEFAULT_SCALE = 1;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const SCALE_STEP = MIN_SCALE;
const scaleModel = ref(DEFAULT_SCALE);
watch(scaleModel, () => {
  if (isNaN(scaleModel.value) || scaleModel.value < MIN_SCALE || scaleModel.value > MAX_SCALE) {
    scaleModel.value = DEFAULT_SCALE;
  }
});

const DEFAULT_THREADS = navigator.hardwareConcurrency || 1;
const MIN_THREADS = 1;
const MAX_THREADS = DEFAULT_THREADS;
const THREADS_STEP = 1;
const threadsModel = ref(DEFAULT_THREADS);
watch(threadsModel, () => {
  if (!Number.isInteger(threadsModel.value) || threadsModel.value < MIN_THREADS || threadsModel.value > MAX_THREADS) {
    threadsModel.value = DEFAULT_THREADS;
  }
});

const colorModel = ref(true);
</script>

<template>
  <q-scroll-area class="full-height-scroll-area">
    <q-input label="Font Size" v-model.number="fontSizeModel" type="number" filled :min="MIN_FONT_SIZE"
             :max="MAX_FONT_SIZE" :step="FONT_SIZE_STEP"/>
    <q-input label="Line Height" v-model.number="lineHeightModel" type="number" filled :min="MIN_LINE_HEIGHT"
             :max="MAX_LINE_HEIGHT" :step="LINE_HEIGHT_STEP"/>
    <q-input label="Scale" v-model.number="scaleModel" type="number" filled :min="MIN_SCALE" :max="MAX_SCALE"
             :step="SCALE_STEP"/>
    <q-input label="Threads" v-model.number="threadsModel" type="number" filled :min="MIN_THREADS" :max="MAX_THREADS"
             :step="THREADS_STEP"/>
    <q-field label="Color" filled stack-label>
      <template v-slot:control>
        <q-toggle v-model="colorModel"></q-toggle>
      </template>
    </q-field>
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