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
        <div id="command-meta">
            <span id="command-meta-copy" title="Copy text" class="hover-hand" v-on:click="copySyntaxToClipboard()">
                <IconCopy />
            </span>
            <span id="command-syntax">
                <span class="enable-select command-syntax command-name">
                    {{ selectedCommandName + ' ' }}
                </span>
                <span class="enable-select command-syntax command-option" v-for="option in selectedCommandOptions"
                    :key="option.flag" :title="option.description">
                    {{ option.flag + ' ' }}
                </span>
                <span class="enable-select command-syntax command-arg" v-for="arg in selectedCommandArgs" :key="arg.flag"
                    :title="arg.description">
                    {{ arg.flag }}=&lt;{{ arg.placeholder }}>
                </span>
                <span class="enable-select command-syntax command-param" v-for="param in selectedCommandParams"
                    :key="param.placeholder" :title="param.description">
                    &lt;{{ param.placeholder }}>
                </span>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import { useSearchStore } from '@/stores/searchStore';
import { supabaseClient } from '@/constants/supabaseConfig.js';
import IconCopy from '@/components/partials/IconCopy.vue';

import type { Ref, ComputedRef } from 'vue';
import type { ISingleCommand, ISingleCommandArgs, ISingleCommandOptions, ISingleCommandParams } from '@/interfaces/ISingleCommand';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';

const selectedCommandId: ComputedRef<number | null> = computed(() => { return useSearchStore().selectedId; });
const selectedCommandName: Ref<string> = ref('');
const selectedCommandType: Ref<string> = ref('');
const selectedCommandDescription: Ref<string> = ref('');
const selectedCommandArgs: Ref<ISingleCommandArgs[]> = ref([]);
const selectedCommandOptions: Ref<ISingleCommandOptions[]> = ref([]);
const selectedCommandParams: Ref<ISingleCommandParams[]> = ref([]);

async function getSelectedCommandInfo(): Promise<void> {
    const { data }: PostgrestSingleResponse<ISingleCommand> = await supabaseClient.from('commandNames').select(`
        id, 
        name,
        description,
        commandTypes (
            id,
            name
        ),
        commandArgs (
            flag,
            placeholder,
            description
        ),
        commandOptions (
            flag,
            description
        ),
        commandParams (
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

        useHead({
            title: `${selectedCommandName.value} ${selectedCommandType.value} command help > cmdpedia`
        });
    };
};

async function copySyntaxToClipboard(): Promise<void> {
    const children = document.querySelector('#command-syntax')?.children
    const contentToCopy = children ? Array.from(children, ({ textContent }) => textContent?.trim()).filter(Boolean).join(' ') : null;

    if (contentToCopy === null) {
        alert('Unable to copy. Please try again.');
        return;
    } else {
        try {
            await navigator.clipboard.writeText(contentToCopy);
            alert('Syntax copied to clipboard');
        } catch (err) {
            alert('Unable to copy. Please try again.');
        }
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
    margin-left: 1em;
}


#command-name {
    font-size: 2.5em;
    font-weight: bold;
}

#command-description {
    margin-top: -10px;
}

#command-meta {
    margin-top: 0.5em;
    font-size: 16px;
    line-height: 1.7em;
    background: var(--color-background);
    padding: 0.7em 1.25em;
    width: 100%;
    min-height: 300px;
    border: 1px solid var(--color-background-mute);
    border-radius: 10px;
}

#command-meta-copy {
    float: right;
    background: var(--color-background);
    text-align: right;
    width: 24px;
    height: 24px;
    border: 1px solid rgba(0, 0, 0, 0);
    margin: 3px -3px;
    transition: all 0.2s;
}

#command-meta-copy:hover {
    border: 1px solid var(--color-text);
    border-radius: 3px;
}
</style>