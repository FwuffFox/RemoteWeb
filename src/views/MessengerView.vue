<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import { storeToRefs } from "pinia";

const auth = useAuthStore();
const user = storeToRefs(auth);

function logout() {
    auth.logout();
}
</script>

<template>
    <div class="page">
        <main class="app-container">
            <div id="sidebar"></div>
            <div id="main-content">
                <div class="room-header"></div>
                <div class="messages-container position-relative">
                    <div id="messages-list" class="list-unstyled">
                        <li style="color: black">{{ user.user }}</li>
                    </div>
                    <button v-on:click="logout">Logout</button>
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
}

#main-content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid gray;
}
</style>
