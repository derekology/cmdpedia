<template>
  <header>
    <SiteHeader />
  </header>
  <RouterView />
</template>

<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue';
import { colourSchemeStore } from './stores/colourSchemeStore';

colourSchemeStore().determineInitialColourScheme();
</script>