<script setup lang="ts">
import { ref } from 'vue';

const fontSizeModel = ref(12);
const lineHeightModel = ref(1.2);
const scaleModel = ref(1);
const colorModel = ref(true);
const threadsModel = ref(12);
</script>

<template>
  <q-scroll-area class="full-height-scroll-area">
    <q-input label="Font Size" v-model.number="fontSizeModel" type="number" filled></q-input>
    <q-input label="Line Height" v-model.number="lineHeightModel" type="number" filled></q-input>
    <q-input label="Scale" v-model.number="scaleModel" type="number" filled></q-input>
    <q-input label="Threads" v-model.number="threadsModel" type="number" filled></q-input>
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