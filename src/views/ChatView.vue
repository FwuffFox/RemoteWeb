<script setup lang="ts">
import { useChatStore } from "@/stores/chat.store";
import { onBeforeMount, onBeforeUnmount, type Ref, ref } from "vue";
import { useRoute } from "vue-router";
import MessengerSidebar from "@/components/messenger/MessengerSidebar.vue";
import TextMessage from "@/components/messenger/TextMessage.vue";
import type { Chat } from "@/models";

const chatStore = useChatStore();
const route = useRoute();

let chat: Ref<Chat | null>;
onBeforeMount(async () => {
    await chatStore.connect();
    console.log("awaiting");
    chat = ref(await chatStore.getChatByUsername(route.params.chatName as string)) as Ref<Chat | null>;
    console.log("OnChatMount: ", chat.value);
});
// TODO: Сообщения для данного чата.

const input = ref("");

async function sendMessage() {
    if (!chatStore.isConnected || input.value.length == 0) return;
    await chatStore.send(input.value, route.params.chatName as string);
    input.value = "";
}

const isLoading = chatStore.isConnected;

onBeforeUnmount(async () => {
   await chatStore.disconnect();
});
</script>

<template>
    <div class="d-block">
        <main class="app-container">
            <v-dialog persistent v-model="isLoading">
                <v-progress-circular indeterminate color="orange" :size="100" :width="12" />
            </v-dialog>
            <MessengerSidebar />
            <div id="main-content">
                <div class="header">
                    <h5>{{ route.params.chatName }}</h5>
                </div>
                <div class="messages-container position-relative">
                    <ul id="messages-list" class="list-unstyled">
                        <li v-for="message in chat?.messages">
                            <TextMessage :message="message" />
                        </li>
                    </ul>
                </div>
                <div class="message-input-container">
                    <input
                        id="message-input"
                        type="text"
                        placeholder="Сообщение"
                        v-model="input"
                        @keyup.enter="sendMessage"
                    />
                    <div class="actions d-flex align-items-center">
                        <a role="button" id="btn-send-message" @click="sendMessage">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-send"
                            >
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style lang="scss">
.v-overlay__content {
    align-items: center;
}
.app-container {
    display: flex;
    height: 100vh;
    justify-content: space-between;
    background-color: white;

    #sidebar {
        width: 270px;
        min-width: 270px;
    }

    #main-content {
        flex-grow: 1;
    }

    .room-header {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    .messages-container {
        overflow-y: auto;
        flex-grow: 1;
        padding: 10px;

        // We add those two lines to make messenger window always display last sent message
        // (Autoscroll?)
        display: flex;
        flex-direction: column-reverse;
    }
}

#sidebar {
    display: flex;
    flex-direction: column;
    background-color: orange;
    color: white;

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

#main-content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid gray;

    .header {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #eee;
    }

    .message-input-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f5f5f5;
        margin: 20px;
        padding: 5px;
        border-radius: 10px;
        position: relative;

        input {
            width: 100%;
            border: none;
            background: inherit;
            outline: 0;
            padding: 10px 20px;
        }

        .actions {
            padding: 0 10px;
        }
    }
}

@media screen and (max-width: 480px) {
    #sidebar {
        display: none;
    }
}
</style>
