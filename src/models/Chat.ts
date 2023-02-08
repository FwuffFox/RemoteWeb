import type { Message, User } from "@/models";

export interface Chat {
    id: Int32Array;
    chat_name?: string; // это в профиле юзера храним, так так все могут называть чат как захотят сами
    chat_participants: User[];
    // иконка чата
    // чтонибудь общее о чате
    messages?: Message[];
}
