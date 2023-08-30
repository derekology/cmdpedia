import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { Ref } from 'vue';
import type { ICommandToSave } from '@/interfaces/ISingleCommand';

export const sidebarStore = defineStore(
    'sidebarStore', () => {
        const sidebarOpen: Ref<boolean> = ref(false);

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

        function saveCommandToSidebar(item: ICommandToSave): void {
            /**
             * Save command to sidebar
             */
            console.log(item);
            setSidebarOpen();
        }

        return {
            sidebarOpen,
            setSidebarOpen,
            setSidebarClosed,
            toggleSidebar,
            saveCommandToSidebar
        };
    });