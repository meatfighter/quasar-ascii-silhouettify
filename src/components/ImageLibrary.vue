<script setup lang="ts">
import draggable from 'vuedraggable';
import { MoveEvent } from 'sortablejs';
import { useImageLibraryStore } from 'stores/imageLibraryStore';
import { storeToRefs } from 'pinia';

const imageLibraryStore = useImageLibraryStore();
const { imageList } = storeToRefs(imageLibraryStore);
const { removeImage } = imageLibraryStore;

function onEnd(event: MoveEvent) {
  console.log('Final list:', imageList.value, event);
}
</script>

<template>
    <q-scroll-area class="full-height-scroll-area">
      <draggable v-model="imageList" @end="onEnd">
        <template #item="{element, index}">
          <div :key="index" class="thumbnail">
            <img :src="element.src" alt="Thumbnail" style="width: 100px; height: auto;">
            <button @click="removeImage(index)" class="remove-btn">&times;</button>
          </div>
        </template>
      </draggable>
      <div v-if="imageList.length === 0" class="empty-box">
        Drag images here.
      </div>
      <div v-else-if="imageList.length === 1">
        Drag another image here.
      </div>
      <div v-else>
        Drag to reorder images or to add more images here.
      </div>
    </q-scroll-area>
</template>

<style scoped>
.full-height-scroll-area {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-box {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed;
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