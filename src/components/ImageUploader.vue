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
  <div class="vue-container">
    <div
        @drop.prevent="handleDrop"
        @dragover.prevent
        @dragenter.prevent
        class="drop-area"
        :class="{ 'empty-drop-area': imageList.length === 0 }"
    >
      <draggable v-model="imageList" @end="onEnd">
        <template #item="{element, index}">
          <div :key="index" class="thumbnail">
            <img :src="element.src" alt="Thumbnail" style="width: 100px; height: auto;">
            <button @click="removeImage(index)" class="remove-btn">&times;</button>
          </div>
        </template>
      </draggable>
      <div v-if="imageList.length === 0" class="empty-message at-center">
        Drag images here.
      </div>
      <div v-else-if="imageList.length === 1" class="add-more-message at-bottom">
        Drag another image here.
      </div>
      <div v-else class="add-more-message at-bottom">
        Drag to reorder images or to add more images here.
      </div>
    </div>
  </div>
</template>

<style scoped>
.vue-container {
  height: 90vh; /* or any appropriate value */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;  /* Ensures that overflow is handled by the .drop-area */
}

.drop-area {
  flex: 1;  /* Allows the drop area to fill the container and handle its own overflow */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;  /* Aligns items to the start of the flex container */
  width: 100%;  /* Takes the full width of the container */
  max-height: 100%;  /* Ensures the drop area does not exceed the container height */
  overflow-y: auto;  /* Enables vertical scrolling */
  margin: 20px;  /* Adjust or remove based on your design */
  padding: 10px;  /* Adds padding inside the drop area */
  box-sizing: border-box;  /* Includes padding and border in the element's total width and height */
  border: none;
}

.empty-drop-area {
  border: 2px dashed #ccc;
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

.empty-message, .add-more-message {
  text-align: center;
  color: #aaa;
  font-size: 16px;
  width: 100%;
}

.at-center {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.at-bottom {
  margin-top: auto;
}
</style>