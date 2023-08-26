<template>
  <main>
    <CommandSearch />
  </main>
</template>

<script setup lang="ts">
import CommandSearch from '@/components/CommandSearch.vue';
import { useHead } from '@unhead/vue';

useHead({
  title: `> cmdpedia`
});
</script>