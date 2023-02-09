import type { User, Message } from "@/models";

export interface Chat {
    interlocutor: User;
    chat_name: string;
    messages: Message[];
}
