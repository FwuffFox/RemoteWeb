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
            const messages = await fetchWrapper.get<any[]>(
                BASE_URL + "messages/general/100"
            );
            messages?.forEach(element => {
                const message: IMessage = {
                    body: element.body,
                    sender: element.sender.username,
                };
                this.messages.push(message);
            });
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("/api/general_chat", {
                    accessTokenFactory: () => authStore.token!,
                })
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.connection.on(
                "SendMessage",
                (sender: string, body: string) => {
                    const message: IMessage = {
                        body: body,
                        sender: sender,
                    };
                    this.messages.push(message);
                }
            );

            this.connection.onclose(() => {
                this.messages = [];
            });

            this.connection.start();
            console.log("Connected");
        },
        send(message: string) {
            try {
                this.connection?.invoke("SendMessage", message, user.username);
            } catch (error) {
                console.error(error);
            }
        },
    },
});
