<template>
    <div id="command-details">
        <div id="main-info">
            <div>
                <span id="command-name">
                    {{ selectedCommandName && selectedCommandName }}
                </span>
                <span id="command-type">
                    {{ selectedCommandType && ' (' + selectedCommandType + ')' }}
                </span>
            </div>
            <div id="command-description">
                {{ selectedCommandDescription && selectedCommandDescription.toLowerCase() }}
            </div>
        </div>
        <CommandDetailsSyntax :selectedCommandName="selectedCommandName"
            :selectedCommandDescription="selectedCommandDescription"
            :selectedCommandSelectedArgs="selectedCommandSelectedArgs"
            :selectedCommandSelectedOptions="selectedCommandSelectedOptions"
            :selectedCommandSelectedParams="selectedCommandSelectedParams"
            @resetSelectedInputs="(): void => resetSelectedInputs()"
            @addValueToInput="(inputToEdit, newInputValue): void => { addValueToInput(inputToEdit, newInputValue) }" />
        <CommandDetailsInputs
            v-if="selectedCommandArgs.length || selectedCommandOptions.length || selectedCommandSelectedParams.length"
            :selectedCommandArgs="selectedCommandArgs" :selectedCommandOptions="selectedCommandOptions"
            :selectedCommandParams="selectedCommandParams" :selectedCommandName="selectedCommandName"
            :selectedCommandSelectedArgs="selectedCommandSelectedArgs"
            :selectedCommandSelectedOptions="selectedCommandSelectedOptions"
            :selectedCommandSelectedParams="selectedCommandSelectedParams"
            @modifyInput="(inputToModify: IInputToModify): void => { addToOrRemoveFromSelectedList(inputToModify) }" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import { useSearchStore } from '@/stores/searchStore';
import { supabaseClient } from '@/constants/supabaseConfig.js';
import CommandDetailsInputs from '@/components/modules/CommandDetailsInputs.vue';
import CommandDetailsSyntax from '@/components/modules/CommandDetailsSyntax.vue';
import { useToast, TYPE } from "vue-toastification";
import { PSCOMMONARGS, PSCOMMONOPTIONS } from '@/constants/PSCommonParams';

import type { Ref, ComputedRef } from 'vue';
import type { ISingleCommand, ISingleCommandArgs, ISingleCommandOptions, ISingleCommandParams, IInputToModify } from '@/interfaces/ISingleCommand';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

const selectedCommandId: ComputedRef<number | null> = computed((): null => useSearchStore().selectedId);
const selectedCommandName: Ref<string> = ref('');
const selectedCommandType: Ref<string> = ref('');
const selectedCommandDescription: Ref<string> = ref('');
const selectedCommandArgs: Ref<ISingleCommandArgs[]> = ref([]);
const selectedCommandOptions: Ref<ISingleCommandOptions[]> = ref([]);
const selectedCommandParams: Ref<ISingleCommandParams[]> = ref([]);

const selectedCommandSelectedArgs: Ref<ISingleCommandArgs[]> = ref([]);
const selectedCommandSelectedOptions: Ref<ISingleCommandOptions[]> = ref([]);
const selectedCommandSelectedParams: Ref<ISingleCommandParams[]> = ref([]);

