import { type HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useAuthStore } from "@/stores/auth.store";
import type { User, MessageWithoutSender, Message } from "@/models";



export type ChatInfo = {
    user: User;
    //chat_name: string;   сейчас чат называется как имя собеседника
    messagesFromMe: MessageWithoutSender[];
    messagesToMe: MessageWithoutSender[];
};

export class SignalrChatService {
    public hubConnection: HubConnection = this.createConnection();
    public chats!: {interlocutor: User, chat_name: string; message: MessageWithoutSender[]; }[]; // TODO: Структура что-бы хранить чаты.

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
            for(var i = 0; i < chats.length; ++i){
                this.chats.push({interlocutor: chats[i].user, chat_name: chats[i].user.fullName, message: [] as MessageWithoutSender[]});
                var from = 0, to = 0
                var arr_from = chats[i].messagesFromMe, arr_to = chats[i].messagesToMe;

                while(from < arr_from.length || to < arr_to.length){
                    if(from < arr_from.length && arr_from[from].sendTime.getTime() < arr_to[to].sendTime.getTime()){   // записываем в начале самые давние сообщения
                        this.chats[i].message.push(arr_from[from]);
                        from++;
                    }else{
                        this.chats[i].message.push(arr_to[from]);
                        to++;
                    }
                }
            }
            // TODO: Распаковка чатов при соединении.
        });

        this.hubConnection.on("OnGetMessage", (message: Message) => {
            message.sender;

            var found = this.chats[0];
            for(var i = 1; i < this.chats.length; ++i){
                if(found.interlocutor.username === message.sender.username){
                    found.message.push({body: message.body, sendTime: message.sendTime});
                    this.chats[0] = found;
                    break;
                } else{
                    const tmp = this.chats[i];
                    this.chats[i] = found;
                    found = tmp;
                }
            }
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
