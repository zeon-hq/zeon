import { ReadStream } from "fs";

/**
 * Ticket event data options
 */
export interface TicketOptions {
  workspaceId: string;
  channelId: string;
  customerEmail: string;
  message: string;
  createdAt?: number;
  isOpen?: boolean;
  type?: string;
  socketId?: string;
  messageCount?: number;
  assignedUser?: string;
  widgetId?:string;
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
  firstName?: string;
  lastName?: string;
  image?: string;
  ticketId?: string;
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
