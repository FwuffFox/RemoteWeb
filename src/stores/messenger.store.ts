import { defineStore, storeToRefs } from "pinia";
import type { IMessage } from "@/models/IMessage";
import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "./auth.store";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

export const useMessengerStore = defineStore({
    id: "messenger",
    state: () => ({
        messages: [] as IMessage[],
        connection: null as signalR.HubConnection | null,
    }),
    getters: {
        isConnected: (store) => {
            return store.connection?.state == signalR.HubConnectionState.Connected;
        },
    },
    actions: {
        async connect() {
            const authStore = useAuthStore();
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("/api/hubs/general_chat", {
                    accessTokenFactory: () => authStore.token!,
                })
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.connection.on("OnReceiveMessage", (message: IMessage) => {
                console.debug(message);
                this.messages.push(message);
            });

            this.connection.on("OnConnect", (messages: IMessage[]) => {
                this.messages = messages;
            });

            const start = async () => {
                await this.connection?.start();
                console.log("SignalR connected");
            };

            this.connection.onclose(async () => {
                await start();
            });

            await start();
        },
        async send(message: string) {
            try {
                await this.connection?.invoke("SendMessage", message, user.value?.username);
            } catch (error) {
                console.error(error);
            }
        },
        async disconnect() {
            await this.connection?.stop();
            console.log("SignalR disconnected");
        },
    },
});
