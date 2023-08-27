<template>
    <div id="command-meta">
        <span id="command-meta-copy" title="Copy text" class="hover-hand" v-on:click="copySyntaxToClipboard()">
            <IconCopy />
        </span>
        <span id="command-syntax">
            <span class="enable-select command-syntax command-name">
                {{ props.selectedCommandName + ' ' }}
            </span>
            <span class="enable-select command-syntax command-option" v-for="option in props.selectedCommandSelectedOptions"
                :key="option.flag" :title="option.description">
                {{ option.flag + ' ' }}
            </span>
            <span class="enable-select command-syntax command-arg" v-for="arg in props.selectedCommandSelectedArgs"
                :key="arg.flag" :title="arg.description">
                {{ arg.flag }}=&lt;{{ arg.placeholder }}>
            </span>
            <span class="enable-select command-syntax command-param" v-for="param in props.selectedCommandSelectedParams"
                :key="param.placeholder" :title="param.description">
                &lt;{{ param.placeholder }}>
            </span>
        </span>
    </div>
</template>

<script setup lang="ts">
import IconCopy from '@/components/partials/IconCopy.vue';

import type { PropType } from 'vue';
import type { ISingleCommandArgs, ISingleCommandOptions, ISingleCommandParams } from '@/interfaces/ISingleCommand';

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

async function copySyntaxToClipboard(): Promise<void> {
    /**
     * Copy the command syntax to the user's clipboard
     */
    const children: HTMLCollection | undefined = document.querySelector('#command-syntax')?.children
    const contentToCopy: string | null = children ? Array.from(children, ({ textContent }) => textContent?.trim()).join(' ') : null;

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

#command-meta-copy {
    float: right;
    text-align: right;
    width: 24px;
    height: 24px;
    border: 1px solid rgba(0, 0, 0, 0);
    margin: 3px -3px;
    border-radius: 3px;
    transition: border 0.2s;
}

#command-meta-copy:hover {
    border: 1px solid var(--color-text);
}
</style>