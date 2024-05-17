<script setup lang="ts">

import { ref } from 'vue';
import ImageLibrary from 'components/ImageLibrary.vue';
import OptionsAdjustor from 'components/OptionsAdjustor.vue';

const splitterModel = ref(120);
</script>

<template>
  <q-splitter v-model="splitterModel" class="col" unit="px" separator-style="width: 0;" style="height: 100%;">
    <template v-slot:before>
      <div ref="optionsAdjustor">
        <options-adjustor/>
      </div>
    </template>
    <template v-slot:after>
      <image-library/>
    </template>
  </q-splitter>
</template>

<style scoped>

</style>