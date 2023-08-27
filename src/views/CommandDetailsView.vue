<template>
    <main>
        <CommandSearch />
        <div id="details" v-if="commandSelected">
            <CommandDetails />
        </div>
    </main>
</template>
  
<script setup lang="ts">
import { computed } from 'vue';
import { useSearchStore } from '@/stores/searchStore';
import CommandSearch from '@/components/CommandSearch.vue';
import CommandDetails from '@/components/CommandDetails.vue';

import type { ComputedRef } from 'vue';

const commandSelected: ComputedRef<number | null> = computed((): number | null => useSearchStore().selectedId);

function getCommandIdFromUrl(): void {
    /**
     * Get the command id from the url and set it in the store
     */
    const url: string = window.location.pathname.replace("/", "");
    const urlParts: string[] = url.split('-');
    const id: number = parseInt(urlParts[0].split('-').pop() as string);
    useSearchStore().setSelectedId(id);
};

getCommandIdFromUrl();
</script>
  
<style scoped>
#details {
    margin-top: 2.25em;
}
</style>