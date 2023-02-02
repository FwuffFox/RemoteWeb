import type { User } from "@/models";

export interface Message {
    body: string;
    sender: User;
    time: Date;
}
