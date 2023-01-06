<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();
</script>

<template>
    <button @click="auth.logout" class="btn-sign-out">
        <v-icon icon="mdi-account-arrow-right" />
    </button>
</template>

<style scoped>
.btn-sign-out {
    background: none;
    border: none;
    display: flex;
}
</style>
