<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { MoveEvent } from 'sortablejs';

const imageList = ref([
  { src: 'acrobat.png' },
  { src: 'adidas.png' },
  { src: 'adobe.png' },
  { src: 'burger-king.png' },
]);

function onEnd(event: MoveEvent) {
  console.log('Final list:', imageList.value, event);
}


function handleDrop(event: DragEvent) {
  event.preventDefault();

  if (event.dataTransfer) {
    const files = event.dataTransfer.files;
    if (!files.length) {
      return;
    }

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            imageList.value.push({ src: e.target.result.toString() });
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
}
</script>

<template>
  <div @drop.prevent="handleDrop" @dragover.prevent @dragenter.prevent>
    <draggable v-model="imageList" @end="onEnd">
      <template #item="{element, index}">
        <div :key="index" class="thumbnail">
          <img :src="element.src" alt="Thumbnail" style="width: 100px; height: auto;">
        </div>
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.thumbnail {
  cursor: grab;
  margin: 5px;
  transition: opacity 0.3s ease;
}
.thumbnail:active {
  cursor: grabbing;
  opacity: 0.5;
}
</style>