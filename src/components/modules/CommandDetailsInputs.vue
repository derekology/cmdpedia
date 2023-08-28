<template>
    <div id="header">
        <span id="heading">
            <span id="title">inputs&nbsp;</span>
            <span id="desc">hover over an input for more info</span>
        </span>
        <div id="part-select">
            <select id="part-select-dropdown" class="hover-hand" title="argument-type-select" v-model="selectedSection">
                <option value="all">all</option>
                <option value="options" v-if="props.selectedCommandOptions.length > 0">options</option>
                <option value="args" v-if="props.selectedCommandArgs.length > 0">arguments</option>
                <option value="params" v-if="props.selectedCommandParams.length > 0">parameters</option>
            </select>
        </div>
    </div>
    <div id="inputs">
        <div id="options" class="input-container" v-if="selectedSection == 'options' || selectedSection == 'all'">
            <span class="hover-hand command-part" :class="{ active: selectedCommandSelectedOptions.includes(option) }"
                v-for="option in props.selectedCommandOptions"
                v-on:click="emitInputToModify({ list: 'option', item: option })" :key="option.flag"
                :title="option.description">
                {{ `${option.flag}${option.required ? '*' : ''}` }}
            </span>
        </div>
        <div id="args" class="input-container" v-if="selectedSection == 'args' || selectedSection == 'all'">
            <span class="hover-hand command-part" v-for="arg in props.selectedCommandArgs" :key="arg.flag"
                :class="{ active: selectedCommandSelectedArgs.includes(arg) }"
                v-on:click="emitInputToModify({ list: 'arg', item: arg })" :title="arg.description">
                {{ `${arg.flag}=<${arg.placeholder}>${arg.required ? '*' : ''}` }}
            </span>
        </div>
        <div id="params" class="input-container" v-if="selectedSection == 'params' || selectedSection == 'all'">
            <span class="hover-hand command-part" v-for="param in props.selectedCommandParams"
                :class="{ active: selectedCommandSelectedParams.includes(param) }"
                v-on:click="emitInputToModify({ list: 'param', item: param })" :key="param.placeholder"
                :title="param.description">
                {{ `<${param.placeholder}>${param.required ? '*' : ''}` }}
            </span>
        </div>
    </div>
    <div id="footnote">
        * = required<br />
        &lt;> = placeholder that can be edited by clicking on it
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import type { Ref, PropType } from 'vue';
import type { ISingleCommandArgs, ISingleCommandOptions, ISingleCommandParams, IInputToModify } from '@/interfaces/ISingleCommand';

const emit = defineEmits(['modifyInput']);

const selectedSection: Ref<string> = ref('all');

const props = defineProps({
    selectedCommandName: {
        type: String,
        required: true
    },
    selectedCommandArgs: {
        type: Array as PropType<ISingleCommandArgs[]>,
        required: true
    },
    selectedCommandOptions: {
        type: Array as PropType<ISingleCommandOptions[]>,
        required: true
    },
    selectedCommandParams: {
        type: Array as PropType<ISingleCommandParams[]>,
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

function emitInputToModify(inputToModify: IInputToModify): void {
    /**
     * Emit the item to change to the parent component
     * 
     * @param {IInputToModify} inputToModify - The item to change
     */
    emit('modifyInput', inputToModify);
};

</script>

<style scoped>
#header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5em;
    padding: 0 0.5em;
    width: 100%;
}

#heading {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    line-height: 1em;
    margin-top: 10px;
}

#title {
    font-size: 1.2em;
    line-height: 1.2em;
}

#desc,
#footnote {
    font-size: 12px;
    color: var(--color-text);
}

#part-select {
    line-height: 1em;
    margin: 0.8em 0.3em 0.6em 0.3em;
    padding: 0 0.5em !important;
    border: 1px solid var(--color-border);
    border-radius: 3px;
    transition: all 0.2s;
}

#part-select:hover {
    cursor: pointer;
    background-color: var(--color-border-hover);
}

#part-select-dropdown {
    padding-right: 0.8rem !important;
    font-family: 'Inconsolata', 'Consolas', 'Courier New', monospace;
    font-size: 14px;
    line-height: 2.25rem;
    color: var(--color-text);
    text-align: right;
    border: none;
    outline: none;
    appearance: none;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    background: transparent !important;
    background-image: url("data:image/svg+xml;utf8,<svg height='6' fill='grey' viewBox='0 0 24 24' width='8' xmlns='http://www.w3.org/2000/svg'><path d='M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z'/></svg>") !important;
    background-repeat: no-repeat !important;
    background-position-x: 100% !important;
    background-position-y: 16px !important;
}

#part-select-dropdown>option {
    background-color: var(--color-background-soft);
}

.input-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
    align-items: center;
}

.command-part {
    font-size: small;
    line-height: 1.5em;
    border: 1px solid var(--color-border);
    border-radius: 3px;
    padding: 0.2em 0.6em;
    margin: 0.5em;
    transition: all 0.2s;
}

.command-part:hover,
.active {
    background-color: var(--color-border-hover);
}

#footnote {
    line-height: 1.5em;
    margin-top: 1em;
    margin-left: 0.7em;
}
</style>