import { defineStore } from "pinia";
import type { IMessage } from "@/models/IMessage";
import * as signalR from "@microsoft/signalr";
import { useAuthStore } from "./auth.store";
import { fetchWrapper } from "@/services/fetch-wrapper";

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
            this.messages = (await fetchWrapper.get<IMessage[]>(
                BASE_URL + "messages/general/100"
            )) as IMessage[];
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("/api/general_chat", {
                    accessTokenFactory: () => authStore.token!,
                })
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.connection.on("ReceiveMessage", (message: IMessage) => {
                this.messages.push(message);
            });

            this.connection.onclose(() => {
                this.messages = [];
            });

            await this.connection.start();
            console.log("Connected");
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
