<script setup lang="ts">
import draggable from 'vuedraggable';
import { useImageLibraryStore } from 'stores/imageLibraryStore';
import { storeToRefs } from 'pinia';
import ImageLibraryToolbar from 'components/ImageLibraryToolbar.vue';
import { onImageItems } from 'src/app/converter';

const imageLibraryStore = useImageLibraryStore();
const { imageList } = storeToRefs(imageLibraryStore);
const { removeImage } = imageLibraryStore;

</script>

<template>
  <div class="full-height-scroll-area column">
    <image-library-toolbar/>
    <div v-if="imageList.length === 0" class="col empty-box">
      Drag images here.
    </div>
    <q-scroll-area v-else class="col">
      <draggable v-if="imageList.length !== 0" v-model="imageList" @end="onImageItems(imageList)"
          item-key="id" class="center-horizontally">
        <template #item="{ element }">
          <div class="thumbnail">
            <img
              :src="element.blobUrl"
              alt="Thumbnail"
              style="width: 100px; height: auto;">
            <button @click="removeImage(element.id)" class="remove-btn">&times;</button>
          </div>
        </template>
      </draggable>
      <div v-if="imageList.length === 1" class="message-bottom">
        Drag another image here.
      </div>
      <div v-else class="message-bottom">
        Drag to reorder images or to add more images here.
      </div>
    </q-scroll-area>
  </div>
</template>

<style scoped>
.full-height-scroll-area {
  height: 100%;
  background: linear-gradient(to right, #15181B 0px, #15181B calc(100% - 8px), #0F1316 100%);
}

.empty-box {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed;
  background: linear-gradient(to right, #15181B 0px, #15181B calc(100% - 8px), #0F1316 100%);
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