// @ts-nocheck
import { Channel, Message } from "amqplib";
import { Server } from "socket.io";
import {
  getConnectedDashboardSockets,
  getTicketByIDTemp,
  getTicketByTicketID
} from "../services/DataBaseService";

export async function initConsumer(channel: Channel, io: Server) {
  try {
    console.log("Initializing message queue consumer");

    channel.consume("ticket-message-queue", async (message) => {
      const data = JSON.parse(message?.content?.toString() as string);
      const source = data.source;
      const messageOptions = data.messageOptions;

      // Deliver messages from widget
      if (source === "widget") {
        if (!messageOptions.file) {
          const socketIds = await getConnectedDashboardSockets(
            messageOptions.workspaceId
          );
          io.to(socketIds).emit("message", {
            workspaceId: messageOptions.workspaceId,
            message: messageOptions.message,
            time: messageOptions.createdAt,
            type: messageOptions.type,
            isRead: messageOptions.isRead,
            ticketId: messageOptions.ticketId,
          });
        }
      }

      // Deliver messages from dashboard
      if (source === "dashboard") {
        if (!messageOptions.file) {
          let tickets;
          if (messageOptions.ticketId) {
            tickets = await getTicketByIDTemp(messageOptions.ticketId || "");
          } else {
            tickets = await getTicketByTicketID(messageOptions.ticketId || "");
          }
          if (messageOptions.type !== "NOTE") {
            // Only send non-note messages to widget
            const ticket = tickets;
            if (!!ticket?.socketId) {
              io.to(ticket.socketId).emit("message", {
                workspaceId: messageOptions.workspaceId,
                message: messageOptions.message,
                time: messageOptions.createdAt,
                type: messageOptions.type,
                isRead: messageOptions.isRead,
                ticketId: messageOptions.ticketId,
              });
            }
          }
        }
      }


      channel.ack(message as Message);
    });
  } catch (error) {
    console.log(error);
  }
}
