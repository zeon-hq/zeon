import { Socket } from "socket.io";
import { createMessage } from "../services/DataBaseService";

export async function sendMessageIo(socket:Socket, data: any) {
  try {
    const source = data.source;
    const messageOptions = data.messageOptions;
    await createMessage({ ...data.messageOptions, createdAt: new Date() });

    // Use rooms based on ticketId
    const roomId = messageOptions.ticketId;


    // Deliver messages from widget
    if (source === "widget") {
      if (!messageOptions.file) {
        socket.in(roomId).emit("message", {
          workspaceId: messageOptions.workspaceId,
          message: messageOptions.message,
          time: messageOptions.createdAt,
          type: messageOptions.type,
          isRead: messageOptions.isRead,
          ticketId: roomId,
        });
      }
    }

    // Deliver messages from dashboard
    if (source === "dashboard") {
      if (!messageOptions.file && messageOptions.type !== "NOTE") {
        socket.in(roomId).emit("message", {
          workspaceId: messageOptions.workspaceId,
          message: messageOptions.message,
          time: messageOptions.createdAt,
          type: messageOptions.type,
          isRead: messageOptions.isRead,
          ticketId: roomId,
        });
      }
    }
  } catch (error) {
    console.error('sendMessageIo error:', error);
  }
}
