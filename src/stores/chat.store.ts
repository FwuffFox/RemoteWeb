import { defineStore } from "pinia";
import { SignalrChatService } from "@/services/signalrChat.service";
import { HubConnectionState } from "@microsoft/signalr";
import type { Chat } from "@/models";
import { useAuthStore } from "./auth.store";

const AuthStore = useAuthStore();

export const useChatStore = defineStore({
    id: "chat",
    state: () => ({
        signal: null as SignalrChatService | null,
        chats: null as Chat[] | null,
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
            this.chats = signal.chats;
            console.debug("ch is: ", this.signal?.chats);
        },

        async send(messageBody: string, active_chat: string) {
            await this.signal?.sendMessage(messageBody, active_chat);
            this.signal?.addMessageToChat(
                { body: messageBody, sender: AuthStore.getUser, sentOn: new Date() },
                active_chat
            );
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
