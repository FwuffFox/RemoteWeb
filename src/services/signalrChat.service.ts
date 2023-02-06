import { type HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useAuthStore } from "@/stores/auth.store";
import { User, ChatMessage, Message } from "@/models";

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
    public chats: {chat_name: string, message: Message[]}[]; // TODO: Структура что-бы хранить чаты.

    constructor() {
        this.chats = new Map<string, Message[]>();
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
            for(var i = 0; i < chats.length; ++i){
                this.chats.push({chat_name: chats[i].user.fullName, message: [] as Message[]});
                var form = 0, to = 0
                var arr_from = chats[i].messagesFromMe, arr_to = chats[i].messagesToMe;
                while(from < arr_from.length && to < arr_to.length){
                    if(arr_from[from].sendTime.getTime() < arr_to[to].sendTime.getTime()){
                        this.chats[i].message.push(arr_from[from].body);
                        from++;
                    }else{
                        this.chats[i].message.push(arr_to[from].body);
                        to++;
                    }

                }
            }
            // TODO: Распаковка чатов при соединении.
        });

        this.hubConnection.on("OnGetMessage", (message: MessageWithSender) => {
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
        const chatInfo = await this.hubConnection.invoke<ChatInfo>("GetChatInfo", chatName);
    }

    public disconnect() {
        this.hubConnection?.stop();
    }
}
