<template>
    <div id="site-header">
        <RouterLink to="/">
            <LogoMain />
        </RouterLink>
        <div id="nav">
            <nav>
                <RouterLink v-if="onAboutPage" :to="lastPage ? lastPage : '/'">{{ lastPage ? 'back' : 'home' }}</RouterLink>
                <RouterLink v-else to="/about" v-on:click="captureLastPage()">about</RouterLink>
                <span class="colour-scheme-icon hover-hand" v-on:click="toggleColourScheme" v-if="currentColourScheme">
                    <IconLightMode />
                </span>
                <span class="colour-scheme-icon hover-hand" v-on:click="toggleColourScheme" v-else>
                    <IconDarkMode />
                </span>
                <span class="colour-scheme-icon hover-hand" v-on:click="toggleSidebar" v-if="sidebarOpen">
                    <IconCloseSidebar />
                </span>
                <span class="colour-scheme-icon hover-hand" v-on:click="toggleSidebar" v-else>
                    <IconOpenSidebar />
                </span>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { colourSchemeStore } from '@/stores/colourSchemeStore';
import { sidebarStore } from '@/stores/sidebarStore';
import LogoMain from '@/components/partials/LogoMain.vue';
import IconDarkMode from '@/components/partials/IconDarkMode.vue';
import IconLightMode from '@/components/partials/IconLightMode.vue';
import IconOpenSidebar from '@/components/partials/IconOpenSidebar.vue';
import IconCloseSidebar from '@/components/partials/IconCloseSidebar.vue';

import type { Ref, ComputedRef } from 'vue';

const currentColourScheme: ComputedRef<boolean> = ref(computed((): boolean => colourSchemeStore().darkMode));
const sidebarOpen = ref(computed((): boolean => sidebarStore().sidebarOpen));
const onAboutPage: ComputedRef<boolean> = ref(computed((): boolean => useRoute().path === '/about'));
const lastPage: Ref<string> = ref('');

function toggleColourScheme(): void {
    /**
     * Toggle the colour scheme between light and dark mode
     */
    colourSchemeStore().toggleDarkMode();
};

function captureLastPage(): void {
    /**
     * Capture the last page the user was on
     */
    lastPage.value = window.location.pathname.replace("/", "");
};

function toggleSidebar(): void {
    /**
     * Open the sidebar
     */
    sidebarStore().toggleSidebar();
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
