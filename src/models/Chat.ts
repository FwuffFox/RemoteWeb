import type { User, MessageWithoutSender, Message } from "@/models";

export interface Chat{
    interlocutor: User;
    chat_name: string;
    message: Message[];
}