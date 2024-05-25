<script setup lang="ts">
import {
  COLORS_STEP,
  DARKNESS_STEP,
  FONT_SIZE_STEP,
  FORMAT_OPTIONS, LINE_HEIGHT_STEP,
  MAX_COLORS, MAX_DARKNESS, MAX_FONT_SIZE, MAX_LINE_HEIGHT, MAX_SCALE, MAX_THREADS,
  MIN_COLORS, MIN_DARKNESS,
  MIN_FONT_SIZE, MIN_LINE_HEIGHT, MIN_SCALE, MIN_THREADS,
  PALETTE_OPTIONS, SCALE_STEP, THREADS_STEP,
  useOptionsStore
} from 'stores/optionsStore';
import { storeToRefs } from 'pinia';

  const optionsStore = useOptionsStore();
  const { format, palette, colors, fontSize, lineHeight, scale, darkness, threads, monochrome}
      = storeToRefs(optionsStore);
  const { reset } = optionsStore;

</script>

<template>
    <q-scroll-area class="full-height-scroll-area">
      <q-select v-model="format" :options="FORMAT_OPTIONS" label="Format" filled/>
      <q-select v-model="palette" :options="PALETTE_OPTIONS" label="Palette" filled/>
      <q-input label="Colors" v-model.number="colors" type="number" filled :min="MIN_COLORS" :max="MAX_COLORS"
               :step="COLORS_STEP"/>
      <q-input label="Font Size" v-model.number="fontSize" type="number" filled :min="MIN_FONT_SIZE"
               :max="MAX_FONT_SIZE" :step="FONT_SIZE_STEP"/>
      <q-input label="Line Height" v-model.number="lineHeight" type="number" filled :min="MIN_LINE_HEIGHT"
               :max="MAX_LINE_HEIGHT" :step="LINE_HEIGHT_STEP"/>
      <q-input label="Scale" v-model.number="scale" type="number" filled :min="MIN_SCALE" :max="MAX_SCALE"
               :step="SCALE_STEP"/>
      <q-input label="Darkness" v-model.number="darkness" type="number" filled :min="MIN_DARKNESS"
               :max="MAX_DARKNESS" :step="DARKNESS_STEP"/>
      <q-input label="Threads" v-model.number="threads" type="number" filled :min="MIN_THREADS" :max="MAX_THREADS"
               :step="THREADS_STEP"/>
      <q-field label="Monochrome" filled stack-label>
        <template v-slot:control>
          <q-toggle v-model="monochrome"></q-toggle>
        </template>
      </q-field>
      <div class="q-ma-md row justify-center">
        <q-btn label="Defaults" rounded no-caps color="primary" @click="reset()"/>
      </div>
    </q-scroll-area>
</template>

<style scoped>
.full-height-scroll-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(to right, #15181B 0px, #15181B calc(100% - 8px), #0F1316 100%);
}
</style>