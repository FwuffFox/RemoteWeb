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

    public static async init(): Promise<SignalrChatService> {
        const signal = new SignalrChatService();
        signal.chats = [] as Chat[];
        console.debug("chat after constr: ", signal.chats);
        signal.createConnection();
        signal.registerOnServerEvents();
        await signal.startConnection();
        await new Promise((resolve) => setTimeout(resolve, 5000));
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
                while (from < arr_from.length) {
                    this.chats[i].messages.push({
                        body: arr_from[from].body,
                        sentOn: arr_from[from].sentOn,
                        sender: AuthStore.getUser,
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
            console.debug("Chats after connect ", this.chats);
        });

        this.hubConnection.on("OnGetMessage", (message: Message) => {
            this.addMessageToChat(message, message.sender.username);

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

    public async addMessageToChat(message: Message, active_chat: string){
        console.log("Got a message:", message);

        let found = this.chats[0];
        for (let i = 1; i < this.chats.length && found.interlocutor.username !== active_chat; ++i) {
            const tmp = this.chats[i];
            this.chats[i] = found;
            found = tmp;
        }
        // if(i == this.chats.length){ console.log("chat not found");break;}
        found.messages.push(message);
        this.chats[0] = found;

        for (let i = 0; i < this.chats.length; i++) {
            console.log(i, this.chats[i].interlocutor.username);
        }
        console.debug("chats after add: ", this.chats);
    }

    public async getChatInfo(chatName: string) {
        const chatInfo = await this.hubConnection.invoke<ChatInfo>("GetChatInfo", chatName);
    }

    public async disconnect() {
        await this.hubConnection?.stop();
        console.log("Hub connection stopped");
    }
}
