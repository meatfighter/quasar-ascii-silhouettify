<script setup lang="ts">
  import { ref } from 'vue';
  import { useImageLibraryStore } from 'stores/imageLibraryStore';
  import UrlDialog from 'components/UrlDialog.vue';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();

  const imageLibraryStore = useImageLibraryStore();
  const { addImagesFromFiles } = imageLibraryStore;

  const fileInput = ref<HTMLInputElement | null>(null);

  const urlDialogVisible = ref(false);

  function openFileBrowser() {
    fileInput.value?.click();
  }

  function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
      return;
    }
    addImagesFromFiles(target.files).then(errorMessages => errorMessages.forEach(message => $q.notify({
      message,
      type: 'negative',
      position: 'bottom',
      closeBtn: true,
    })));
  }

  function showUrlDialog() {
    urlDialogVisible.value = true;
  }
</script>

<template>
  <div class="q-pa-sm q-gutter-sm row justify-center">
    <q-btn label="Add File" icon="upload_file" rounded no-caps color="primary" @click="openFileBrowser" />
    <input type="file" ref="fileInput" @change="onFileChange" style="display: none" multiple accept="image/*" />

    <q-btn label="Add URL" icon="cloud_upload" rounded no-caps color="primary" @click="showUrlDialog"/>
  </div>
  <url-dialog v-model="urlDialogVisible"/>
</template>

<style scoped>

</style>