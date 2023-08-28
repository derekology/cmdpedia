<template>
    <div id="command-search" ref="target">
        <CommandSearchBox v-on:click="showSearchResults = true" />
        <CommandSearchDisplayResults :searchResults=searchResults v-if="showSearchResults"
            v-on:click="showSearchResults = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSearchStore } from '@/stores/searchStore';
import { onClickOutside } from '@vueuse/core';
import CommandSearchBox from '@/components/modules/CommandSearchBox.vue';
import CommandSearchDisplayResults from '@/components/modules/CommandSearchDisplayResults.vue';

import type { Ref, ComputedRef } from 'vue';
import type { ISingleCommandSummary } from '@/interfaces/ISingleCommand';

const showSearchResults: Ref<boolean> = ref(false);
const searchResults: ComputedRef<ISingleCommandSummary[]> = computed((): ISingleCommandSummary[] => useSearchStore().searchResults);
const target: Ref<null> = ref(null);

onClickOutside(target, (): void => { showSearchResults.value = false; });
</script>

<style scoped>
#command-search {
    position: relative;
}
</style>