<script setup lang="ts">
import { ref } from 'vue';
import ImageUploader from 'components/ImageUploader.vue';

const splitterModel = ref(20);
</script>

<template>
  <q-layout view="lHh Lpr fff">
    <!-- Flex container for proper horizontal alignment -->
    <div class="row">
      <!-- Container for buttons with a specified width -->
      <div class="column none q-pt-md">
        <q-btn round flat stack no-caps size="26px">
          <q-icon size="22px" name="file_upload" />
          <div class="side-btn-label">Uploads</div>
        </q-btn>

        <q-btn round flat stack no-caps size="26px">
          <q-icon size="22px" name="tune" />
          <div class="side-btn-label">Adjust</div>
        </q-btn>
      </div>

      <!-- QSplitter occupying the remaining horizontal space -->
      <q-splitter v-model="splitterModel" class="col-grow" style="height: 100vh;">
        <!-- Section before the splitter -->
        <template v-slot:before>
          <q-scroll-area class="scroll-area">
            <div class="splitter-section">
              <image-uploader/>
            </div>
          </q-scroll-area>
        </template>

        <!-- Section after the splitter -->
        <template v-slot:after>
          <q-scroll-area class="scroll-area">
            <div class="splitter-section">
              <div v-for="n in 5" :key="n">
                {{ n }}. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              </div>
            </div>
          </q-scroll-area>
        </template>
      </q-splitter>
    </div>
  </q-layout>
</template>

<style scoped>
.side-btn-label {
  font-size: 12px;
  line-height: 24px;
  letter-spacing: .01785714em;
  font-weight: 500;
}

.splitter-section {
  height: 100%;
  width: 100%;
  padding: 20px;
  overflow: auto;  /* Ensures content is scrollable if overflow */
}

.scroll-area {
  height: 100%; /* Ensure the QScrollArea takes full height of its container */
}
</style>

