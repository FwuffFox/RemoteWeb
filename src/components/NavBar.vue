<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
    <nav class="nav-bar">
        <RouterLink to="/">Index</RouterLink>
        <RouterLink to="/about">About</RouterLink>
    </nav>
</template>

<style scoped lang="scss">
@use "../assets/main.scss" as main;
.nav-bar {
    width: 100%;
    font-size: 12px;
    text-align: center;

    a {
        display: inline-block;
        padding: 0 1rem;
        border-left: 1px solid main.$primary-color;
    }

    a.router-link-exact-active:hover {
        background: transparent;
    }

    a.router-link-exact-active {
        color: var(--color-text);
    }

    a:last-child {
        border-right: 1px solid main.$primary-color;
    } 
}
</style>
