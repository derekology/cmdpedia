<template>
    <div id="site-header">
        <RouterLink to="/">
            <LogoMain />
        </RouterLink>
        <div id="nav">
            <nav>
                <RouterLink to="/about">About</RouterLink>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import LogoMain from '@/components/partials/LogoMain.vue';
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
    margin-right: 1.25em;
}
</style>
