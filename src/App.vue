<template>
  <SiteHeader />
  <Transition>
    <SiteSidebar />
  </Transition>
  <RouterView />
</template>

<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue';
import SiteSidebar from '@/components/SiteSidebar.vue';
import { colourSchemeStore } from './stores/colourSchemeStore';

colourSchemeStore().determineInitialColourScheme();
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(350px);
}
</style>