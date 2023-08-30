<template>
  <SiteHeader />
  <SiteSidebar />
  <RouterView />
</template>

<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue';
import SiteSidebar from '@/components/SiteSidebar.vue';
import { colourSchemeStore } from './stores/colourSchemeStore';

colourSchemeStore().determineInitialColourScheme();
</script>