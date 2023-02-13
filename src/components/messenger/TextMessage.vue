<script setup lang="ts">
import type { Message } from "@/models/Message";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps<{
    message: Message;
}>();

const user = useAuthStore().getUser;

const messageIsMine = user?.username === props.message.sender?.username;
</script>

<template>
    <div class="message-item d-flex justify-content-start" :class="{ ismine: messageIsMine }">
        <v-avatar class="ml-3" color="blue" variant="elevated" v-if="messageIsMine">{{
            props.message.sender.username.substring(1, 3).toUpperCase()
        }}</v-avatar>
        <RouterLink v-if="!messageIsMine" :to="`/${props.message.sender.username}`">
            <v-avatar class="mr-3" color="blue" variant="elevated">
                {{ props.message.sender.username.substring(1, 3).toUpperCase() }}</v-avatar
            >
        </RouterLink>
        <div class="message-content">
            <div class="message-info d-flex flex-wrap align-items-center">
                <span class="author text-no-wrap">{{ props.message.sender.fullName }}</span>
            </div>
            <div class="content text-break">{{ props.message.body }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.message-item {
    margin-bottom: 12px;

    .message-content {
        font-size: 16px;
        background: wheat;
        padding: 7px 10px;
        border-radius: 10px;
        max-width: 60%;

        .author {
            font-size: 14px;
            font-weight: 500;
            margin-right: 10px;
        }
    }
}

.ismine {
    flex-direction: row-reverse;

    .message-content {
        background: #8abde6;
        color: white;
    }

    .message-info {
        flex-direction: row-reverse;

        .author {
            margin-right: 0;
            margin-left: 10px;
        }
    }
}
</style>
