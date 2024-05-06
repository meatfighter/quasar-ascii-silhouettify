<script setup lang="ts">
import { defineProps, withDefaults } from 'vue';

interface DownloadButtonProps {
  content: string;
  filename: string;
  mimeType: string;
  enabled: boolean;
}

const props = withDefaults(defineProps<DownloadButtonProps>(), {
  content: '',
  filename: 'download.txt',
  mimeType: 'text/plain;charset=utf-8',
  enabled: false
});

function downloadReport() {
  if (!props.enabled) {
    return;
  }

  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([ props.content ], { type: props.mimeType }));
  link.download = props.filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
</script>

<template>
  <q-btn
      @click="downloadReport"
      :disabled="!enabled"
      color="primary"
      unelevated
      icon="file_download"
      label="Download"
  />
</template>
