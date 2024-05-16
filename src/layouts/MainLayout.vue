<script setup lang="ts">
// import { ref } from 'vue';
import { useImageLibraryStore } from 'stores/imageLibraryStore';
// import OutputArea from 'components/OutputArea.vue';
// import ImagesAndOptions from 'components/ImagesAndOptions.vue';
//
const imageLibraryStore = useImageLibraryStore();
const { addImage } = imageLibraryStore;
//
// const splitterModel = ref(420);
//
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
  <q-layout view="hHh lpR fFf">

    <div @drop.prevent="handleDrop" @dragover.prevent @dragenter.prevent class="row">
      <q-header class="bg-primary text-white">
        <q-toolbar>
          <q-toolbar-title>
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" alt="logo">
            </q-avatar>
            Title
          </q-toolbar-title>
        </q-toolbar>
      </q-header>


        <q-page-container style="background: #9C27B0;">
          <q-scroll-area class="col" style="width: 800px; height: 800px;">
            <q-page>
              <p>Hello, World!</p>
              <p>Hello, World!</p>
              <p>Hello, World!</p>
            </q-page>
            <q-page>
              <p>Hello, World!</p>
              <p>Hello, World!</p>
              <p>Hello, World!</p>
            </q-page>
          </q-scroll-area>
        </q-page-container>


<!--      <q-page-container>-->
<!--        <q-splitter v-model="splitterModel" separator-style="width: 0;" unit="px">-->
<!--          <template v-slot:before>-->
<!--             <images-and-options/>-->
<!--          </template>-->
<!--          <template v-slot:after>-->
<!--            <output-area/>-->
<!--          </template>-->
<!--        </q-splitter>-->
<!--      </q-page-container>-->

      <q-footer class="bg-grey-8 text-white">
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

