<template>
    <div id="site-sidebar" v-if="sidebarOpen" ref="target">
        <div id="sidebar-header">
            <span id="header-info">
                <span id="title">
                    Saved Commands
                </span>
            </span>
            <span id="sidebar-close" class="hover-hand" v-on:click="closeSidebar()">
                <IconClose />
            </span>
        </div>
        <div id="saved-commands">
            <div id="no-results" v-if="savedCommandsList.length == 0">
                <span>No commands saved.</span>
            </div>
            <div v-for="command in savedCommandsList" :key="command.id" class="saved-command"
                v-on:mouseenter="hoveredCommandId = command.id" v-on:mouseleave="hoveredCommandId = null" v-else>
                <span id="comment-meta-actions" v-if="command.id == hoveredCommandId">
                    <span id="command-meta-remove" title="Remove" class="command-meta-icon hover-hand"
                        v-on:click="deleteSavedCommand(command.id)">
                        <IconClose />
                    </span>
                    <span id="command-meta-copy" title="Copy" class="command-meta-icon hover-hand"
                        v-on:click="copySavedCommandToClipboard(command.command)">
                        <IconCopy />
                    </span>
                    <span id="command-meta-move-down" title="Move down" class="command-meta-icon hover-hand"
                        v-on:click="moveCommandOneSpotDown(command.id)">
                        <IconDown />
                    </span>
                    <span id="command-meta-move-up" title="Move up" class="command-meta-icon hover-hand"
                        v-on:click="moveCommandOneSpotUp(command.id)">
                        <IconUp />
                    </span>
                </span>
                <div class="saved-command-command">{{ command.command }}</div>
            </div>
        </div>
        <div id="all-command-actions">
            <span id="copy-all-saved" v-on:click="CopyAllSavedCommands" v-if="savedCommandsList.length > 0"
                class="hover-hand">
                Copy all
            </span>
            <span id="remove-all-saved" v-on:click="clearSavedCommands" v-if="savedCommandsList.length > 0"
                class="hover-hand">
                Remove all
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useSidebarStore } from '@/stores/sidebarStore';
import { onClickOutside } from '@vueuse/core';
import { useToast, TYPE } from "vue-toastification";
import IconClose from './partials/IconClose.vue';
import IconCopy from '@/components/partials/IconCopy.vue';
import IconUp from '@/components/partials/IconUp.vue';
import IconDown from '@/components/partials/IconDown.vue';

import type { Ref, ComputedRef } from 'vue';
import type { ICommandToSave } from '@/interfaces/ISingleCommand';

const sidebarOpen: ComputedRef<boolean> = computed(() => useSidebarStore().sidebarOpen);
const hoveredCommandId: Ref<number | null> = ref(null);
const savedCommandsList: Ref<ICommandToSave[]> = ref(useSidebarStore().savedCommands.traverseNodes());
const savedCommandsUpdatedFlag: ComputedRef<boolean> = computed(() => useSidebarStore().savedCommandsUpdatedFlag);
const target: Ref<null> = ref(null);

function closeSidebar(): void {
    /**
     * Close the sidebar
     */
    useSidebarStore().setSidebarClosed();
};

function deleteSavedCommand(id: number): void {
    /**
     * Delete a saved command from the local store
     * 
     * @param {number} id - The ID of the command to delete
     */
    useSidebarStore().deleteSavedCommand(id);
    useToast()('Command removed', { type: TYPE.SUCCESS });
};

function moveCommandOneSpotUp(id: number): void {
    /**
     * Move selected command one spot up in the sidebar
     * 
     * @param {number} id - The ID of the command to move
     */
    useSidebarStore().moveCommandOneSpotUp(id);
};

function moveCommandOneSpotDown(id: number): void {
    /**
     * Move selected command one spot down in the sidebar
     * 
     * @param {number} id - The ID of the command to move
     */
    useSidebarStore().moveCommandOneSpotDown(id);
};

function clearSavedCommands(): void {
    /**
     * Clear all saved commands from the local store
     */
    useSidebarStore().clearSavedCommands();
    useToast()('All commands removed', { type: TYPE.SUCCESS });
};