const customizedCommandInputs: Ref<(ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams)[]> = ref([]);

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
            separator,
            placeholder,
            description,
            required
        ),
        commandOptions (
            id,
            flag,
            description,
            required
        ),
        commandParams (
            id,
            placeholder,
            description,
            required
        )
    `).filter(
        'id',
        'eq',
        selectedCommandId.value
    )
        .order('id')
        .order('id', { foreignTable: 'commandTypes', ascending: true })
        .order('order', { foreignTable: 'commandArgs', ascending: true })
        .order('order', { foreignTable: 'commandOptions', ascending: true })
        .order('order', { foreignTable: 'commandParams', ascending: true })
        .single();

    if (data) {
        selectedCommandName.value = data.name;
        selectedCommandType.value = data.commandTypes.name;
        selectedCommandDescription.value = data.description;
        selectedCommandArgs.value = data.commandArgs;
        selectedCommandOptions.value = data.commandOptions;
        selectedCommandParams.value = data.commandParams;

        selectedCommandType.value === 'powershell' && addPSCommonInputs();

        resetSelectedInputs();

        useHead({
            title: `${selectedCommandName.value} ${selectedCommandType.value} command help > cmdpedia`
        });
    };
};

function addPSCommonInputs(): void {
    /**
     * Add the common PowerShell inputs to the selected command
     */
    for (const arg of PSCOMMONARGS) {
        selectedCommandArgs.value.push(arg);
    };

    for (const option of PSCOMMONOPTIONS) {
        selectedCommandOptions.value.push(option);
    };
};

function resetSelectedInputs(): void {
    /**
     * Clear the selected inputs and re-add required ones
     */
    selectedCommandSelectedParams.value = [];
    selectedCommandSelectedOptions.value = [];
    selectedCommandSelectedArgs.value = [];

    for (const input of customizedCommandInputs.value) {
        removeValueFromInput(input);
    };

    addRequiredInputs();
};

function addRequiredInputs(): void {
    /**
     * Add all required inputs to the selected inputs
     */
    selectedCommandSelectedParams.value = selectedCommandParams.value.filter((param: ISingleCommandParams): boolean => param.required);
    selectedCommandSelectedOptions.value = selectedCommandOptions.value.filter((option: ISingleCommandOptions): boolean => option.required);
    selectedCommandSelectedArgs.value = selectedCommandArgs.value.filter((arg: ISingleCommandArgs): boolean => arg.required);
};

function addToOrRemoveFromSelectedList(inputToModify: IInputToModify): void {
    /**
     * Add the selected item to the selected list if it's not already there, or remove it if it is
     * 
     * @param {IInputToModify} inputToModify - The event emitted from the CommandDetailsParts component
     */
    let selectedList: Ref<any[]>;
    const targetItem: ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams = inputToModify.item;

    if (targetItem.required) {
        useToast()('This input is required', { type: TYPE.ERROR });
        return;
    };

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
    };

    if (selectedList.value.includes(targetItem)) {
        selectedList.value = selectedList.value.filter((selectedItem: ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams): boolean => selectedItem !== targetItem);
    } else {
        selectedList.value.push(targetItem);
    };
};

function removeValueFromInput(inputToEdit: ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams) {
    /**
     * Remove value attribute from the input then remove it from the customized inputs array
     * 
     * @param {ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams | null} inputToEdit - The event emitted from the CommandDetailsParts component
     */
    delete inputToEdit.value;
    customizedCommandInputs.value = customizedCommandInputs.value.filter((input: ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams): boolean => input !== inputToEdit) as (ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams)[];
};

function addValueToInput(inputToEdit: Ref<ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams | null>, newInputValue: string): void {
    /**
     * Add value attribute to the input then add it from the customized inputs array
     * 
     * @param {ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams | null} inputToEdit - The event emitted from the CommandDetailsParts component
     * @param {string} newInputValue - The value to add to the input
     */
    const targetItem: ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams = inputToEdit?.value as ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams;

    if (!newInputValue) {
        removeValueFromInput(targetItem);
        return;
    };

    targetItem.value = newInputValue;
    customizedCommandInputs.value.push(targetItem);
};

watch(selectedCommandId, (): void => {
    /**
     * Get the selected command's information from the database when the selected command changes
     */
    getSelectedCommandInfo();
});

onMounted((): void => {
    /**
     * Get the selected command's information from the database when the component is mounted
     */
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

#command-name {
    font-size: 2.5em;
    font-weight: bold;
    transition: all 0.5s;
}

#command-type {
    transition: all 0.5s;
}

#command-description {
    line-height: 1.5em;
    transition: all 0.5s;
}
</style>