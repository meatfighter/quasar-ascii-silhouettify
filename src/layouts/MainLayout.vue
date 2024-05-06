<script setup lang="ts">
// import { ref } from 'vue';
// import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
// import DownloadButton from 'components/DownloadButton.vue';
//
// defineOptions({
//   name: 'MainLayout'
// });
//
// const linksList: EssentialLinkProps[] = [
//   {
//     title: 'Docs',
//     caption: 'quasar.dev',
//     icon: 'school',
//     link: 'https://quasar.dev'
//   },
//   {
//     title: 'Github',
//     caption: 'github.com/quasarframework',
//     icon: 'code',
//     link: 'https://github.com/quasarframework'
//   },
//   {
//     title: 'Discord Chat Channel',
//     caption: 'chat.quasar.dev',
//     icon: 'chat',
//     link: 'https://chat.quasar.dev'
//   },
//   {
//     title: 'Forum',
//     caption: 'forum.quasar.dev',
//     icon: 'record_voice_over',
//     link: 'https://forum.quasar.dev'
//   },
//   {
//     title: 'Twitter',
//     caption: '@quasarframework',
//     icon: 'rss_feed',
//     link: 'https://twitter.quasar.dev'
//   },
//   {
//     title: 'Facebook',
//     caption: '@QuasarFramework',
//     icon: 'public',
//     link: 'https://facebook.quasar.dev'
//   },
//   {
//     title: 'Quasar Awesome',
//     caption: 'Community Quasar projects',
//     icon: 'favorite',
//     link: 'https://awesome.quasar.dev'
//   }
// ];
//
// const leftDrawerOpen = ref(false);
//
// function toggleLeftDrawer () {
//   leftDrawerOpen.value = !leftDrawerOpen.value;
// }

import { ref } from 'vue';

const drawerOpen = ref(true); // Keep drawer always open
const activeTab = ref('tab1'); // Initial active tab
</script>

<template>
<!--  <q-layout view="lHh Lpr lFf">-->

<!--    <q-header elevated>-->
<!--      <q-toolbar>-->
<!--        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />-->
<!--        <q-toolbar-title>Quasar App</q-toolbar-title>-->
<!--        <div><DownloadButton content="Hello, World!" filename="out.txt" mime-type="text/plain;charset=utf-8" :enabled="true"></DownloadButton></div>-->
<!--      </q-toolbar>-->
<!--    </q-header>-->

<!--    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>-->
<!--      <q-list>-->
<!--        <q-item-label header>Essential Links</q-item-label>-->
<!--        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" title=""/>-->
<!--      </q-list>-->
<!--    </q-drawer>-->

<!--    <q-page-container>-->
<!--      <router-view />-->
<!--    </q-page-container>-->

<!--  </q-layout>-->

  <q-layout>
    <q-drawer
        v-model="drawerOpen"
        side="left"
        :width="300"
        :breakpoint="500"
        bordered
        persistent
    >
      <!-- Tabs setup with vertical alignment -->
      <q-tabs
          vertical
          align="left"
          v-model="activeTab"
          class="full-height"
          style="width: 80px; border-right: 1px solid #ddd;"
      >
        <q-tab name="tab1" label="Tab 1" />
        <q-tab name="tab2" label="Tab 2" />
        <q-tab name="tab3" label="Tab 3" />
      </q-tabs>

      <!-- Tab panels to show content next to tabs in the same drawer -->
      <q-separator />
      <q-tab-panels v-model="activeTab" class="full-width">
        <q-tab-panel name="tab1">
          Content for Tab 1
        </q-tab-panel>
        <q-tab-panel name="tab2">
          Content for Tab 2
        </q-tab-panel>
        <q-tab-panel name="tab3">
          Content for Tab 3
        </q-tab-panel>
      </q-tab-panels>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-md">
        Main content area
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
  .full-height {
    height: 100%;
  }
  .full-width {
    width: calc(100% - 80px);
  }
</style>

