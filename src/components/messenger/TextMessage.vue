<script setup lang="ts">
import type { IMessage } from "@/models/IMessage";
import { useAuthStore } from "@/stores/auth.store";

defineProps<{
    message: IMessage;
}>();

const { user } = useAuthStore();
</script>

<template>
    <div
        class="message-item d-flex justify-content-start"
        :class="{ ismine: user?.username === message.sender?.username }"
    >
        <v-avatar> {{ message.sender?.username.substring(1, 3).toUpperCase() }}</v-avatar>
        <div class="message-content">
            <div class="message-info d-flex flex-wrap align-items-center">
                <span class="author text-no-wrap">{{ message.sender.username }}</span>
            </div>
            <div class="content text-break">{{ message.body }}</div>
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
