<template>
    <div id="command-search-box">
        <IconSearch />
        <input id="command-search-box-search-term" type="text" placeholder="Search for a command" autocomplete="off"
            v-model="searchTerm" />
        <!-- <select id="command-search-box-search-type" class="hover-hand" name="command-type" title="command-type"
            v-model="searchType">
            <option v-for="commandType in commandTypes" :key="commandType" :value="commandType">{{
                commandType }}</option>
        </select> -->
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSearchStore } from '@/stores/searchStore';
// import { useDataStore } from '@/stores/dataStore';
import IconSearch from '@/components/partials/IconSearch.vue';

import type { Ref } from 'vue';

const searchTerm: Ref<string> = ref(useSearchStore().searchTerm);
const searchType: Ref<string> = ref(useSearchStore().searchType);
// const commandTypes: Ref<{ id: any, name: any }[]> = ref(useDataStore().allCommandTypes);

watch(searchTerm, (newSearchTerm: string): void => {
    /**
     * Update the search term in the store when it changes
     */
    useSearchStore().setSearchTerm(newSearchTerm);
});

watch(searchType, (newSearchType: string): void => {
    /**
     * Update the search type in the store when it changes
     */
    useSearchStore().setSearchType(newSearchType);
});
</script>

<style scoped>
#command-search-box {
    position: relative;
    display: flex;
    z-index: 999;
    padding: 10px 25px;
    border-radius: 30px;
    justify-content: space-between;
    background: var(--color-background);
    border: 1px solid var(--color-background-mute);
    transition: all 0.5s, width 0s;
}

#command-search-box-search-term {
    font-family: 'Inconsolata', 'Consolas', 'Courier New', monospace;
    font-size: 20px;
    line-height: 2.25rem;
    color: var(--color-heading);
    background: none;
    border: none;
    width: 100%;
}

#command-search-box-search-type {
    font-family: 'Inconsolata', 'Consolas', 'Courier New', monospace;
    font-size: 14px;
    line-height: 2.25rem;
    color: var(--color-text);
    text-align: right;
    background: none;
    border: none;
    outline: none;
    appearance: none;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    background: transparent !important;
    background-image: url("data:image/svg+xml;utf8,<svg height='6' fill='grey' viewBox='0 0 24 24' width='8' xmlns='http://www.w3.org/2000/svg'><path d='M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z'/></svg>") !important;
    background-repeat: no-repeat !important;
    background-position-x: 100% !important;
    background-position-y: 16px !important;
    padding-right: 0.8rem !important;
}

#command-search-box-search-type>option {
    background-color: var(--color-background-soft);
}

@media (max-width: 425px) {
    #command-search-box-search-term {
        font-size: 16px;
    }

    #command-search-box-search-type {
        font-size: 12px;
    }
}
</style>