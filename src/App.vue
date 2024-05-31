<script setup lang="ts">
defineOptions({
  name: 'App'
});
</script>

<template>
  <router-view />
</template>

<style>
* {
  font-variant-ligatures: none;
  font-feature-settings: 'liga' 0, 'clig' 0;
}

@font-face{
  font-family: cascadia code;
  font-style: normal;
  font-weight: 400;
  src: local('Cascadia Code'),url('src/assets/fonts/Cascadia.woff') format('woff');
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

input[type="number"] {
  appearance: textfield;
}

input[type="number"]:focus,
input[type="number"]:hover {
  appearance: auto;
}
</style>