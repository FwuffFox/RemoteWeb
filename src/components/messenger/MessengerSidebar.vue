<script setup lang="ts">
import LogoutButton from "@/components/LogoutButton.vue";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, type Ref } from "vue";
import ChatSelectButton from "@/components/messenger/ChatSelectButton.vue";
import type { User, Chat } from "@/models";
import { useAuthStore, useChatStore } from "@/stores";

const chatStore = useChatStore();
const authStore = useAuthStore();

let user: Ref<User>;
let chats: Ref<Chat[]>;
const { getChats } = storeToRefs(chatStore);
onBeforeMount(() => {
    user = storeToRefs(useAuthStore()).user as Ref<User>;
    chats = getChats;
    console.debug("chats are: ", chats.value);
});
</script>

<template>
    <div id="sidebar">
        <div class="header">
            <h4>REMOTE</h4>
        </div>
        <RouterLink
            class="py-2 px-2 w-100 mb-0 d-flex flex-row justify-content-center h4 text-white orange-hover"
            to="/"
            >Главный чат</RouterLink
        >
        <div class="overflow-y-auto list-unstyled">
            <ChatSelectButton v-for="chat in chats" :key="chat.chat_name" :chat="chat" />
        </div>
        <div class="profile">
            <div class="d-flex align-items-center flex-grow-1">
                <v-avatar class="me-2" size="50" color="blue">
                    <span>{{ user?.username.substring(1, 3).toUpperCase() }}</span>
                </v-avatar>
                <a v-if:="user">{{ user?.fullName }}</a>
            </div>
            <LogoutButton @press="authStore.logout" />
        </div>
    </div>
</template>

<style scoped lang="scss">
#sidebar {
    display: flex;
    flex-direction: column;
    background-color: orange;
    color: white;
    transition: 0.5s;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        padding: 20px;

        h5 {
            font-size: 20px;
            font-weight: 500;
            text-transform: uppercase;
            margin: 0;
        }
    }

    .profile {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: rgba(0, 0, 0, 0.1);
        margin-top: auto;

        a {
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 180px;
        }
    }
}
</style>
