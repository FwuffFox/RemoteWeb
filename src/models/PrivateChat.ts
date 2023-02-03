import type { ChatMessage } from "@/models";

export interface PrivateChat {
    name?: string;
    messages?: ChatMessage[];
}
