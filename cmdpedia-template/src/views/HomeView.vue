<template>
  <main>
    <CommandSearch />
    <div id="details">
      <CommandDetails v-if="commandSelected !== -1" />
      <ModuleInfo v-else />
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSearchStore } from '@/stores/searchStore';
import CommandSearch from '@/components/CommandSearch.vue';
import CommandDetails from '@/components/CommandDetails.vue';
import ModuleInfo from '@/components/ModuleInfo.vue';
import { useHead } from '@unhead/vue';

import type { ComputedRef } from 'vue';

const commandSelected: ComputedRef<number> = computed((): number => useSearchStore().selectedId);

useHead({
  title: `> cmdpedia`
});
</script>

<style scoped>
#details {
  margin-top: 2.25em;
}
</style>