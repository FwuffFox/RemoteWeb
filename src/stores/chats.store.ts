import { defineStore } from "pinia";
import signalR, { LogLevel } from "@microsoft/signalr";
import { useAuthStore } from "@/stores/auth.store";
import type { IPrivateChat } from "@/models/IPrivateChat";
import type { IPrivateMessage } from "@/models/IPrivateMessage";


export const useChatsStore = defineStore({
    id: "chats",
    state: () => ({
        chats: [],
        connection: null as signalR.HubConnection | null,
    }),
    actions: {
        async connect() {
            const authStore = useAuthStore();
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("/api/hubs/private_chat", {
                    accessTokenFactory: () => authStore.token!,
                })
                .configureLogging(LogLevel.Information)
                .build();

            this.connection.on("OnConnect", (chats: IPrivateChat[]) => {

            });

            this.connection.on("OnNewMessage", (message: IPrivateMessage) => {

            });
        }
    }
})