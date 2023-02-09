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
    public chats: Chat[];

    constructor() {
        this.chats = [] as Chat[];
        //console.debug("type is", typeof this.chats);      
        //console.debug("ch0: ", this.chats);
        // this.chats.push({
        //     interlocutor: {
        //         username: "one",
        //         fullName: "two",
        //         jobTitle: "lol",
        //         role: "kek",
        //     },
        //     chat_name: "chat1",
        //     messages: [
        //         {
        //             sender: {
        //                 username: "one",
        //                 fullName: "two",
        //                 jobTitle: "lol",
        //                 role: "kek",
        //             },
        //             body: "mess1",
        //             sentOn: new Date("2023-02-08T19:13:25.305Z"),
        //         },
        //         {
        //             sender: {
        //                 username: "one",
        //                 fullName: "two",
        //                 jobTitle: "lol",
        //                 role: "kek",
        //             },
        //             body: "mess2",
        //             sentOn: new Date("2024-02-08T19:13:25.305Z"),
        //         },
        //     ],
        // });
        // this.chats.push({
        //     interlocutor: {
        //         username: "one",
        //         fullName: "two",
        //         jobTitle: "lol",
        //         role: "kek",
        //     },
        //     chat_name: "chat12345678901234567890",
        //     messages: [
        //         {
        //             sender: {
        //                 username: "one",
        //                 fullName: "two",
        //                 jobTitle: "lol",
        //                 role: "kek",
        //             },
        //             body: "mess1",
        //             sentOn: new Date("2023-02-08T19:13:25.305Z"),
        //         },
        //         {
        //             sender: {
        //                 username: "one",
        //                 fullName: "two",
        //                 jobTitle: "lol",
        //                 role: "kek",
        //             },
        //             body: "mess2",
        //             sentOn: new Date("2024-02-08T19:13:25.305Z"),
        //         },
        //     ],
        // });

        console.debug("chat after constr: ", this.chats);
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
            .configureLogging(LogLevel.Information)
            .build());
    }

    private registerOnServerEvents() {
        this.hubConnection.on("OnConnected", (inp_chats: ChatInfo[]) => {
            console.debug("OnConnected()");
            console.debug("inp_chats" , inp_chats)
            for (let i = 0; i < inp_chats.length; ++i) {
                console.debug("add in ", i, ': ', inp_chats[i]);
                this.chats.push({
                    interlocutor: inp_chats[i].otherUser,
                    chat_name: inp_chats[i].otherUser.fullName,
                    messages: [] as Message[],
                });
                let from = 0;
                let to = 0;
                let arr_from = inp_chats[i].messagesFromMe;
                let arr_to = inp_chats[i].messagesToMe;
                while (from < arr_from.length && to < arr_to.length) {
                    if (new Date(arr_from[from].sentOn).getTime() < new Date(arr_to[to].sentOn).getTime()) {
                        // записываем в начале самые давние сообщения
                        this.chats[i].messages.push({
                            body: arr_from[from].body,
                            sentOn: arr_from[from].sentOn,
                            sender: AuthStore.getUser,
                        });
                        from++;
                    } else {
                        this.chats[i].messages.push({
                            body: arr_to[to].body,
                            sentOn: arr_to[to].sentOn,
                            sender: inp_chats[i].otherUser,
                        });
                        to++;
                    }
                }
                while(from < arr_from.length){
                    this.chats[i].messages.push({
                        body: arr_from[from].body,
                        sentOn: arr_from[from].sentOn,
                        sender: AuthStore.getUser,
                    });
                    from++;
                }
                while(to < arr_to.length){
                    this.chats[i].messages.push({
                        body: arr_to[to].body,
                        sentOn: arr_to[to].sentOn,
                        sender: inp_chats[i].otherUser,
                    });
                    to++;
                }
            }
            console.debug("Chats after connect ", this.chats);
        });

        this.hubConnection.on("OnGetMessage", (message: Message) => {
            console.debug("OnGetMessage()");
            
            console.debug("add mess: ", message);
            let found = this.chats[0];
            for (let i = 1; i < this.chats.length && found.interlocutor.username !== message.sender.username; ++i) {   
                const tmp = this.chats[i];
                this.chats[i] = found;
                found = tmp;
            }
            // if(i == this.chats.length){ console.log("chat not found");break;}
            found.messages.push(message);
            this.chats[0] = found;

            for(let i = 0; i < this.chats.length; i++){
                console.log(i, this.chats[i].interlocutor.username);  
            }
            console.debug("chats after add: ", this.chats);
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
