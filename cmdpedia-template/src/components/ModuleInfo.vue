<template>
    <div id="module-info">
        <div id="main-info">
            <div id="module-name">
                {{ programName.split(' ')[1] }}
            </div>
            <div id="module-description">
                {{ programDocstring ? programDocstring : 'No description available' }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';

import type { ComputedRef } from 'vue';

const programName: ComputedRef<string> = computed((): string => useDataStore().programName);
const programDocstring: ComputedRef<string> = computed((): string => useDataStore().programDocstring);
</script>

<style scoped>
#main-info {
    margin: 0 0.5em;
    color: var(--color-hover);
}

#module-name {
    font-size: 2.5em;
    font-weight: bold;
    transition: all 0.5s;
}

#module-description {
    white-space: break-spaces;
    padding-top: 2em;
    line-height: 1.5em;
    transition: all 0.5s;
}
</style>