async function CopyAllSavedCommands(): Promise<void> {
    /**
     * Copy all saved commands to the user's clipboard
     */
    const allCommands: string = savedCommandsList.value.map(command => command.command).join('\n');

    if (allCommands === null) {
        useToast()('Unable to copy', { type: TYPE.ERROR });
        return;
    };

    try {
        await navigator.clipboard.writeText(allCommands);
        useToast()('All commands copied', { type: TYPE.SUCCESS });
    } catch (err) {
        useToast()('Unable to copy', { type: TYPE.ERROR });
    };
};

async function copySavedCommandToClipboard(command: string): Promise<void> {
    /**
     * Copy the command syntax to the user's clipboard
     * 
     * @param {string} command - The command to copy
     */
    if (command === null) {
        useToast()('Unable to copy', { type: TYPE.ERROR });
        return;
    };

    try {
        await navigator.clipboard.writeText(command);
        useToast()('Command copied', { type: TYPE.SUCCESS });
    } catch (err) {
        useToast()('Unable to copy', { type: TYPE.ERROR });
    };
};

function lowerSavedCommandUpdatedFlag(): void {
    /**
     * Lower the saved commands updated flag
     */
    useSidebarStore().setCommandsUpdatedFlag(false);
};

onClickOutside(target, (): void => {
    /**
     * Close the sidebar when the user clicks outside of it
     */
    closeSidebar();
});

watch(savedCommandsUpdatedFlag, () => {
    /**
     * Update the saved commands list when the saved commands are updated
     */
    if (savedCommandsUpdatedFlag.value) {
        savedCommandsList.value = useSidebarStore().savedCommands.traverseNodes();
        lowerSavedCommandUpdatedFlag();
    };
});
</script>

<style scoped>
#site-sidebar {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 0;
    right: 0;
    padding: 15px;
    width: 350px;
    max-width: 100vw;
    height: 100vh;
    background-color: var(--color-background-mute);
    filter: drop-shadow(-10 0 0.2rem rgba(0, 0, 0, 0.1));
    z-index: 9999;
    transition: all 0.2s;
}

#sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 5px;
}

#sidebar-close {
    margin-top: 6px;
    margin-left: 2px;
}

#title {
    margin-right: 0.5em;
}

#sidebar-close {
    display: flex;
    justify-content: center;
    align-items: center;
}

#sidebar-close:hover {
    color: var(--color-hover);
    transition: all 0.2s;
}

#saved-commands {
    height: 100%;
    margin-top: 0.75em;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

#saved-commands::-webkit-scrollbar {
    display: none;
}

#no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-style: italic;
    padding: 20px 10px;
    font-size: smaller;
    height: 100%;
}

#saved-commands {
    height: 100%;
}

.saved-command {
    position: relative;
    margin: 10px 5px;
    padding: 10px 15px;
    border-radius: 10px;
    background-color: var(--color-background);
    border: 1px solid var(--color-background-mute);
    filter: drop-shadow(0 0 0.15rem rgba(0, 0, 0, 0.025));
}

.saved-command-command {
    font-size: 0.75em;
    line-height: 1em;
}

#comment-meta-actions {
    position: absolute;
    right: 7px;
    padding: 0 3px 5px 3px;
    background: var(--color-background);
}

#comment-meta-actions>span {
    margin-top: -4px;
    margin-left: 3px;
}

.command-meta-icon {
    float: right;
    text-align: right;
    width: 24px;
    height: 24px;
    border: 1px solid rgba(0, 0, 0, 0);
    margin: -3px -1px;
    border-radius: 3px;
    scale: 0.85;
    transition: border 0.2s;
}

.command-meta-icon:hover {
    border: 1px solid var(--color-text);
}

.saved-command:first-of-type #command-meta-move-up,
.saved-command:last-of-type #command-meta-move-down {
    display: none;
}

.saved-command:last-of-type #command-meta-move-up {
    margin-right: 24px;
}

#all-command-actions {
    display: flex;
    justify-content: space-around;
    text-align: center;
    margin: 0.75em 5px 0 5px;
}

#all-command-actions>span {
    line-height: 1em;
    margin: 0.5em 0;
    border: 1px solid var(--color-border);
    padding: 0.5em 1em;
    border-radius: 5px;
    transition: all 0.2s;
}

#all-command-actions>span:hover {
    background-color: var(--color-border-hover);
}
</style>