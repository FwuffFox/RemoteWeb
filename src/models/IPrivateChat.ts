import type { IUser } from "@/models/IUser";
import type { IPrivateMessage } from "@/models/IPrivateMessage";

export interface IPrivateChat {
    users: IUser[];
    messages: IPrivateMessage[];
}
