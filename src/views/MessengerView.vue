<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import TextMessage from "@/components/messenger/TextMessage.vue";
import MessengerSidebar from "@/components/messenger/MessengerSidebar.vue";
import { useRoute } from "vue-router";
import { useChatStore, useMessengerStore } from "@/stores";

const messengerStore = useMessengerStore();
const chatStore = useChatStore();
const { messages } = storeToRefs(messengerStore);

defineEmits(["click"]);

onBeforeMount(async () => {
    console.log("MessengerView mounted");
    if (!messengerStore.isConnected) await messengerStore.connect();
    if (!chatStore.isConnected) await chatStore.connect();
});

const input = ref("");

async function sendMessage() {
    if (!messengerStore.isConnected || input.value.length == 0) return;
    await messengerStore.send(input.value);
    input.value = "";
    //input.focus();
}
const route = useRoute();

const isLoading = computed(() => !messengerStore.isConnected);

const sidebarHidden = ref(false);
</script>

<template>
    <div class="d-block">
        <main class="app-container">
            <v-dialog persistent v-model="isLoading">
                <v-progress-circular indeterminate color="orange" :size="100" :width="12" />
            </v-dialog>
            <MessengerSidebar :class="{ 'w-0': sidebarHidden }" />
            <div id="main-content">
                <div class="header d-flex">
                    <button @click="sidebarHidden = !sidebarHidden">
                        <v-icon class="mr-2" icon="mdi-arrow-left" />
                    </button>
                    <h5>Главный чат</h5>
                </div>
                <div class="messages-container position-relative">
                    <ul id="messages-list" class="list-unstyled">
                        <li v-for="message in messages" :key="message.body">
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
    overflow: scroll;

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

@media screen and (max-width: 420px) {
    #sidebar {
        min-width: 40px !important;
        width: 50% !important;
    }
}
</style>
