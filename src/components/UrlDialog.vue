<script setup lang="ts">
import { ref } from 'vue';
import { useImageLibraryStore } from 'stores/imageLibraryStore';
import { useQuasar } from 'quasar';

const $q = useQuasar();

interface Props {
  visible: boolean;
}

withDefaults(defineProps<Props>(), {
  visible: false,
});

const emit = defineEmits(['update:visible']); // TODO USE V-MODEL TO SIMPLIFY THIS

const imageLibraryStore = useImageLibraryStore();
const { addImageFromUrl } = imageLibraryStore;

const imageUrl = ref<string>('');

function closeUrlDialog() {
  imageUrl.value = '';
  emit('update:visible', false);
}

function onDownloadStarted(url: string) {
  console.log(`Download started: ${url}`);
}

function onDownloadEnded(url: string) {
  console.log(`Download ended: ${url}`);
}

function addImage() {
  const url = imageUrl.value;
  onDownloadStarted(url);
  addImageFromUrl(url)
    .then(() => onDownloadEnded(url))
    .catch((e: Error) => $q.notify({
      type: 'negative',
      message: e.message,
      position: 'bottom',
      closeBtn: true,
    }));
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