<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
</script>

<template>
    <button @click="useAuthStore().logout" class="d-flex border-0">
        <v-icon icon="mdi-account-arrow-right" />
    </button>
</template>
