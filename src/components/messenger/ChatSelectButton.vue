<script setup lang="ts">
import type { Chat } from "@/models/Chat"
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { storeToRefs } from "pinia";

const props = defineProps<{
    chat: Chat;
}>();

const chatName = props.chat.chat_name!;

const route = useRoute();
</script>

<template>
    <li class="mb-2 d-flex">
        <RouterLink
            class="py-2 px-10 w-100"
            :class="{ isActive: chatName === route.params.chatName }"
            :to="'/' + chatName"
        >
            <span class="h3">{{ chatName }}</span>
        </RouterLink>
    </li>
</template>

<style scoped>
a.isActive {
    background: rgba(255, 255, 255, 0.25);
}
</style>
