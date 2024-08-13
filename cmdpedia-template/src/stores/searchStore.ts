import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { useDataStore } from './dataStore';

import type { ComputedRef, Ref } from 'vue';
import type { ISingleCommandSummary } from '@/interfaces/ISingleCommand';

export const useSearchStore = defineStore(
  'searchStore', () => {
    const searchTerm: Ref<string> = ref('');
    const searchType: Ref<string> = ref('all');
    const searchResults: Ref<ISingleCommandSummary[]> = ref([]);
    const selectedId: (Ref<number>) = ref(-1);

    function updateSearchResults(): void {
      /**
       * Update search results based on search term and search type
       */
      searchResults.value = getSearchResults();
    };

    function setSearchTerm(newSearchTerm: string): void {
      /**
       * Set search term value to new search term and update results
       * 
       * @param {string} newSearchTerm - New search term
       */
      searchTerm.value = newSearchTerm;
      updateSearchResults();
    };

    function setSearchType(newSearchType: string): void {
      /**
       * Set search type value to new search type and update results
       * 
       * @param {string} newSearchType - New search type
       */
      searchType.value = newSearchType;
      updateSearchResults();
    };

    function setSelectedId(newSelectedId: number): void {
      /**
       * Set selected id value to new selected id
       * 
       * @param {number | null} newSelectedId - New selected id
      */
      selectedId.value = newSelectedId;
    };

    function getSelectedId(): number | null {
      /**
       * Get selected id value
       * 
       * @returns {number | null} - Selected id value
       */
      return selectedId.value;
    };

    function getSearchResults(): ISingleCommandSummary[] {
      /**
       * Get search results based on search term and search type
       * 
       * @returns {ISingleCommandSummary[]} - Search results
      */
      const allCommandSummaries: ComputedRef<ISingleCommandSummary[]> = computed((): ISingleCommandSummary[] => useDataStore().allCommandSummaries);

      const newSearchResults: ISingleCommandSummary[] = allCommandSummaries.value.filter((command: ISingleCommandSummary): boolean => {
        const fullCommand = `${command.type} ${command.name} ${command.description}`.toLowerCase();
        if (searchType.value === 'all') {
          return fullCommand.toLowerCase().includes(searchTerm.value.toLowerCase());
        } else {
          return command.type === searchType.value && (fullCommand.toLowerCase().includes(searchTerm.value.toLowerCase()));
        };
      });
      return newSearchResults;
    };

    updateSearchResults();

    return { searchTerm, searchType, searchResults, selectedId, setSearchTerm, setSearchType, setSelectedId, getSelectedId };
  })