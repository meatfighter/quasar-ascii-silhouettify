<script setup lang="ts">
import { ref } from 'vue';
import ImageLibrary from 'components/ImageLibrary.vue';
import { useImageLibraryStore } from 'stores/imageLibraryStore';

const imageLibraryStore = useImageLibraryStore();
const { addImage } = imageLibraryStore;

const splitterModel = ref(20);
const tab = ref('images');

function handleDrop(event: DragEvent) {
  event.preventDefault();

  if (event.dataTransfer) {
    const files: FileList = event.dataTransfer.files;
    if (!files.length) {
      return;
    }
    Array.from(files).forEach(file => addImage(file));
  }
}
</script>

<template>
  <q-layout view="lHh Lpr fff">
    <div @drop.prevent="handleDrop" @dragover.prevent @dragenter.prevent class="row" style="height: 100vh;">
      <q-tabs v-model="tab" vertical indicator-color="transparent" active-color="tab-active-color"
              class="tab-color col-auto" style="height: 100%;">
        <q-tab name="images" icon="photo_library" label="Images"></q-tab>
        <q-tab name="adjust" icon="tune" label="Adjust"></q-tab>
      </q-tabs>

      <q-splitter v-model="splitterModel" class="col">

        <template v-slot:before>
          <q-tab-panels v-model="tab" vertical style="height: 100vh;">
            <q-tab-panel name="images" class="no-padding">
              <image-library/>
            </q-tab-panel>
            <q-tab-panel name="adjust" class="no-padding">
              <p>Tab 2</p>
            </q-tab-panel>
          </q-tab-panels>
        </template>

        <template v-slot:after>
          <q-scroll-area style="height: 100%;">
            <div v-for="n in 5" :key="n">
              {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            </div>
          </q-scroll-area>
        </template>

      </q-splitter>
    </div>
  </q-layout>
</template>

<style scoped>
  .text-tab-active-color {
    color: #7F85F5 !important;
  }

  .bg-tab-active-color {
    background: #7F85F5 !important;
  }

  .tab-color {
    background: linear-gradient(to right, #10171D 0px, #10171D calc(100% - 8px), #0C1216 100%);
    color: #ADADAD;
  }
</style>

