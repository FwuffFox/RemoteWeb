<script setup lang="ts">
import NavBar from "../components/NavBar.vue";
</script>

<template>
    <div class="NavBarLayout">
        <NavBar></NavBar>
        <main>
            <slot />
        </main>
    </div>
</template>
