<script setup lang="ts">

</script>

<template>
  <q-scroll-area class="full-height-scroll-area">
    <div v-for="n in 50" :key="n">
      <p>Hello, World!</p>
    </div>
  </q-scroll-area>
</template>

<style scoped>
.full-height-scroll-area {
  height: 100%;
  //background: #0C0C0C;
  background: #21BA45;
  overflow: hidden;
}
</style>