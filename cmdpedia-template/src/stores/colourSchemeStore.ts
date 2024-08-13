import { ref } from 'vue';
import { defineStore } from 'pinia';

import type { Ref } from 'vue';

export const colourSchemeStore = defineStore(
    'colourSchemeStore', () => {
        const darkMode: Ref<boolean> = ref(false);

        function setDarkMode(darkModeenabled: boolean): void {
            /**
             * Set dark mode value to new dark mode value then update colour scheme
             */
            darkMode.value = darkModeenabled;
            updateColourScheme();
        };

        function toggleDarkMode(): void {
            /**
             * Toggle dark mode value then update colour scheme
             */
            darkMode.value = !darkMode.value;
            updateColourScheme();
        };

        function determineInitialColourScheme(): void {
            /**
             * Determine initial colour scheme based on user's system preferences
             */
            window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? setDarkMode(true) : setDarkMode(false);
        };

        function updateColourScheme(): void {
            /**
             * Update colour scheme based on dark mode value
             */
            const root: HTMLElement | null = document.querySelector(':root');

            if (darkMode.value) {
                if (root && root.style) {
                    root.style.setProperty('--color-background', 'var(--vt-c-black)')
                    root.style.setProperty('--color-background-mute', 'var(--vt-c-black-mute)')
                    root.style.setProperty('--color-background-soft', 'var(--vt-c-black-soft)')

                    root.style.setProperty('--color-border', 'var(--vt-c-divider-dark-2)')
                    root.style.setProperty('--color-border-hover', 'var(--vt-c-divider-dark-1)')
                    root.style.setProperty('--color-border-hover-90', 'var(--vt-c-divider-dark-3)')

                    root.style.setProperty('--color-heading', 'var(--vt-c-text-dark-1)')
                    root.style.setProperty('--color-text', 'var(--vt-c-text-dark-2)')
                    root.style.setProperty('--color-hover', 'var(--vt-c-text-dark-3)')

                    root.style.setProperty('--color-error', 'var(--vt-c-error-dark)')
                }
            } else {
                if (root && root.style) {
                    root.style.setProperty('--color-background', 'var(--vt-c-white)')
                    root.style.setProperty('--color-background-mute', 'var(--vt-c-white-soft)')
                    root.style.setProperty('--color-background-soft', 'var(--vt-c-white-mute)')

                    root.style.setProperty('--color-border', 'var(--vt-c-divider-light-2)')
                    root.style.setProperty('--color-border-hover', 'var(--vt-c-divider-light-1)')
                    root.style.setProperty('--color-border-hover-90', 'var(--vt-c-divider-light-3)')

                    root.style.setProperty('--color-heading', 'var(--vt-c-text-light-1)')
                    root.style.setProperty('--color-text', 'var(--vt-c-text-light-1)')
                    root.style.setProperty('--color-hover', 'var(--vt-c-text-light-2)')

                    root.style.setProperty('--color-error', 'var(--vt-c-error-light)')
                }
            }
        };

        return { darkMode, determineInitialColourScheme, setDarkMode, toggleDarkMode };
    }
);