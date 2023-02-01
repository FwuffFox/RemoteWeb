<script setup lang="ts">
import type { IPrivateChat } from "@/models/IPrivateChat";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { storeToRefs } from "pinia";

const props = defineProps<{
    chat: IPrivateChat;
}>();

const { user } = storeToRefs(useAuthStore());
const chatName =
    props.chat.users[0].username != user.value?.username
        ? props.chat.users[0].username
        : props.chat.users[1].username;

const route = useRoute();
</script>

<template>
    <li class="mb-2 d-flex ">
        <RouterLink class="py-2 px-10 w-100" :class="{ isActive: chatName === route.params.chatName }" :to="'/' + chatName">
            <span class="h3">{{ chatName }}</span>
        </RouterLink>
    </li>
</template>

<style scoped>
a.isActive {
    background: rgba(255, 255, 255, 0.25);
}
</style>
