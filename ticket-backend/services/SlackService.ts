// @ts-nocheck
import {
  TicketOptions
} from "../schema/types/ticket";
import {
  storeTicket
} from "./DataBaseService";

export async function openTicket(
  ticketOptions: TicketOptions,
  socketId: string
) {
  try {
    const ticket: TicketOptions = {
      workspaceId: ticketOptions.workspaceId,
      widgetId:ticketOptions.widgetId,
      channelId: ticketOptions.channelId,
      customerEmail: ticketOptions.customerEmail,
      message: ticketOptions.message,
      createdAt: Date.now(),
      isOpen: true,
      type: ticketOptions.type,
      socketId: socketId,
      messageCount: 1,
      assignedUser: "",
    };

    const dbResult = await storeTicket(ticket);
    return {
      ticketId: dbResult.ticketId
    };
  } catch (error) {
    console.error(error);
    return error;
  }
}