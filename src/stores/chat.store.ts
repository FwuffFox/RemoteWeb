import { defineStore } from "pinia";
import type { PrivateChat } from "@/models";
import { SignalrChatService } from "@/services/signalrChat.service";

export const useChatStore = defineStore({
    id: "chat",
    state: () => ({
        signal: new SignalrChatService(),
    }),
    getters: {
        getChats: (state) => {
            return null;
            // TODO: Return chats
        },
    },
    actions: {
        async send(messageBody: string, chatName: string) {
            await this.signal.sendMessage(messageBody, chatName);
        },
    },
});
