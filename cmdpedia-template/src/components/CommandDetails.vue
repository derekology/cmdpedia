<template>
    <div id="command-details">
        <div id="main-info">
            <div>
                <span id="command-name">
                    {{ selectedCommandName && selectedCommandName }}
                </span>
                <!-- <span id="command-type">
                    {{ selectedCommandType && ' (' + selectedCommandType + ')' }}
                </span> -->
            </div>
            <div id="command-description">
                {{ selectedCommandDescription && selectedCommandDescription.toLowerCase() }}
            </div>
        </div>
        <CommandDetailsSyntax :programName="programName" :entryFuncs="entryFuncs"
            :selectedCommandName="selectedCommandName" :selectedCommandGroup="selectedCommandGroup"
            :selectedCommandDescription="selectedCommandDescription"
            :selectedCommandSelectedOptions="selectedCommandSelectedOptions"
            :selectedCommandSelectedFlags="selectedCommandSelectedFlags"
            :selectedCommandSelectedArgs="selectedCommandSelectedArgs"
            @resetSelectedInputs="(): void => resetSelectedInputs()"
            @addValueToInput="(inputToEdit, newInputValue): void => { addValueToInput(inputToEdit, newInputValue) }" />
        <CommandDetailsInputs
            v-if="selectedCommandOptions.length || selectedCommandFlags.length || selectedCommandSelectedArgs.length"
            :selectedCommandOptions="selectedCommandOptions" :selectedCommandFlags="selectedCommandFlags"
            :selectedCommandArgs="selectedCommandArgs" :selectedCommandName="selectedCommandName"
            :selectedCommandSelectedOptions="selectedCommandSelectedOptions"
            :selectedCommandSelectedFlags="selectedCommandSelectedFlags"
            :selectedCommandSelectedArgs="selectedCommandSelectedArgs"
            @modifyInput="(inputToModify: IInputToModify): void => { addToOrRemoveFromSelectedList(inputToModify) }" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import { useSearchStore } from '@/stores/searchStore';
import { useDataStore } from '@/stores/dataStore';
import CommandDetailsInputs from '@/components/modules/CommandDetailsInputs.vue';
import CommandDetailsSyntax from '@/components/modules/CommandDetailsSyntax.vue';
import { useToast, TYPE } from "vue-toastification";

import type { Ref, ComputedRef } from 'vue';
import type { ISingleCommand, ISingleCommandOptions, ISingleCommandFlags, ISingleCommandArgs, IInputToModify } from '@/interfaces/ISingleCommand';

const programName: ComputedRef<string> = computed((): string => useDataStore().programName);
const entryFuncs: ComputedRef<string[]> = computed((): string[] => useDataStore().entryFuncs);
const selectedCommandId: ComputedRef<number | null> = computed((): number | null => useSearchStore().selectedId);
const selectedCommand: ComputedRef<ISingleCommand | null> = computed((): ISingleCommand | null => useDataStore().getCommandById(selectedCommandId.value || 0));
const selectedCommandName: Ref<string> = ref('');
const selectedCommandGroup: Ref<string> = ref('');
const selectedCommandType: Ref<string> = ref('');
const selectedCommandDescription: Ref<string> = ref('');
const selectedCommandOptions: Ref<ISingleCommandOptions[]> = ref([]);
const selectedCommandFlags: Ref<ISingleCommandFlags[]> = ref([]);
const selectedCommandArgs: Ref<ISingleCommandArgs[]> = ref([]);

const selectedCommandSelectedOptions: Ref<ISingleCommandOptions[]> = ref([]);
const selectedCommandSelectedFlags: Ref<ISingleCommandFlags[]> = ref([]);
const selectedCommandSelectedArgs: Ref<ISingleCommandArgs[]> = ref([]);

const customizedCommandInputs: Ref<(ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs)[]> = ref([]);

async function getSelectedCommandInfo(): Promise<void> {
    /**
     * Get the selected command's information
     */
    if (selectedCommand.value) {
        selectedCommandName.value = selectedCommand.value.name;
        selectedCommandGroup.value = selectedCommand.value.group;
        selectedCommandType.value = selectedCommand.value.type;
        selectedCommandDescription.value = selectedCommand.value.description;
        selectedCommandOptions.value = selectedCommand.value.CommandOptions;
        selectedCommandFlags.value = selectedCommand.value.CommandFlags;
        selectedCommandArgs.value = selectedCommand.value.CommandArgs;

        resetSelectedInputs();

        useHead({
            title: `${selectedCommandName.value} > cmdpedia`
        });
    };
};

function resetSelectedInputs(): void {
    /**
     * Clear the selected inputs and re-add required ones
     */
    selectedCommandSelectedArgs.value = [];
    selectedCommandSelectedFlags.value = [];
    selectedCommandSelectedOptions.value = [];

    for (const input of customizedCommandInputs.value) {
        removeValueFromInput(input);
    };

    addRequiredInputs();
};

function addRequiredInputs(): void {
    /**
     * Add all required inputs to the selected inputs
     */
    selectedCommandSelectedArgs.value = selectedCommandArgs.value.filter((arg: ISingleCommandArgs): boolean => arg.required);
    selectedCommandSelectedFlags.value = selectedCommandFlags.value.filter((flag: ISingleCommandFlags): boolean => flag.required);
    selectedCommandSelectedOptions.value = selectedCommandOptions.value.filter((option: ISingleCommandOptions): boolean => option.required);
};

function addToOrRemoveFromSelectedList(inputToModify: IInputToModify): void {
    /**
     * Add the selected item to the selected list if it's not already there, or remove it if it is
     * 
     * @param {IInputToModify} inputToModify - The event emitted from the CommandDetailsParts component
     */
    let selectedList: Ref<any[]>;
    const targetItem: ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs = inputToModify.item;

    if (targetItem.required) {
        useToast()('This input is required', { type: TYPE.ERROR });
        return;
    };

    switch (inputToModify.list) {
        case 'option':
            selectedList = selectedCommandSelectedOptions as Ref<ISingleCommandOptions[]>;
            break;
        case 'flag':
            selectedList = selectedCommandSelectedFlags as Ref<ISingleCommandFlags[]>;
            break;
        case 'arg':
            selectedList = selectedCommandSelectedArgs as Ref<ISingleCommandArgs[]>;
            break;
    };

    if (selectedList.value.includes(targetItem)) {
        selectedList.value = selectedList.value.filter((selectedItem: ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs): boolean => selectedItem !== targetItem);
    } else {
        selectedList.value.push(targetItem);
    };
};

function removeValueFromInput(inputToEdit: ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs) {
    /**
     * Remove value attribute from the input then remove it from the customized inputs array
     * 
     * @param {ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs | null} inputToEdit - The event emitted from the CommandDetailsParts component
     */
    delete inputToEdit.value;
    customizedCommandInputs.value = customizedCommandInputs.value.filter((input: ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs): boolean => input !== inputToEdit) as (ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs)[];
};

function addValueToInput(inputToEdit: Ref<ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs | null>, newInputValue: string): void {
    /**
     * Add value attribute to the input then add it from the customized inputs array
     * 
     * @param {ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs | null} inputToEdit - The event emitted from the CommandDetailsParts component
     * @param {string} newInputValue - The value to add to the input
     */
    const targetItem: ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs = inputToEdit?.value as ISingleCommandOptions | ISingleCommandFlags | ISingleCommandArgs;

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
    white-space: break-spaces;
    line-height: 1.5em;
    transition: all 0.5s;
}
</style>