<script setup lang="ts">
import draggable from 'vuedraggable';
import { MoveEvent } from 'sortablejs';
import { useImageLibraryStore } from 'stores/imageLibraryStore';
import { storeToRefs } from 'pinia';

const imageLibraryStore = useImageLibraryStore();
const { imageList } = storeToRefs(imageLibraryStore);
const { removeImage } = imageLibraryStore;

function onDragStart(event: MoveEvent) {
  console.log('drag start: ', imageList.value, event);
}

function onDragEnd(event: MoveEvent) {
  console.log('drag end:', imageList.value, event);
}
</script>

<template>
    <q-scroll-area class="full-height-scroll-area">
      <draggable v-if="imageList.length !== 0" v-model="imageList" @start="onDragStart" @end="onDragEnd"
          item-key="id" class="center-horizontally">
        <template #item="{ element, index }">
          <div class="thumbnail">
            <img :src="element.src" alt="Thumbnail" style="width: 100px; height: auto;">
            <button @click="removeImage(index)" class="remove-btn">&times;</button>
          </div>
        </template>
      </draggable>
      <div v-if="imageList.length === 0" class="empty-box">
        Drag images here.
      </div>
      <div v-else-if="imageList.length === 1" class="message-bottom">
        Drag another image here.
      </div>
      <div v-else class="message-bottom">
        Drag to reorder images or to add more images here.
      </div>
    </q-scroll-area>
</template>

<style scoped>
.full-height-scroll-area {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(to right, #15181B 0px, #15181B calc(100% - 8px), #0F1316 100%);
}

.empty-box {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed;
  position: relative;
  overflow: hidden;
}

.message-bottom {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.center-horizontally {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
}

.thumbnail {
  width: 100%;
  max-width: 100px;
  height: auto;
  cursor: grab;
  margin: 5px 5px 5px 10px;
  position: relative;
}

.thumbnail:active {
  cursor: grabbing;
  opacity: 0.5;
}

.remove-btn {
  position: absolute;
  top: 0;
  right: -25px;
  padding: 5px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.remove-btn:hover {
  opacity: 1;
}
</style>