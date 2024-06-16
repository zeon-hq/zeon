import { ReadStream } from "fs";
import { IChatType, IMessageSource } from "../../model/MessageModel";

/**
 * Ticket event data options
 */
export interface ITicketOptions {
  workspaceId: string;
  channelId: string;
  customerEmail: string;
  message: string;
  createdAt?: number;
  isOpen?: boolean;
  type?: string;
  socketId?: string;
  assignedUser?: string;
  widgetId?:string;
  ipAddress?:string;
  ticketId:string;
}

/**
 * Message event data options
 */
export interface MessageOptions {
  workspaceId: string;
  createdAt?: number;
  message?: string;
  type?: 'SENT' | 'RECEIVED' | 'NOTE';
  channelId?: string;
  isRead?:  boolean;
  file?: ReadStream;
  userId?: string;
  chatType: IChatType;
  firstName?: string;
  lastName?: string;
  image?: string;
  ticketId: string;
  source: IMessageSource;
}

/**
 * Block data options
 */
export interface BlockOptions {
  customerEmail: string;
  message: string;
  type?: string;
  isOpen?: boolean;
}
