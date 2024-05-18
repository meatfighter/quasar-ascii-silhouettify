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
  <q-layout view="hHh lpr fFf">

    <div @drop.prevent="handleDrop" @dragover.prevent @dragenter.prevent>
      <q-header style="background: #1F1F1F; color: white;">
        <q-toolbar>
          <q-img src="logo.svg" spinner-color="white" style="width: 32px; height: 32px;"/>
          <q-toolbar-title>ASCII Silhouettify</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page class="row items-stretch">
          <q-splitter v-model="splitterModel" separator-style="width: 0;" unit="px" style="width: 100%;">
            <template v-slot:before>
              <images-and-options/>
            </template>
            <template v-slot:after>
              <output-area/>
            </template>
          </q-splitter>
        </q-page>
      </q-page-container>

      <q-footer style="background: #1F1F1F; color: white;">
        <q-toolbar>
          <q-toolbar-title>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" alt="logo">
            </q-avatar>
            Title
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </div>
  </q-layout>
</template>

<style scoped>
</style>

