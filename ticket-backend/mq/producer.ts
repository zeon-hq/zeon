import { Channel } from "amqplib";
import { createMessage } from "../services/DataBaseService";
import { Server } from "socket.io";
import {
    getConnectedDashboardSockets,
    getTicketByIDTemp  
  } from "../services/DataBaseService";
import { ITicketModel } from "../model/TicketModel";

export async function sendMessage(channel: Channel, data: any) {
    try {
        await createMessage({...data.messageOptions, createdAt: new Date()});

        // Ensure the message is sent to the queue
        const sent = channel.sendToQueue("ticket-message-queue", Buffer.from(JSON.stringify(data)));
        if (!sent) {
            console.error('Message buffer is full, or channel is closed');
        } else {
            console.log('Message sent successfully');
        }
    } catch (error) {
        console.error('Error in sendMessage:', error);
    }
}

export async function sendMessageIo(io:Server, data:any) {
    try {
      const source = data.source;
      const messageOptions = data.messageOptions;
      await createMessage({...data.messageOptions, createdAt: new Date()});
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
          const tickets:ITicketModel | null = await getTicketByIDTemp(messageOptions.ticketId);
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

    } catch (error) {
        
    }
}