<script setup lang="ts">
import { useImageLibraryStore } from 'stores/imageLibraryStore';
import { storeToRefs } from 'pinia';
import { useAsciiStore } from 'stores/asciiStore';
import { HTML_FORMAT, NEOFETCH_FORMAT, PALETTE_16, PALETTE_8, useOptionsStore } from 'stores/optionsStore';
import { toHtml, toNeofetch, toText } from 'src/app/formatter';

const imageLibraryStore = useImageLibraryStore();
const { loadingImages, imageList } = storeToRefs(imageLibraryStore);

const asciiStore = useAsciiStore();
const { processing, asciis } = storeToRefs(asciiStore);

const optionsStore = useOptionsStore();
const { format, palette, fontSize, lineHeight } = storeToRefs(optionsStore);

function extractName() {
    let name = 'ascii-silhouette';
    if (imageList.value.length > 0) {
      name = imageList.value[0].displayName;
      const index = name.lastIndexOf('.');
      if (index >= 0) {
        name = name.substring(0, index);
      }
    }
    return name;
}

function createFilename(name: string) {
  return `${name}.${(format.value === HTML_FORMAT) ? 'html' : 'txt'}`;
}

function createContent(name: string) {
  switch (format.value) {
    case HTML_FORMAT:
      return toHtml(asciis.value, name, fontSize.value, lineHeight.value);
    case NEOFETCH_FORMAT:
      return toNeofetch(asciis.value);
    default:
      return toText(asciis.value, palette.value === PALETTE_8 || palette.value === PALETTE_16);
  }
}

function createMimeType() {
  return `text/${(format.value === HTML_FORMAT) ? 'html' : 'plain'};charset=utf-8`;
}

function onDownload() {
  const name = extractName();
  const link = document.createElement('a');
  try {
    link.href = URL.createObjectURL(new Blob([ createContent(name) ], { type: createMimeType() }));
    link.download = createFilename(name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
  }
}
</script>

<template>
  <q-header>
    <q-toolbar class="text-white" style="background: #1F1F1F;">
      <q-img src="logo-white.svg" spinner-color="white" style="width: 32px; height: 32px;"/>
      <q-toolbar-title>ASCII Silhouettify</q-toolbar-title>
      <div>
        <q-btn icon="download" round color="primary" :disable="loadingImages || processing" @click="onDownload"/>
        <q-tooltip>Download ASCII Silhouette</q-tooltip>
      </div>
    </q-toolbar>
  </q-header>
</template>

<style scoped>

</style>