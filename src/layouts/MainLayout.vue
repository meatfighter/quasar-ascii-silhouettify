<script setup lang="ts">
import { ref } from 'vue';
import { useImageLibraryStore } from 'stores/imageLibraryStore';
import OutputArea from 'components/OutputArea.vue';
import ImagesAndOptions from 'components/ImagesAndOptions.vue';
import MainHeader from 'components/MainHeader.vue';
import { useQuasar } from 'quasar';
import MainFooter from 'components/MainFooter.vue';

const $q = useQuasar();

const imageLibraryStore = useImageLibraryStore();
const { addImagesFromFiles } = imageLibraryStore;

const splitterModel = ref(420);

function onDrop(event: DragEvent) {
  event.preventDefault();

  if (event.dataTransfer) {
    const files: FileList = event.dataTransfer.files;
    if (!files || files.length === 0) {
      return;
    }
    addImagesFromFiles(files).then(errorMessages => errorMessages.forEach(message => $q.notify({
      message,
      type: 'negative',
      position: 'bottom',
      closeBtn: true,
    })));
  }
}
</script>

<template>
  <q-layout view="hHh lpr fFf">

    <div @drop.prevent="onDrop" @dragover.prevent @dragenter.prevent>
      <main-header/>

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

      <main-footer/>
    </div>
  </q-layout>
</template>

<style scoped>
</style>

