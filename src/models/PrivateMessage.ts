import type { User } from "@/models";

export interface PrivateMessage {
    body: string;
    sender: User;
    sendTime: Date;
}
