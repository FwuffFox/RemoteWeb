import { type HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useAuthStore } from "@/stores/auth.store";
import type { Message, Message_text } from "@/models/ChatMessage";
import type { Chat, User } from "@/models";

type NewMessage = {
    chat_name: string;
    message: Message;
};

export class SignalrChatService {
    public hubConnection: HubConnection = this.createConnection();
    public chats_list = [] as Chat[]; // TODO: Структура что-бы хранить чаты.

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
        this.hubConnection.on("OnConnect", (chats: Chat[]) => {
            console.debug("All"); // TODO: Распаковка чатов при соединении.
            
            this.chats_list = chats;
        });

        this.hubConnection.on("OnGetMessage", (message: NewMessage) => {
            console.debug("one");


            // TODO: Добавление сообщения.
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

    public async getChatInfo(chatName: string) {
        const chatInfo = await this.hubConnection.invoke<Chat>("GetChatInfo", chatName);
    }
}
