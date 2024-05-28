<script setup lang="ts">
defineOptions({
  name: 'App'
});
</script>

<template>
  <router-view />
</template>

<style>
@font-face{
  font-family: cascadia code;
  font-style: normal;
  font-weight: 400;
  src: local('Cascadia Code'),url('./fonts/Cascadia.woff') format('woff');
}

a,a:visited {
  color: #58A6FF;
  text-decoration: none;
  white-space: nowrap;
}

a:hover,a:active {
  color: #58A6FF;
  text-decoration: underline;
  white-space: nowrap;
}
</style>