<script setup lang="ts">
import type { Chat } from "@/models";
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
    <li>
        <RouterLink
            class="py-2 px-2 w-100 mb-0 d-flex flex-row orange-hover"
            :class="{ isActive: chatName === route.params.chatName }"
            :to="'/' + chatName"
        >
            <v-avatar class="me-5" size="50" color="blue" variant="elevated">
                <span>{{ props.chat.interlocutor?.username.substring(1, 3).toUpperCase() }}</span>
            </v-avatar>
            <div class="d-flex flex-column overflow-hidden">
                <span class="h3 text-white">{{ props.chat.interlocutor?.fullName }}</span>
                <span class="text text-white">{{ props.chat.messages[props.chat.messages.length - 1].body }}</span>
            </div>
        </RouterLink>
    </li>
</template>

<style scoped>
.text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
a.isActive {
    background: rgba(255, 255, 255, 0.25);
}
</style>
