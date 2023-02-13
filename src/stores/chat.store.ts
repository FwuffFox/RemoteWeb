import { defineStore } from "pinia";
import { SignalrChatService } from "@/services/signalrChat.service";
import type { Chat } from "@/models";
import { useAuthStore } from "./auth.store";


export const useChatStore = defineStore({
    id: "chat",
    state: () => ({
        signal: null as SignalrChatService | null,
        update_flag: Boolean(false),
    }),
    getters: {
        isConnected: (state): boolean => {
            return state.signal?.flag_OnConnected!;
        },
        getChats: (state): Chat[] => {
            return state.signal?.chats as Chat[];
        },
    },
    actions: {
        async update_chat(){
            this.update_flag = !this.update_flag;
            console.info("UPDATE");
        },

        async connect() {
            console.debug("connect ");
            const signal = await SignalrChatService.init();
            this.signal = signal;
            console.debug("ch is: ", this.signal?.chats);
        },

        async send(messageBody: string, active_chat: string) {
            await this.signal?.sendMessage(messageBody, active_chat);
            this.signal?.addMessageToChat(
                { body: messageBody, sender: useAuthStore().getUser, sentOn: new Date() },
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
