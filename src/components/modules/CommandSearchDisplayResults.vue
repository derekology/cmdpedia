<template>
    <div id="command-search-results">
        <span v-if="props.searchResults.length > 0">
            <router-link :to="{ path: `${result.id}-${result.name}-${result.commandTypes.name}-command-help` }"
                class="result hover-hand" v-for="result in props.searchResults" :key="result.id"
                v-on:click="getCommandDetails(result.id)">
                <span class="command-main">{{ result.name }} ({{ result.commandTypes.name }}) </span><span
                    class="command-details">{{
                        result.description.toLowerCase() }}</span>
            </router-link>
        </span>
        <span v-else>
            <div id="no-result">No results found.</div>
        </span>
    </div>
</template>

<script setup lang="ts">
import { useSearchStore } from '@/stores/searchStore';

import type { PropType } from 'vue';
import type { ISingleCommandSummary } from '@/interfaces/ISingleCommand';

const props = defineProps({
    searchResults: {
        type: Array as PropType<ISingleCommandSummary[]>,
        required: true,
    },
});

function getCommandDetails(id: number): void {
    /**
     * Get the details of the selected command
     * 
     * @param {number} id The ID of the selected command
     */
    useSearchStore().setSelectedId(id);
};
</script>

<style scoped>
#command-search-results {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin-top: 25px;
    padding: 40px 0px 0px 0px;
    border-radius: 0px 0px 25px 25px;
    background-color: var(--color-background);
    border: 1px solid var(--color-background-mute);
    filter: drop-shadow(0 0 0.5rem rgba(0, 0, 0, 0.1));
    max-height: 400px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

#command-search-results::-webkit-scrollbar {
    display: none;
}

.command-main {
    color: var(--color-heading);
}

.command-details {
    font-size: small;
    color: var(--color-text);
}

.result {
    display: block;
    line-height: 1em;
    padding: 20px 40px;
}

.result:hover {
    background: var(--color-background-mute);
}

.result:last-of-type:hover {
    border-radius: 0px 0px 25px 25px;
}

#no-result {
    text-align: center;
    font-style: italic;
    padding: 20px 10px;
    font-size: smaller;
}
</style>
