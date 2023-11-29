import { MessageType } from "reducer/slice";

export interface IMessage {
    message:string,
    createdAt:Date,
    type: MessageType,
    isRead: boolean;
    ticketId: string;
}