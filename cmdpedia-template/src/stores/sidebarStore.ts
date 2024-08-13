import { ref } from 'vue';
import { defineStore } from 'pinia';
import { LinkedList, Node } from '@/interfaces/IGeneralData';

import type { Ref } from 'vue';
import type { ICommandToSave } from '@/interfaces/ISingleCommand';
import type { ILinkedList } from '@/interfaces/IGeneralData';

export const useSidebarStore = defineStore(
    'sidebarStore', () => {
        const savedCommands: ILinkedList<ICommandToSave> = new LinkedList<ICommandToSave>();
        getSavedCommands();

        const sidebarOpen: Ref<boolean> = ref(false);
        const savedCommandsUpdatedFlag: Ref<boolean> = ref(false);

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

        function getSavedCommands(): void {
            /**
             * Get saved commands from local storage
             */
            const savedCommandsFromLocalStorage: ICommandToSave[] = JSON.parse(localStorage.getItem('savedCommands') as string);

            if (savedCommandsFromLocalStorage) {
                for (let i = 0; i < savedCommandsFromLocalStorage.length; i++) {
                    const savedCommand: ICommandToSave = savedCommandsFromLocalStorage[i];
                    savedCommands.insertAtEnd(savedCommand);
                };
            };
        };

        function saveCommandsToLocalStore(): void {
            /**
             * Save current commands list to local storage
             */
            localStorage.setItem('savedCommands', JSON.stringify(savedCommands.traverseNodes()));

            setCommandsUpdatedFlag(true);
        };

        function setCommandsUpdatedFlag(newValue: boolean): void {
            /**
             * Set commands updated flag to new value
             * 
             * @param {boolean} newValue - new value for commands updated flag
             */
            savedCommandsUpdatedFlag.value = newValue;
        };

        function saveCommandToLocalStore(commandToSave: ICommandToSave): void {
            /**
             * Save command to sidebar
             * 
             * @param {ICommandToSave} commandToSave - command to save to sidebar
             */
            savedCommands.insertAtEnd(commandToSave);

            saveCommandsToLocalStore();
        };

        function moveCommandOneSpotUp(id: number): void {
            /**
             * Move command one spot up in list
             * 
             * @param {number} id - id of command to move
             */
            const nodeToMove: Node<ICommandToSave> | null = savedCommands.searchForNode((node) => node.id === id);

            if (nodeToMove) {
                savedCommands.moveOneSpotUp(nodeToMove);
            };

            saveCommandsToLocalStore();
        };

        function moveCommandOneSpotDown(id: number): void {
            /**
             * Move command one spot up in list
             * 
             * @param {number} id - id of command to move
             */
            const nodeToMove: Node<ICommandToSave> | null = savedCommands.searchForNode((node) => node.id === id);

            if (nodeToMove) {
                savedCommands.moveOneSpotDown(nodeToMove);
            };

            saveCommandsToLocalStore();
        };

        function deleteSavedCommand(id: number): void {
            /**
             * Delete saved command from local storage
             * 
             * @param {number} id - id of command to delete
             */
            const nodeToDelete: Node<ICommandToSave> | null = savedCommands.searchForNode((node) => node.id === id);

            if (nodeToDelete) {
                savedCommands.deleteNode(nodeToDelete);
            };

            saveCommandsToLocalStore();
        };

        function clearSavedCommands(): void {
            /**
             * Clear all saved commands from local storage
             */
            savedCommands.clear();

            saveCommandsToLocalStore();
        };

        return {
            sidebarOpen,
            savedCommands,
            savedCommandsUpdatedFlag,
            setSidebarOpen,
            setSidebarClosed,
            setCommandsUpdatedFlag,
            toggleSidebar,
            saveCommandToLocalStore,
            moveCommandOneSpotUp,
            moveCommandOneSpotDown,
            deleteSavedCommand,
            clearSavedCommands
        };
    });