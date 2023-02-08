import { defineStore } from "pinia";
import { SignalrChatService } from "@/services/signalrChat.service";
import { HubConnectionState } from "@microsoft/signalr";
import type { Chat } from "@/models";

export const useChatStore = defineStore({
    id: "chat",
    state: () => ({
        signal: null as SignalrChatService | null,
    }),
    getters: {
        isConnected: (state) => {
            return state.signal?.hubConnection.state == HubConnectionState.Connected;
        },
        // getChats: (state)/*: Chat[]*/ => {
        //     return state.signal?.chats;
        // },
        getChats: (state): Chat[] => {
            return state.signal?.chats as Chat[];
        },
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
