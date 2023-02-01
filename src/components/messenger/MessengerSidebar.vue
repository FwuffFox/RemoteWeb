<script setup lang="ts">
import LogoutButton from "@/components/LogoutButton.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth.store";
import { onBeforeMount, type Ref } from "vue";
import type { IUser } from "@/models/IUser";
import ChatSelectButton from "@/components/messenger/ChatSelectButton.vue";
import type { IPrivateChat } from "@/models/IPrivateChat";

let user: Ref<IUser>;
onBeforeMount(() => {
    user = storeToRefs(useAuthStore()).user as Ref<IUser>;
});

const fakeChat1 = {
    users: [{username: "@test1"}, {username: "@admin"}]
} as IPrivateChat

const fakeChat2 = {
    users: [{username: "@admin"}, {username: "@test2"}]
} as IPrivateChat

</script>

<template>
    <div id="sidebar">
        <div class="header">
            <h5>Чаты</h5>
        </div>
        <div class="overflow-y-auto list-unstyled">
            <ChatSelectButton :chat="fakeChat1" />
            <ChatSelectButton :chat="fakeChat2" />
        </div>
        <div class="profile">
            <div class="d-flex align-items-center flex-grow-1">
                <v-avatar class="me-2" size="50" color="blue">
                    <span>CJ</span>
                </v-avatar>
                <a v-if:="user">{{ user?.fullName.split(" ")[1] }}</a>
            </div>
            <LogoutButton />
        </div>
    </div>
</template>

<style scoped lang="scss">
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
</style>
