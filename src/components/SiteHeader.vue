<template>
    <div id="site-header">
        <RouterLink to="/">
            <LogoMain />
        </RouterLink>
        <div id="nav">
            <nav>
                <RouterLink to="/about">About</RouterLink>
                <span class="colour-scheme-icon hover-hand" v-on:click="toggleColourScheme" v-if="currentColourScheme">
                    <IconLightMode />
                </span>
                <span class="colour-scheme-icon hover-hand" v-on:click="toggleColourScheme" v-else>
                    <IconDarkMode />
                </span>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import LogoMain from '@/components/partials/LogoMain.vue';
import { colourSchemeStore } from '@/stores/colourSchemeStore';
import IconDarkMode from '@/components/partials/IconDarkMode.vue';
import IconLightMode from '@/components/partials/IconLightMode.vue';

import type { ComputedRef } from 'vue';

const currentColourScheme: ComputedRef<boolean> = ref(computed(() => { return colourSchemeStore().darkMode }));

function toggleColourScheme() {
    /**
     * Toggle the colour scheme between light and dark mode
     */
    colourSchemeStore().toggleDarkMode();
}
</script>

<style scoped>
#site-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

nav {
    display: flex;
    justify-content: right;
    width: 200px;
    margin-right: 0.25em;
}

nav>* {
    margin: 0px 10px;
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
