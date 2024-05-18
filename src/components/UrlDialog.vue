<script setup lang="ts">
import { ref } from 'vue';
import { useImageLibraryStore } from 'stores/imageLibraryStore';

interface Props {
  visible: boolean;
}

withDefaults(defineProps<Props>(), {
  visible: false,
});

const emit = defineEmits(['update:visible']);

const imageLibraryStore = useImageLibraryStore();
const { addImageFromUrl } = imageLibraryStore;

const imageUrl = ref<string>('');

function emitUpdateVisible(newVal: boolean) {
  emit('update:visible', newVal);
}

function closeUrlDialog() {
  imageUrl.value = '';
  emitUpdateVisible(false);
}

function addImage() {
  addImageFromUrl(imageUrl.value);
  closeUrlDialog();
}
</script>

<template>
  <q-dialog :model-value="visible">
    <q-card>
      <q-card-section>
        <div class="text-h6">Enter Image URL</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="imageUrl" label="URL" filled />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="closeUrlDialog" />
        <q-btn flat label="Add Image" @click="addImage" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>