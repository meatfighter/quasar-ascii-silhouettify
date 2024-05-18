<script setup lang="ts">
  import { ref } from 'vue';
  import { useImageLibraryStore } from 'stores/imageLibraryStore';
  import UrlDialog from 'components/UrlDialog.vue';

  const imageLibraryStore = useImageLibraryStore();
  const { addImageFromFile } = imageLibraryStore;

  const fileInput = ref<HTMLInputElement | null>(null);

  const urlDialogVisible = ref(false);

  function openFileBrowser() {
    fileInput.value?.click();
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      Array.from(target.files).forEach(file => addImageFromFile(file));
    }
  }

  function showUrlDialog() {
    urlDialogVisible.value = true;
  }
</script>

<template>
  <div class="q-pa-sm q-gutter-sm row justify-center">
    <q-btn label="Add File" icon="upload_file" rounded no-caps color="primary" @click="openFileBrowser" />
    <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" multiple accept="image/*" />

    <q-btn label="Add URL" icon="cloud_upload" rounded no-caps color="primary" @click="showUrlDialog"/>
  </div>
  <url-dialog :visible="urlDialogVisible" @update:visible="urlDialogVisible = $event;"/>
</template>

<style scoped>

</style>