<template>
    <div id="site-sidebar" :style="{ width: sidebarOpen ? '350px' : '0px' }" ref="target">
        Hello world!
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { sidebarStore } from '@/stores/sidebarStore';
import { onClickOutside } from '@vueuse/core';

import type { Ref, ComputedRef } from 'vue';

const sidebarOpen: ComputedRef<boolean> = computed(() => sidebarStore().sidebarOpen);
const target: Ref<null> = ref(null);

function closeSidebar(): void {
    /**
     * Close the sidebar
     */
    sidebarStore().setSidebarClosed();
};

onClickOutside(target, (): void => {
    /**
     * Close the sidebar when the user clicks outside of it
     */
    closeSidebar()
});
</script>

<style scoped>
div#site-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 0px;
    height: 100vh;
    background-color: var(--color-background-mute);
    z-index: 99999;
    transition: all 0.2s;
}
</style>