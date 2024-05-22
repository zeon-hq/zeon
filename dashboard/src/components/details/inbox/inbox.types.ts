import { MessageType } from "reducer/slice";

export interface IMessage {
    message:string,
    createdAt?:Date,
    type?: MessageType,
    isRead?: boolean;
    ticketId: string;
    channelId:string;
    workspaceId:string;
    messageSource:string;
}