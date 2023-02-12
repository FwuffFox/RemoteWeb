import { type HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useAuthStore } from "@/stores/auth.store";
import type { User, MessageWithoutSender, Message, Chat } from "@/models";

export type ChatInfo = {
    otherUser: User;
    //chat_name: string;   сейчас чат называется как имя собеседника
    messagesFromMe: MessageWithoutSender[];
    messagesToMe: MessageWithoutSender[];
};

export class SignalrChatService {
    public hubConnection: HubConnection = this.createConnection();
    public chats: Chat[] = [];
    public flag_OnConnected: boolean = false;

    public static async init(): Promise<SignalrChatService> {
        const signal = new SignalrChatService();
        console.debug("starting... flag_OnConnected = ", signal.flag_OnConnected);
        signal.chats = [] as Chat[];
        signal.createConnection();
        signal.registerOnServerEvents();
        await signal.startConnection();

        console.debug("waiting... flag_OnConnected = ", signal.flag_OnConnected);
        while (!signal.flag_OnConnected) {
            await new Promise((resolve) => setTimeout(resolve, 5));
        }
        console.debug("finish! flag_OnConnected = ", signal.flag_OnConnected);

        return signal;
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
            this.flag_OnConnected = false;
            console.debug("OnConnected()");
            console.debug("inp_chats", inp_chats);
            for (let i = 0; i < inp_chats.length; ++i) {
                console.debug("add in ", i, ": ", inp_chats[i]);
                this.chats.push({
                    interlocutor: inp_chats[i].otherUser,
                    chat_name: inp_chats[i].otherUser.username,
                    messages: [] as Message[],
                });
                let from = 0;
                let to = 0;
                const arr_from = inp_chats[i].messagesFromMe;
                const arr_to = inp_chats[i].messagesToMe;
                while (from < arr_from.length && to < arr_to.length) {
                    if (arr_from[from].sentOn < arr_to[to].sentOn) {
                        // записываем в начале самые давние сообщения
                        this.chats[i].messages.push({
                            body: arr_from[from].body,
                            sentOn: arr_from[from].sentOn,
                            sender: useAuthStore().getUser,
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
                while (from < arr_from.length) {
                    this.chats[i].messages.push({
                        body: arr_from[from].body,
                        sentOn: arr_from[from].sentOn,
                        sender: useAuthStore().getUser,
                    });
                    from++;
                }
                while (to < arr_to.length) {
                    this.chats[i].messages.push({
                        body: arr_to[to].body,
                        sentOn: arr_to[to].sentOn,
                        sender: inp_chats[i].otherUser,
                    });
                    to++;
                }
            }

            // console.debug("Chats before sort: ");
            // for(let i = 0; i < this.chats.length; ++i){
            //     console.debug(i, "is", this.chats[i]);
            // }
            this.chats.sort((a: Chat, b:Chat) => {return ((a.messages[a.messages.length - 1].sentOn< b.messages[b.messages.length - 1].sentOn) ? -1 : 1);});

            console.debug("Chats after connect ");
            for(let i = 0; i < this.chats.length; ++i){
                console.debug(i, this.chats[i]);
            }

            this.flag_OnConnected = true;   // для завершения загрузки
        });

        this.hubConnection.on("OnGetMessage", (message: any) => {
            this.addMessageToChat(
                { body: message.message.body, sender: message.sender, sentOn: message.message.sentOn },
                message.sender.username
            );
        });
    }

    private async startConnection() {
        if (this.hubConnection.state === HubConnectionState.Connected) {
            return console.error("Connection already started");
        }

        await this.hubConnection.start().then(() => {
            console.log("Hub connection started");
        });
    }

    public async sendMessage(messageBody: string, chatName: string) {
        await this.hubConnection.invoke("SendMessage", messageBody, chatName);
        console.log(`Sent message ${messageBody} to ${chatName}`);
    }

    public async addMessageToChat(message: Message, active_chat: string) {
        console.log("New message: ", message, "in active_chat: ", active_chat);

        let found = this.chats[0];
        for (let i = 1; i < this.chats.length && found.interlocutor.username !== active_chat; ++i) {
            const tmp = this.chats[i];
            this.chats[i] = found;
            found = tmp;
        }
        if(this.chats.length == 0 || found.interlocutor.username !== active_chat){ 
            console.log("Chat not found! Create new chat");
            this.chats.push(found);
            found = {interlocutor: {username: active_chat, fullName: active_chat, jobTitle: "", role: ""} as User, chat_name: active_chat, messages: [] as Message[]} as Chat;
            console.debug(found);
        }
        found.messages.push(message);
        //found.messages.push({ body: message.body, sender: message.sender, sentOn: message.sentOn });
        this.chats[0] = found;
        
        console.debug("chat after add new message: ")
        for (let i = 0; i < this.chats.length; i++) {
            console.log(i, "username: ", this.chats[i].interlocutor.username, this.chats[i]);
        }
        
    }

    public async getChatInfo(chatName: string) {
        const chatInfo = await this.hubConnection.invoke<ChatInfo>("GetChatInfo", chatName);
    }

    public async disconnect() {
        await this.hubConnection?.stop();
        console.log("Hub connection stopped");
    }
}
