import { type HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useAuthStore } from "@/stores/auth.store";
import type { PrivateChat } from "@/models/PrivateChat";
import type { PrivateMessage } from "@/models/PrivateMessage";
import { reactive, ref } from "vue";

export class SignalrChatService {
    public hubConnection: HubConnection = this.createConnection();
    public chats: PrivateChat[] = [];

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
        this.hubConnection.on("OnConnect", (chats: PrivateChat[]) => {
            this.chats = chats;
        });

        this.hubConnection.on("OnNewMessage", (message: PrivateMessage) => {
            this.chats.find((chat) => message.sender.username === chat.name)?.messages?.push(message);
        });

        this.hubConnection.on("OnNewChatCreate", (chat: PrivateChat) => {
            this.chats.push(chat);
        });
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
}
