<script setup lang="ts">
import NavBarLayout from "@/layouts/NavBarLayout.vue";
</script>

<template>
    <NavBarLayout>
        <div class="about">
            <h1 class="title">Remote development</h1>
        </div>
    </NavBarLayout>
</template>

<style lang="scss">
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>
