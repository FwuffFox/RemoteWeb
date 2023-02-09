import { type HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useAuthStore } from "@/stores/auth.store";
import type { User, MessageWithoutSender, Message, Chat } from "@/models";

const AuthStore = useAuthStore();

export type ChatInfo = {
    otherUser: User;
    //chat_name: string;   сейчас чат называется как имя собеседника
    messagesFromMe: MessageWithoutSender[];
    messagesToMe: MessageWithoutSender[];
};

export class SignalrChatService {
    public hubConnection: HubConnection = this.createConnection();
    public chats: Chat[] = [];

    constructor() {
        this.chats = [];
        this.chats.push({
            interlocutor: {
                username: "one",
                fullName: "two",
                jobTitle: "lol",
                role: "kek",
            },
            chat_name: "chat1",
            messages: [
                {
                    sender: {
                        username: "one",
                        fullName: "two",
                        jobTitle: "lol",
                        role: "kek",
                    },
                    body: "mess1",
                    sentOn: new Date("2023-02-08T19:13:25.305Z"),
                },
                {
                    sender: {
                        username: "one",
                        fullName: "two",
                        jobTitle: "lol",
                        role: "kek",
                    },
                    body: "mess2",
                    sentOn: new Date("2024-02-08T19:13:25.305Z"),
                },
            ],
        });
        this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
        console.log(typeof this.chats);
    }

    private createConnection(): HubConnection {
        return (this.hubConnection = new HubConnectionBuilder()
            .withUrl("/api/hubs/private_chat", {
                accessTokenFactory: () => useAuthStore().token!,
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build());
    }

    private registerOnServerEvents() {
        this.hubConnection.on("OnConnected", (chats: ChatInfo[]) => {
            console.debug("OnConnected()");
            console.log(chats);
            for (let i = 0; i < chats.length; ++i) {
                this.chats.push({
                    interlocutor: chats[i].otherUser,
                    chat_name: chats[i].otherUser.fullName,
                    messages: [] as Message[],
                });
                let from = 0,
                    to = 0;
                const arr_from = chats[i].messagesFromMe,
                    arr_to = chats[i].messagesToMe;

                while (from < arr_from.length || to < arr_to.length) {
                    if (
                        from < arr_from.length &&
                        new Date(arr_from[from].sentOn).getTime() < new Date(arr_to[to].sentOn).getTime()
                    ) {
                        // записываем в начале самые давние сообщения
                        this.chats[i].messages.push({
                            body: arr_from[from].body,
                            sentOn: arr_from[from].sentOn,
                            sender: AuthStore.getUser,
                        });
                        from++;
                    } else {
                        this.chats[i].messages.push({
                            body: arr_from[to].body,
                            sentOn: arr_from[to].sentOn,
                            sender: chats[to].otherUser,
                        });
                        to++;
                    }
                }
            }
            console.log("Chats after connect ", this.chats);
        });

        this.hubConnection.on("OnGetMessage", (message: Message) => {
            console.debug("OnGetMessage()");

            let found = this.chats[0];
            for (let i = 1; i < this.chats.length; ++i) {
                if (found.interlocutor.username === message.sender.username) {
                    found.messages.push(message);
                    this.chats[0] = found;
                    break;
                } else {
                    const tmp = this.chats[i];
                    this.chats[i] = found;
                    found = tmp;
                }
            }
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
        console.log(`Sent message ${messageBody} to ${chatName}`);
    }

    public async getChatInfo(chatName: string) {
        const chatInfo = await this.hubConnection.invoke<ChatInfo>("GetChatInfo", chatName);
    }

    public disconnect() {
        this.hubConnection?.stop();
        console.log("Hub connection stopped");
    }
}
