<template>
    <div id="command-meta">
        <span id="comment-meta-actions">
            <span id="command-meta-reset" title="Reset syntax" class="hover-hand" v-on:click="resetSelectedInputs()">
                <IconReset />
            </span>
            <span id="command-meta-copy" title="Copy syntax" class="hover-hand" v-on:click="copySyntaxToClipboard()">
                <IconCopy />
            </span>
        </span>
        <span id="command-syntax" ref="target">
            <span class="enable-select">
                {{ props.selectedCommandName + ' ' }}
            </span>
            <span class="enable-select" v-for="option in props.selectedCommandSelectedOptions" :key="option.flag"
                :title="option.description">
                {{ option.flag + ' ' }}
            </span>
            <span class="hover-hand" v-for="arg in props.selectedCommandSelectedArgs" :key="arg.flag"
                :title="arg.description" v-on:click="setEditFields(arg)">
                <span v-if="inputToEdit == arg">
                    {{ arg.flag }}=<input class="editField" type="text" ref="editField" v-model="newInputValue"
                        v-on:keyup.enter="addValueToInput()" :placeholder="arg.placeholder" />
                </span>
                <span class="enable-select" v-else>{{ arg.flag }}={{ arg.value ? arg.value + ' ' : '<' + arg.placeholder
                    + '> ' }}</span>
                </span>
                <span class="hover-hand" v-for="param in props.selectedCommandSelectedParams" :key="param.placeholder"
                    :title="param.description" v-on:click="setEditFields(param)">
                    <span v-if="inputToEdit == param">
                        <input class="editField" type="text" ref="editField" v-model="newInputValue"
                            v-on:keyup.enter="addValueToInput()" :placeholder="param.placeholder" />
                    </span>
                    <span class="enable-select" v-else>
                        {{ param.value ? param.value + ' ' : '<' + param.placeholder + '> ' }} </span>
                    </span>
                </span>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { onClickOutside } from '@vueuse/core';
import IconCopy from '@/components/partials/IconCopy.vue';
import IconReset from '@/components/partials/IconReset.vue';
import { useToast } from "vue-toastification";

import type { Ref, PropType } from 'vue';
import type { ISingleCommandArgs, ISingleCommandOptions, ISingleCommandParams } from '@/interfaces/ISingleCommand';

const emit = defineEmits(['resetSelectedInputs', 'addValueToInput'])

const props = defineProps({
    selectedCommandName: {
        type: String,
        required: true
    },
    selectedCommandSelectedArgs: {
        type: Array as PropType<ISingleCommandArgs[]>,
        required: true
    },
    selectedCommandSelectedOptions: {
        type: Array as PropType<ISingleCommandOptions[]>,
        required: true
    },
    selectedCommandSelectedParams: {
        type: Array as PropType<ISingleCommandParams[]>,
        required: true
    }
});

const inputToEdit: Ref<ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams | null> = ref(null);
const newInputValue: Ref<string> = ref('');
const target: Ref<null> = ref(null);
const editField: Ref<HTMLInputElement[] | null> = ref(null);

async function copySyntaxToClipboard(): Promise<void> {
    /**
     * Copy the command syntax to the user's clipboard
     */
    const children: HTMLCollection | undefined = document.querySelector('#command-syntax')?.children
    const contentToCopy: string | null = children ? Array.from(children, ({ textContent }): string | undefined => textContent?.trim()).join(' ') : null;

    if (contentToCopy === null) {
        useToast()('Unable to copy');
        return;
    };

    try {
        await navigator.clipboard.writeText(contentToCopy);
        useToast()('Syntax copied');
    } catch (err) {
        useToast()('Unable to copy');
    };
};

function resetSelectedInputs(): void {
    /**
     * Reset the selected inputs
     */
    useToast()('Syntax reset');
    emitResetSelectedInputs();
};

function emitResetSelectedInputs(): void {
    /**
     * Emit the item to change to the parent component
     */
    emit('resetSelectedInputs');
};

function addValueToInput(): void {
    /**
     * Save the user's input value
     */
    if (inputToEdit.value) {
        emitAddValueToInput(inputToEdit, newInputValue.value);
        inputToEdit.value = null;
        newInputValue.value = '';
    };
};

function emitAddValueToInput(inputToEdit: Ref<ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams | null>, newInputValue: string): void {
    /**
     * Emit the item to add value to to the parent component
     * 
     * @param {ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams | null} inputToEdit - The item to edit
     * @param {string} newInputValue - The value to add to the input
     */
    emit('addValueToInput', inputToEdit, newInputValue);
};

function setEditFields(inputToEditTarget: ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams | null): void {
    /**
     * Set the edit fields to the input to modify and its value
     * 
     * @param {ISingleCommandArgs | ISingleCommandOptions | ISingleCommandParams | null} inputToModify - The item to modify
     */
    if (inputToEdit.value && newInputValue.value) {
        emitAddValueToInput(inputToEdit, newInputValue.value);
    };

    inputToEdit.value = inputToEditTarget;
    newInputValue.value = inputToEditTarget?.value || '';

    nextTick((): void => {
        /**
         * Focus on the edit field after it is rendered
         */
        const editFieldArray = editField.value as HTMLInputElement[];

        if (editFieldArray.length > 0) {
            editFieldArray[0].focus();
        };
    });
};

onClickOutside(target, (): void => {
    /**
     * Save the user's input value when the user clicks outside of the field
     */
    addValueToInput();
});

</script>

<style scoped>
#command-meta {
    margin-top: 1em;
    font-size: 16px;
    line-height: 1.7em;
    background: var(--color-background);
    padding: 0.7em 1.25em;
    width: 100%;
    min-height: 300px;
    border: 1px solid var(--color-background-mute);
    border-radius: 10px;
    transition: all 0.5s;
}

#comment-meta-actions>span:first-of-type {
    margin-left: 12px;
}

#command-meta-copy,
#command-meta-reset {
    float: right;
    text-align: right;
    width: 24px;
    height: 24px;
    border: 1px solid rgba(0, 0, 0, 0);
    margin: 3px -3px;
    border-radius: 3px;
    transition: border 0.2s;
}

#command-meta-copy:hover,
#command-meta-reset:hover {
    border: 1px solid var(--color-text);
}

.editField {
    font-family: 'Inconsolata', 'Consolas', 'Courier New', monospace;
    font-size: 16px;
    color: var(--color-text);
    margin-right: 1ch;
    border: none;
    background: var(--color-background-soft);
}
</style>