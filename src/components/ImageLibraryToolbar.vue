<script setup lang="ts">
  import { ref } from 'vue';
  import { useImageLibraryStore } from 'stores/imageLibraryStore';
  import UrlDialog from 'components/UrlDialog.vue';
  import { useQuasar } from 'quasar';

  const $q = useQuasar();

  const imageLibraryStore = useImageLibraryStore();
  const { addImagesFromFiles, removeAll } = imageLibraryStore;

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
    <div>
      <q-btn icon="upload_file" round color="primary" @click="openFileBrowser" />
      <q-tooltip>Add Image File(s)</q-tooltip>
    </div>
    <input type="file" ref="fileInput" @change="onFileChange" style="display: none" multiple accept="image/*" />

    <div>
      <q-btn icon="cloud_upload" round color="primary" @click="showUrlDialog"/>
      <q-tooltip>Add Image URL</q-tooltip>
    </div>

    <div>
      <q-btn icon="delete" round color="primary" @click="removeAll"/>
      <q-tooltip>Remove All Images</q-tooltip>
    </div>
  </div>
  <url-dialog v-model="urlDialogVisible"/>
</template>

<style scoped>

</style>