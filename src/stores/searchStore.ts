import { ref } from 'vue';
import { defineStore } from 'pinia';
import { supabaseClient } from '@/constants/supabaseConfig.js';

import type { Ref } from 'vue';
import type { ISingleCommand } from '@/interfaces/ISingleCommand';
import type { PostgrestResponse } from '@supabase/supabase-js';

export const useSearchStore = defineStore(
  'searchStore', () => {
    const allCommands = ref([]) as Ref<ISingleCommand[]>;
    const searchTerm = ref('') as Ref<string>;
    const searchType = ref(0) as Ref<number>;
    const searchResults = ref([]) as Ref<ISingleCommand[]>;
    const selectedId = ref(null) as (Ref<number> | Ref<null>);

    function setSearchTerm(newSearchTerm: string): void {
      searchTerm.value = newSearchTerm;
      searchResults.value = getSearchResults();
    };

    function setSearchType(newSearchType: number): void {
      searchType.value = newSearchType;
      searchResults.value = getSearchResults();
    };

    async function setSelectedId(newSelectedId: number | null): Promise<void> {
      selectedId.value = newSelectedId;
    };

    function getSelectedId(): number | null {
      return selectedId.value;
    };

    async function getAllCommands(): Promise<void> {
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
    }

    function getSearchResults(): ISingleCommand[] {
      const newSearchResults = allCommands.value.filter((command: ISingleCommand): boolean => {
        if (searchType.value === 0) {
          return command.name.toLowerCase().includes(searchTerm.value.toLowerCase()) || command.description.toLowerCase().includes(searchTerm.value.toLowerCase());
        } else {
          return command.commandTypes.id === searchType.value && (command.name.toLowerCase().includes(searchTerm.value.toLowerCase()) || command.description.toLowerCase().includes(searchTerm.value.toLowerCase()));
        };
      });

      return newSearchResults
    };

    getAllCommands();

    return { allCommands, searchTerm, searchType, searchResults, selectedId, setSearchTerm, setSearchType, setSelectedId, getSelectedId };
  })