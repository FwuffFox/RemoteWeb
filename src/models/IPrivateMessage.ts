import type { IUser } from "@/models/IUser";

export interface IPrivateMessage {
    body: string;
    sender: IUser;
    sendTime: string
}