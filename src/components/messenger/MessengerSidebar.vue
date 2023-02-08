<script setup lang="ts">
import LogoutButton from "@/components/LogoutButton.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth.store";
import { onBeforeMount, type Ref } from "vue";
import type { User } from "@/models/User";
import ChatSelectButton from "@/components/messenger/ChatSelectButton.vue";
import {Message, Message_text} from "@/models/ChatMessage";
import type {Chat} from "@/models/Chat";

let user: Ref<User>;
onBeforeMount(() => {
    user = storeToRefs(useAuthStore()).user as Ref<User>;
});

let chats_list = [] as Chat[];

chats_list.push({});
chats_list[0].chat_name = "chat_one";
chats_list[0].messages?.push(new Message_text({username: "name", fullName: "fullname", jobTitle: "job", role: "role" }, new Date("2020-05-12T23:50:21.817Z"), "message1"));
chats_list[0].messages?.push(new Message_text({username: "name", fullName: "fullname", jobTitle: "job", role: "role" }, new Date("2020-06-12T23:50:21.817Z"), "message2"));
chats_list.push({});
chats_list[1].chat_name = "chat_two";
chats_list[1].messages?.push(new Message_text({username: "name", fullName: "fullname", jobTitle: "job", role: "role" }, new Date("2020-05-12T23:50:21.817Z"), "message1"));
chats_list[1].messages?.push(new Message_text({username: "name", fullName: "fullname", jobTitle: "job", role: "role" }, new Date("2020-06-12T23:50:21.817Z"), "message2"));
</script>

<template>
    <div id="sidebar">
        <div class="header">
            <h5>Чаты</h5>
        </div>

        <div class="overflow-y-auto list-unstyled">
            <li v-for="ch in chats_list">
                <ChatSelectButton :chat="ch"/>
            </li>
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
