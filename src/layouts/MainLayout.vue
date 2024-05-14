<script setup lang="ts">
import { ref } from 'vue';
import { useImageLibraryStore } from 'stores/imageLibraryStore';
import OutputArea from 'components/OutputArea.vue';
import ImagesAndOptions from 'components/ImagesAndOptions.vue';

const imageLibraryStore = useImageLibraryStore();
const { addImage } = imageLibraryStore;

const splitterModel = ref(420);

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
      <q-splitter v-model="splitterModel" class="col" separator-style="width: 0;" unit="px">
        <template v-slot:before>
           <images-and-options/>
        </template>
        <template v-slot:after>
          <output-area/>
        </template>
      </q-splitter>
    </div>
  </q-layout>
</template>

<style scoped>

</style>

