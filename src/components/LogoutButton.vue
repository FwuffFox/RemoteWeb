<script setup lang="ts">
defineEmits(["press"])
</script>

<template>
    <button @click="$emit('press')" class="d-flex border-0">
        <v-icon icon="mdi-account-arrow-right" />
    </button>
</template>
