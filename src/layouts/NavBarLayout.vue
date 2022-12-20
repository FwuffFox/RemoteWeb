<template>
    <div class="NavBarLayout">
        <NavBar></NavBar>
        <main>
            <slot />
        </main>
    </div>
</template>

<script lang="ts">
import NavBar from "../components/NavBar.vue";

export default {
    name: "navbar-layout",
    components: {
        NavBar,
    },
};
</script>
