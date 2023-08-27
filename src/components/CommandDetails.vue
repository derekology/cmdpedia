<template>
    <div id="command-details">
        <div id="main-info">
            <div id="first-row">
                <span id="command-name">
                    {{ selectedCommandName ? selectedCommandName : '' }}
                </span>
                <span id="command-type">
                    {{ selectedCommandType ? ' (' + selectedCommandType + ')' : '' }}
                </span>
            </div>
            <div id="command-description">
                {{ selectedCommandDescription ? selectedCommandDescription : '' }}
            </div>
        </div>
        <CommandDetailsSyntax :selectedCommandName="selectedCommandName"
            :selectedCommandSelectedArgs="selectedCommandSelectedArgs"
            :selectedCommandSelectedOptions="selectedCommandSelectedOptions"
            :selectedCommandSelectedParams="selectedCommandSelectedParams" />
        <CommandDetailsInputs :selectedCommandArgs="selectedCommandArgs" :selectedCommandOptions="selectedCommandOptions"
            :selectedCommandParams="selectedCommandParams" :selectedCommandName="selectedCommandName"
            :selectedCommandSelectedArgs="selectedCommandSelectedArgs"
            :selectedCommandSelectedOptions="selectedCommandSelectedOptions"
            :selectedCommandSelectedParams="selectedCommandSelectedParams"
            @modifyInput="(inputToModify: IInputToModify) => { addToOrRemoveFromSelectedList(inputToModify) }" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import { useSearchStore } from '@/stores/searchStore';
import { supabaseClient } from '@/constants/supabaseConfig.js';
import CommandDetailsInputs from '@/components/modules/CommandDetailsInputs.vue';
import CommandDetailsSyntax from '@/components/modules/CommandDetailsSyntax.vue';

import type { Ref, ComputedRef } from 'vue';
import type { ISingleCommand, ISingleCommandArgs, ISingleCommandOptions, ISingleCommandParams, IInputToModify } from '@/interfaces/ISingleCommand';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

const selectedCommandId: ComputedRef<number | null> = computed(() => { return useSearchStore().selectedId; });
const selectedCommandName: Ref<string> = ref('');
const selectedCommandType: Ref<string> = ref('');
const selectedCommandDescription: Ref<string> = ref('');
const selectedCommandArgs: Ref<ISingleCommandArgs[]> = ref([]);
const selectedCommandOptions: Ref<ISingleCommandOptions[]> = ref([]);
const selectedCommandParams: Ref<ISingleCommandParams[]> = ref([]);

const selectedCommandSelectedArgs: Ref<ISingleCommandArgs[]> = ref([]);
const selectedCommandSelectedOptions: Ref<ISingleCommandOptions[]> = ref([]);
const selectedCommandSelectedParams: Ref<ISingleCommandParams[]> = ref([]);

async function getSelectedCommandInfo(): Promise<void> {
    /**
     * Get the selected command's information from the database
     */
    const { data }: PostgrestSingleResponse<ISingleCommand> = await supabaseClient.from('commandNames').select(`
        id, 
        name,
        description,
        commandTypes (
            id,
            name
        ),
        commandArgs (
            id,
            flag,
            placeholder,
            description
        ),
        commandOptions (
            id,
            flag,
            description
        ),
        commandParams (
            id,
            placeholder,
            description
        )
    `).filter(
        'id',
        'eq',
        selectedCommandId.value
    ).single();

    if (data) {
        selectedCommandName.value = data.name;
        selectedCommandType.value = data.commandTypes.name;
        selectedCommandDescription.value = data.description;
        selectedCommandArgs.value = data.commandArgs;
        selectedCommandOptions.value = data.commandOptions;
        selectedCommandParams.value = data.commandParams;

        selectedCommandSelectedParams.value = [];
        selectedCommandSelectedOptions.value = [];
        selectedCommandSelectedArgs.value = [];

        useHead({
            title: `${selectedCommandName.value} ${selectedCommandType.value} command help > cmdpedia`
        });
    };
};

function addToOrRemoveFromSelectedList(inputToModify: IInputToModify): void {
    /**
     * Add the selected item to the selected list if it's not already there, or remove it if it is
     * 
     * @param {IInputToModify} inputToModify - The event emitted from the CommandDetailsParts component
     */
    let selectedList: Ref<any[]>;
    const targetItem: ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams = inputToModify.item;

    switch (inputToModify.list) {
        case 'arg':
            selectedList = selectedCommandSelectedArgs as Ref<ISingleCommandArgs[]>;
            break;
        case 'option':
            selectedList = selectedCommandSelectedOptions as Ref<ISingleCommandOptions[]>;
            break;
        case 'param':
            selectedList = selectedCommandSelectedParams as Ref<ISingleCommandParams[]>;
            break;
    }

    if (selectedList.value.includes(targetItem)) {
        selectedList.value = selectedList.value.filter((selectedItem: ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams) => selectedItem !== targetItem);
    } else {
        selectedList.value.push(targetItem);
    }
};


watch(selectedCommandId, () => {
    getSelectedCommandInfo();
});

onMounted(() => {
    getSelectedCommandInfo();
});
</script>

<style scoped>
#command-details {
    color: var(--color-heading);
    display: flex;
    flex-direction: column;
    align-items: start;
}

#main-info {
    margin: 0 0.5em;
}

#command-type {
    transition: all 0.5s;
}

#command-name {
    font-size: 2.5em;
    font-weight: bold;
    transition: all 0.5s;
}

#command-description {
    line-height: 1em;
    transition: all 0.5s;
}
</style>