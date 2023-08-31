import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabaseClient } from '@/constants/supabaseConfig.js';

import type { Ref } from 'vue';
import type { ISingleCommandSummary } from '@/interfaces/ISingleCommand';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

export const useSearchStore = defineStore(
  'searchStore', () => {
    const allCommands: Ref<ISingleCommandSummary[]> = ref([]);
    const searchTerm: Ref<string> = ref('');
    const searchType: Ref<number> = ref(0);
    const searchResults: Ref<ISingleCommandSummary[]> = ref([]);
    const selectedId: (Ref<number> | Ref<null>) = ref(null);

    function setSearchTerm(newSearchTerm: string): void {
      /**
       * Set search term value to new search term
       * 
       * @param {string} newSearchTerm - New search term
       */
      searchTerm.value = newSearchTerm;
      searchResults.value = getSearchResults();
    };

    function setSearchType(newSearchType: number): void {
      /**
       * Set search type value to new search type
       * 
       * @param {number} newSearchType - New search type
       */
      searchType.value = newSearchType;
      searchResults.value = getSearchResults();
    };

    async function setSelectedId(newSelectedId: number | null): Promise<void> {
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

    async function getAllCommands(): Promise<void> {
      /**
       * Get all commands from database
       */
      const { data }: PostgrestSingleResponse<ISingleCommandSummary[]> = await supabaseClient.from('commandNames').select(`
        id,
        name,
        description,
        commandTypes (
          id,
          name
        )
      `)
        .order('name', { ascending: true }) as PostgrestSingleResponse<ISingleCommandSummary[]>
      data ? allCommands.value = data : allCommands.value = [];
      searchResults.value = getSearchResults();
    };

    function getSearchResults(): ISingleCommandSummary[] {
      /**
       * Get search results based on search term and search type
       * 
       * @returns {ISingleCommandSummary[]} - Search results
       */
      const newSearchResults: ISingleCommandSummary[] = allCommands.value.filter((command: ISingleCommandSummary): boolean => {
        if (searchType.value === 0) {
          return command.name.toLowerCase().includes(searchTerm.value.toLowerCase()) || command.description.toLowerCase().includes(searchTerm.value.toLowerCase());
        } else {
          return command.commandTypes.id === searchType.value && (command.name.toLowerCase().includes(searchTerm.value.toLowerCase()) || command.description.toLowerCase().includes(searchTerm.value.toLowerCase()));
        };
      });

      return newSearchResults;
    };

    getAllCommands();

    return { allCommands, searchTerm, searchType, searchResults, selectedId, setSearchTerm, setSearchType, setSelectedId, getSelectedId };
  })