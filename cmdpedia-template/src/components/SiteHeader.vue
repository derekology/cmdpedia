<template>
    <div id="site-header">
        <RouterLink to="/" class="hover-hand" v-on:click="resetSelectedId()">
            <LogoMain />
        </RouterLink>
        <div id="nav">
            <nav>
                <RouterLink v-if="onAboutPage" to="/">{{ selectedCommandId !== -1 ? 'back' : 'home' }}
                </RouterLink>
                <RouterLink v-else to="/about">about</RouterLink>
                <span class="colour-scheme-icon hover-hand" v-on:click="toggleColourScheme"
                    v-if="currentDarkColourScheme">
                    <IconLightMode />
                </span>
                <span class="colour-scheme-icon hover-hand" v-on:click="toggleColourScheme" v-else>
                    <IconDarkMode />
                </span>
                <span class="colour-scheme-icon hover-hand" v-if="sidebarOpen">
                    <IconCloseSidebar />
                </span>
                <span class="colour-scheme-icon hover-hand" v-on:click="openSidebar" v-else>
                    <IconOpenSidebar />
                </span>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useHead } from '@unhead/vue';
import { useRoute, RouterLink } from 'vue-router';
import { colourSchemeStore } from '@/stores/colourSchemeStore';
import { useSearchStore } from '@/stores/searchStore';
import { useSidebarStore } from '@/stores/sidebarStore';
import LogoMain from '@/components/partials/LogoMain.vue';
import IconDarkMode from '@/components/partials/IconDarkMode.vue';
import IconLightMode from '@/components/partials/IconLightMode.vue';
import IconOpenSidebar from '@/components/partials/IconOpenSidebar.vue';
import IconCloseSidebar from '@/components/partials/IconCloseSidebar.vue';

import type { ComputedRef } from 'vue';

const selectedCommandId: ComputedRef<number | null> = computed((): number | null => useSearchStore().selectedId);
const currentDarkColourScheme: ComputedRef<boolean> = ref(computed((): boolean => colourSchemeStore().darkMode));
const sidebarOpen: ComputedRef<boolean> = ref(computed((): boolean => useSidebarStore().sidebarOpen));
const onAboutPage: ComputedRef<boolean> = ref(computed((): boolean => useRoute().path === '/about'));

function resetSelectedId(): void {
    /**
     * Get the details of the selected command
     * 
     * @param {number} id The ID of the selected command
     */
    useSearchStore().setSelectedId(-1);
    useHead({
        title: `> cmdpedia`
    });
};

function toggleColourScheme(): void {
    /**
     * Toggle the colour scheme between light and dark mode
     */
    colourSchemeStore().toggleDarkMode();
};

function openSidebar(): void {
    /**
     * Toggle the sidebar
     */
    useSidebarStore().setSidebarOpen();
};
</script>

<style scoped>
#site-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3%;
    width: 100%;
}

nav {
    display: flex;
    justify-content: right;
    margin-top: 4px;
}

nav>* {
    margin: 0px 8px;
}

.colour-scheme-icon svg {
    display: inline-block;
    scale: 0.7;
    vertical-align: middle;
    transition: color 0.2s;
}

.colour-scheme-icon svg:hover {
    color: var(--color-hover);
}
</style>
