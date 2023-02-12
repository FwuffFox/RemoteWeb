<script setup lang="ts">
import { useChatStore } from "@/stores/chat.store";
import { computed, onBeforeMount, onUpdated, type Ref, ref, watch } from "vue";
import { useRoute } from "vue-router";
import MessengerSidebar from "@/components/messenger/MessengerSidebar.vue";
import TextMessage from "@/components/messenger/TextMessage.vue";
import type { Chat } from "@/models";

defineEmits(["click", "click", "click"]);

const chatStore = useChatStore();
const route = useRoute();

let chat: Ref<Chat> = ref({} as Chat);

watch(route, async (newValue, oldValue) => {
    chat.value = (await chatStore.getChatByUsername(newValue.params.chatName as string)) as Chat;
    console.log("After route change: ", chat.value);
});

onUpdated(() => {
    console.debug("On page updated");
    //document.getElementById("input")?.focus();
        
    //input.focus();
});

const flag = ref(false);
onBeforeMount(async () => {

    if (!chatStore.isConnected) {
        console.debug("Awaiting connect from ChatView");
        await chatStore.connect();
        console.debug("Finished awaiting connect from ChatView");
    }


    chat.value = (await chatStore.getChatByUsername(route.params.chatName as string)) as Chat;
    console.log("OnChatMount: ", chat.value);

    setInterval(() => {
        flag.value = !flag.value;
        console.log("Force update");
    }, 5000);
});

const input = ref("");

async function sendMessage() {
    //console.debug("send message to: ", route.params.chatName);
    if (!chatStore.isConnected || input.value.length == 0) return;
    await chatStore.send(input.value, route.params.chatName as string);
    input.value = "";
}

const isLoading = computed(() => !chatStore.isConnected);

const sidebarHidden = ref(true);
</script>

<template>
    <div class="d-block">
        <main class="app-container d-flex vh-100 justify-content-between">
            <v-dialog persistent v-model="isLoading" :key="flag">
                <v-progress-circular indeterminate color="orange" :size="100" :width="12" />
            </v-dialog>
            <MessengerSidebar :class="{'w-0': sidebarHidden}" :key="flag"/>
            <div id="main-content">
                <div class="header d-flex" :key="flag">
                    <button @click="sidebarHidden = !sidebarHidden">
                        <v-icon class="mr-2" icon="mdi-arrow-left" />
                    </button>
                    <h5>{{ route.params.chatName }}</h5>
                </div>
                <div class="messages-container position-relative" :key="flag">
                    <ul v-if="chat != null" id="messages-list" class="list-unstyled">
                        <li v-for="message in chat?.messages" :key="message">
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
        width: 35%;
    }

    #main-content {
        flex-grow: 1;
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

#main-content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid gray;

    .header {
        height: 50px;
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
</style>
