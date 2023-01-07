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
        class="message-item"
        :class="{ ismine: user.username == message.sender }"
    >
        <v-avatar> {{ message.sender[1].toUpperCase() }}</v-avatar>
        <div class="message-content">
            <div class="message-info d-flex flex-wrap align-items-center">
                <span class="author">{{ message.sender }}</span>
            </div>
            <div class="content">{{ message.body }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.message-item {
    margin-bottom: 12px;
    display: flex;
    justify-content: flex-start;

    .message-content {
        font-size: 16px;
        background: #f7f8fa;
        padding: 7px 10px;
        border-radius: 10px;
        max-width: 60%;

        .content {
            word-wrap: break-word;
        }

        .author {
            font-size: 14px;
            font-weight: 500;
            margin-right: 10px;
            white-space: nowrap;
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
