<script setup lang="ts">

import { ref } from 'vue';
import ImageLibrary from 'components/ImageLibrary.vue';
import OptionsAdjustor from 'components/OptionsAdjustor.vue';

const splitterModel = ref(120);
</script>

<template>
  <q-splitter v-model="splitterModel" unit="px" separator-style="width: 0;" style="height: 100%; overflow: hidden;">
    <template v-slot:before>
      <options-adjustor/>
    </template>
    <template v-slot:after>
      <image-library/>
    </template>
  </q-splitter>
</template>

<style scoped>
</style>