import { defineStore } from "pinia";
import type { IMessage } from "@/models/IMessage";
import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "./auth.store";

const authStore = useAuthStore();
const { user } = authStore;

const BASE_URL = `${window.location.origin}/api`;

export const useMessengerStore = defineStore({
    id: "messenger",
    state: () => ({
        messages: [] as IMessage[],
        connection: null as signalR.HubConnection | null,
    }),
    getters: {
        isConnected: (state) => {
            return (
                state.connection?.state == signalR.HubConnectionState.Connected
            );
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
                this.messages.push(message);
            });
            
            this.connection.on("OnConnection", (messages: IMessage[]) => {
                this.messages = messages;
            });
            
            const start = async () => {
                try {
                    await this.connection?.start();
                    console.log("SignalR connected");
                } catch (err) {
                    console.error(err);
                    console.log("Trying to reconnect...");
                    setTimeout(start, 5000);
                }
            }
            this.connection.onclose(async () => {
                await start()
            });

            await start();
        },
        async send(message: string) {
            try {
                await this.connection?.invoke(
                    "SendMessage",
                    message,
                    user?.username
                );
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
