import { type HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useAuthStore } from "@/stores/auth.store";
import type { User, MessageWithoutSender, Message, Chat } from "@/models";

const AuthStore = useAuthStore();

export type ChatInfo = {
    interlocutor: User;
    //chat_name: string;   сейчас чат называется как имя собеседника
    messagesFromMe: MessageWithoutSender[];
    messagesToMe: MessageWithoutSender[];
};

export class SignalrChatService {
    public hubConnection: HubConnection = this.createConnection();
    public chats: Chat[]; // TODO: Структура что-бы хранить чаты.

    constructor() {
        this.chats = new Array(0);
        this.chats.push({interlocutor:
             {
                username: "one",
                fullName: "two",
                jobTitle: "lol",
                role: "kek",
            },
            chat_name: "chat1",
             message: [{
                sender: {
                    username: "one",
                    fullName: "two",
                    jobTitle: "lol",
                    role: "kek",
                },
                body: "mess1",
                sendTime: new Date("2023-02-08T19:13:25.305Z"),
            },{
                sender: {
                    username: "one",
                    fullName: "two",
                    jobTitle: "lol",
                    role: "kek",
                },
                body: "mess2",
                sendTime: new Date("2024-02-08T19:13:25.305Z"),
            }]
            });
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
            console.debug("OnConnect()");
            for(var i = 0; i < chats.length; ++i){
                this.chats.push({interlocutor: chats[i].interlocutor, chat_name: chats[i].interlocutor.fullName, message: [] as Message[]});
                var from = 0, to = 0
                var arr_from = chats[i].messagesFromMe, arr_to = chats[i].messagesToMe;

                while(from < arr_from.length || to < arr_to.length){
                    if(from < arr_from.length && arr_from[from].sendTime.getTime() < arr_to[to].sendTime.getTime()){   // записываем в начале самые давние сообщения
                        this.chats[i].message.push({body: arr_from[from].body, sendTime: arr_from[from].sendTime, sender: AuthStore.getUser});
                        from++; 
                    } else{
                        this.chats[i].message.push({body: arr_from[to].body, sendTime: arr_from[to].sendTime, sender: chats[to].interlocutor});
                        to++;
                    }
                }
            }
            // TODO: Распаковка чатов при соединении.
        });

        this.hubConnection.on("OnGetMessage", (message: Message) => {
            console.debug("OnGetMessage()");

            var found = this.chats[0];
            for(var i = 1; i < this.chats.length; ++i){
                if(found.interlocutor.username === message.sender.username){
                    found.message.push(message);
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
