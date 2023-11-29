import { Channel } from "amqplib";
import { createMessage } from "../services/DataBaseService";

export async function sendMessage(channel: Channel, data: any) {
  try {
    await createMessage({...data.messageOptions, createdAt:new Date()});
    const res = channel.sendToQueue(
      "ticket-message-queue",
      Buffer.from(JSON.stringify(data))
    );
  } catch (error) {
    console.log(error);
  }
}
