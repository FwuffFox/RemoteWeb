import type { MessageWithoutSender } from "@/models";

export interface PrivateChat {
    name?: string;
    messages?: MessageWithoutSender[];
}
