<template>
  <main>
    <div id="search">
      <CommandSearch />
    </div>
  </main>
</template>

<script setup lang="ts">
import CommandSearch from '@/components/CommandSearch.vue';
import { useHead } from '@unhead/vue';

useHead({
  title: `> cmdpedia`
});
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#search {
  width: 800px;
}
</style>