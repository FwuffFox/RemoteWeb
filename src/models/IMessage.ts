import type { IUser } from "./IUser";

export interface IMessage {
    body: string;
    sender: IUser;
    time: Date;
}
