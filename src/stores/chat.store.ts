import { defineStore } from "pinia";
import { SignalrChatService } from "@/services/signalrChat.service";
import signalR from "@microsoft/signalr";
import { string } from "yup";

export const useChatStore = defineStore({
    id: "chat",
    state: () => ({
        signal: null as SignalrChatService | null,
    }),
    getters: {
        isConnected: (state) => {
            return state.signal?.hubConnection.state == signalR.HubConnectionState.Connected;
        },
        getChats: (state) => {
            return null;
            // TODO: Return chats
        },
        getChatNames: (state): string[] => {
            return [];
        }
    },
    actions: {
        async connect() {
            this.signal = new SignalrChatService();
        },

        async send(messageBody: string, chatName: string) {
            await this.signal?.sendMessage(messageBody, chatName);
        },

        async disconnect() {
            this.signal?.disconnect();
            this.signal = null;
        },
    },
});
