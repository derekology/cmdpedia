import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabaseClient } from '@/constants/supabaseConfig.js';

import type { Ref } from 'vue';
import type { ISingleCommand } from '@/interfaces/ISingleCommand';
import type { PostgrestResponse } from '@supabase/supabase-js';

export const useSearchStore = defineStore(
  'searchStore', () => {
    const allCommands: Ref<ISingleCommand[]> = ref([]);
    const searchTerm: Ref<string> = ref('');
    const searchType: Ref<number> = ref(0);
    const searchResults: Ref<ISingleCommand[]> = ref([]);
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
      const { data }: PostgrestResponse<ISingleCommand> = await supabaseClient.from('commandNames').select(`
        id,
        name,
        description,
        commandTypes (
          id,
          name
        )
      `)

      data ? allCommands.value = data : allCommands.value = [];
      searchResults.value = getSearchResults();
    };

    function getSearchResults(): ISingleCommand[] {
      /**
       * Get search results based on search term and search type
       * 
       * @returns {ISingleCommand[]} - Search results
       */
      const newSearchResults = allCommands.value.filter((command: ISingleCommand): boolean => {
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