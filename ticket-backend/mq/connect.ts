import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const mq_uri = process.env.MQ_URI as string;

export async function connectQueue() {
  try {
    console.log('ticket backend rabbit mq url: ', mq_uri)
    let connection = await amqp.connect(mq_uri);
    let channel = await connection.createChannel();

    await channel.assertQueue("ticket-message-queue");
    console.log("Connected to message queue");
    return {channel, connection};
  } catch (error) {
    console.log('Rabbit mq connection error',error);
  }
}
