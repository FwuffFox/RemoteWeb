import type { PrivateMessage } from "@/models";

export interface PrivateChat {
    name?: string;
    messages?: PrivateMessage[];
}
