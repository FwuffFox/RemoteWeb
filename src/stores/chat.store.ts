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
        isConnected: (state): boolean => {
            return state.signal?.hubConnection.state == HubConnectionState.Connected;
        },
        getChats: (state): Chat[] => {
            return state.signal?.chats as Chat[];
        },
    },
    actions: {
        async connect() {
            console.debug("connect ");
            const signal = await SignalrChatService.init();
            this.signal = signal;
            console.debug("ch is: ", this.signal?.chats);
        },

        async send(messageBody: string, chatName: string) {
            await this.signal?.sendMessage(messageBody, chatName);
        },

        async getChatByUsername(username: string): Promise<Chat | null> {
            console.debug(`Trying to find chat with ${username}`);
            for (let i = 0; i < (this.signal?.chats as Chat[]).length; ++i) {
                if (this.signal?.chats[i].interlocutor.username === username) {
                    return this.signal.chats[i];
                }
            }
            return null;
        },

        async disconnect() {
            await this.signal?.disconnect();
            this.signal = null;
        },
    },
});
