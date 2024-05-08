<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { MoveEvent } from 'sortablejs';

interface ImageItem {
  src: string;
}

const imageList = ref<ImageItem[]>([]);

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

function removeImage(index: number) {
  imageList.value.splice(index, 1);
}
</script>

<template>
  <q-scroll-area class="full-height-scroll-area">
      <div
          @drop.prevent="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          class="full-height row justify-center items-center"
      >
        <draggable v-model="imageList" @end="onEnd">
          <template #item="{element, index}">
            <div :key="index" class="thumbnail">
              <img :src="element.src" alt="Thumbnail" style="width: 100px; height: auto;">
              <button @click="removeImage(index)" class="remove-btn">&times;</button>
            </div>
          </template>
        </draggable>
        <div v-if="imageList.length === 0" class="test">
          Drag images here.
        </div>
        <div v-else-if="imageList.length === 1">
          Drag another image here.
        </div>
        <div v-else>
          Drag to reorder images or to add more images here.
        </div>
      </div>
  </q-scroll-area>
</template>

<style scoped>
.full-height-scroll-area {
  background: #EE0000;
  height: 100%;
  display: flex;
  justify-content: center;  /* Horizontal centering inside the component */
  align-items: center;  /* Vertical centering inside the component */
}

.test {
  width: 200px;  /* Or any specific size */
  height: 100px;  /* Or any specific size */
  background: #00EE00;  /* Just for visibility */
  display: flex;
  justify-content: center;  /* Horizontal centering inside the component */
  align-items: center;  /* Vertical centering inside the component */
}

.thumbnail {
  width: 100%;  /* Ensures responsive thumbnails */
  max-width: 100px;  /* Limits thumbnail size */
  height: auto;  /* Maintains aspect ratio */
  cursor: grab;
  /* Pushes each image slightly to the right */
  margin: 5px 5px 5px 10px;
  position: relative;  /* Necessary for absolute positioning of the remove button */
}

.remove-btn {
  position: absolute;
  top: 0;  /* Adjusts the button to be slightly out of the top boundary */
  right: -25px;  /* Adjusts the button to be slightly out of the right boundary */
  padding: 5px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  border-radius: 50%;  /* Makes the button rounded */
  width: 20px;  /* Sets a fixed width for the button */
  height: 20px;  /* Sets a fixed height for the button */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;  /* Adjusts font size for better visibility */
}

.remove-btn:hover {
  opacity: 1;  /* Increase opacity on hover for better user feedback */
}

.thumbnail:active {
  cursor: grabbing;
  opacity: 0.5;
}
</style>