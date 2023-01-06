<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { storeToRefs } from "pinia";
import LogoutButton from "@/components/LogoutButton.vue";
import { ref } from "vue";

const auth = useAuthStore();
const { user } = storeToRefs(auth);

interface Message {
    body: string;
    sender: string;
}
const messages: Message[] = [
    { body: "AAAAAA!", sender: "@anon" },
    { body: "BBBBBB!", sender: "@anon" },
    { body: "AAAAA!!!", sender: "@anon" },
];
const messagesRef = ref(messages);

const input = ref("");

function sendMessage() {
    messages.push({
        body: input.value,
        sender: user.value.username,
    } as Message);
    input.value = "";
    console.log(messages);
}
</script>

<template>
    <div class="page">
        <main class="app-container">
            <div id="sidebar">
                <div class="header">
                    <h5>Чаты</h5>
                </div>
                <div class="profile">
                    <div class="d-flex align-items-center flex-grow-1">
                        <v-avatar class="me-2" size="50" color="blue">
                            <span>CJ</span>
                        </v-avatar>
                        <a>{{ (user.fullName as string).split(" ")[1] }}</a>
                    </div>
                    <LogoutButton />
                </div>
            </div>
            <div id="main-content">
                <div class="header">
                    <h5>Название чата</h5>
                </div>
                <div class="messages-container position-relative">
                    <div id="messages-list" class="list-unstyled">
                        <li v-for="message in messagesRef" :key="message.body">
                            {{ message }}
                        </li>
                    </div>
                </div>
                <div class="message-input-container">
                    <input
                        id="message-input"
                        type="text"
                        placeholder="What's on your mind?"
                        v-model="input"
                    />
                    <div class="actions d-flex align-items-center">
                        <a
                            role="button"
                            id="btn-send-message"
                            @click="sendMessage"
                        >
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
                                <polygon
                                    points="22 2 15 22 11 13 2 9 22 2"
                                ></polygon>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style lang="scss">
.page {
    display: block;
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
</style>
