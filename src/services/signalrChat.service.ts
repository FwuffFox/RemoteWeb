import { type HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useAuthStore } from "@/stores/auth.store";
import type { PrivateChat } from "@/models/PrivateChat";
import type { ChatMessage } from "@/models/ChatMessage";
import { reactive, ref } from "vue";
import type { User } from "@/models";
export type ChatInfo = {
    user: User;
    messagesFromMe: ChatMessage[];
    messagesToMe: ChatMessage[];
};

export type MessageWithSender = {
    sender: User;
    message: ChatMessage;
};
export class SignalrChatService {
    public hubConnection: HubConnection = this.createConnection();
    public chats: any;

    constructor() {
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
    }

    private createConnection(): HubConnection {
        return (this.hubConnection = new HubConnectionBuilder()
            .withUrl("/api/hubs/private_chat", {
                accessTokenFactory: () => useAuthStore().token!,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Debug)
            .build());
    }

    private registerOnServerEvents() {
        this.hubConnection.on("OnConnect", (chats: ChatInfo[]) => {
            //
        });

        this.hubConnection.on("OnGetMessage", (message: MessageWithSender) => {});
    }

    private startConnection() {
        if (this.hubConnection.state === HubConnectionState.Connected) {
            return console.error("Connection already started");
        }

        this.hubConnection.start().then(() => {
            console.log("Hub connection started");
        });
    }

    public async sendMessage(messageBody: string, chatName: string) {
        await this.hubConnection.invoke("SendMessage", messageBody, chatName);
    }

    public async getChatInfo(chatName: string) {
        const chatInfo = await this.hubConnection.invoke<ChatInfo>("GetChatInfo", chatName);
    }
}
