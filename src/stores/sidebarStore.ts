import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { Ref } from 'vue';
import type { ICommandToSave } from '@/interfaces/ISingleCommand';

export const sidebarStore = defineStore(
    'sidebarStore', () => {
        const sidebarOpen: Ref<boolean> = ref(false);
        const savedCommands: Ref<ICommandToSave[]> = ref(JSON.parse(localStorage.getItem('savedCommands') as string));

        function setSidebarOpen(): void {
            /**
             * Set sidebar open value to new sidebar open value
             */
            sidebarOpen.value = true;
        };

        function setSidebarClosed(): void {
            /**
             * Set sidebar open value to false
             */
            sidebarOpen.value = false;
        };

        function toggleSidebar(): void {
            /**
             * Toggle sidebar open value
             */
            sidebarOpen.value = !sidebarOpen.value;
        };

        function initiateLocalStore(): void {
            /**
             * Initiate local storage with empty array if it doesn't exist
             */
            if (!localStorage.getItem('savedCommands')) {
                localStorage.setItem('savedCommands', JSON.stringify([]));
            };
        };

        function saveCommandToLocalStore(commandToSave: ICommandToSave): void {
            /**
             * Save command to sidebar
             * 
             * @param {ICommandToSave} commandToSave - command to save to sidebar
             */
            const newSavedCommands = savedCommands.value.concat(commandToSave);
            localStorage.setItem('savedCommands', JSON.stringify(newSavedCommands));
            savedCommands.value = JSON.parse(localStorage.getItem('savedCommands') as string);
        };

        function deleteSavedCommand(id: number): void {
            /**
             * Delete saved command from local storage
             * 
             * @param {number} id - id of command to delete
             */
            const newSavedCommands = savedCommands.value.filter((command) => command.id !== id);
            localStorage.setItem('savedCommands', JSON.stringify(newSavedCommands));
            savedCommands.value = JSON.parse(localStorage.getItem('savedCommands') as string);
        }

        function clearSavedCommands(): void {
            /**
             * Clear all saved commands from local storage
             */
            localStorage.setItem('savedCommands', JSON.stringify([]));
            savedCommands.value = JSON.parse(localStorage.getItem('savedCommands') as string);
        }

        return {
            sidebarOpen,
            savedCommands,
            setSidebarOpen,
            setSidebarClosed,
            toggleSidebar,
            initiateLocalStore,
            saveCommandToLocalStore,
            deleteSavedCommand,
            clearSavedCommands
        };
    });