// @ts-nocheck
import { createAdapter } from "@socket.io/mongo-adapter";
import { Channel, Connection } from "amqplib";
import cors from "cors";
import express, { Request, Response } from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import MessageModel from "./model/MessageModel";
import TicketModel from "./model/TicketModel";
import { connectQueue } from "./mq/connect";
import { initConsumer } from "./mq/consumer";
import { sendMessage } from "./mq/producer";
import { MessageOptions, ITicketOptions } from "./schema/types/ticket";
import {
  createDashboardSocket,
  getAdapterCollection,
  getChannelByID,
  getChannelIDByReferenceCode,
  getConnectedDashboardSockets,
  getMessagesByTicketID,
  getTicketByID,
  getTicketByIDTemp,
  removeDashboardSocket,
  updateClientSocketId,
  updateTicketStatus,
  updateTicketStatusByTicketId,
} from "./services/DataBaseService";
import {
  openTicket,
} from "./services/SlackService";
import CoreService, { ISendSlackMessage } from "./services/CoreService"
import ChannelModel from "./model/ChannelModel";
import User from "./model/UserModel";
import ExternalService from "./services/ExternalService";

export interface ISocketTicketPayload {
  workspaceId: string;
  message: string;
  customerEmail: string;
  isOpen: boolean;
  assignedUser: string;
  ticketId: string;
  widgetId: string;
}


const app = express();
const httpServer = createServer(app);
app.use(cors());
const io = new Server(httpServer, {
  // transports: ["websocket"],
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: string | number = process.env.TICKET_BACKEND_PORT || 8080;


let mqChannel: Channel;
let mqConnection: Connection;
io.on("connection", (socket) => {

  socket.on("open-ticket", async (ticketOptions: ITicketOptions) => {

    try {

      const openTicketData: any = await openTicket(ticketOptions, socket.id);
      socket.emit("open-ticket-complete", openTicketData);

      const socketIds = await getConnectedDashboardSockets(ticketOptions.workspaceId);

      const socketTicketPayload: ISocketTicketPayload = {
        workspaceId: ticketOptions.workspaceId,
        message: ticketOptions.message,
        customerEmail: ticketOptions.customerEmail,
        isOpen: ticketOptions.isOpen,
        assignedUser: ticketOptions.assignedUser,
        ticketId: openTicketData.ticketId,
        widgetId: ticketOptions.widgetId
      }

      io.to(socketIds).emit("open-ticket", socketTicketPayload);


      const channel = await ChannelModel.findOne({ channelId: ticketOptions.channelId });

      if (channel?.emailNewTicketNotification) {
        channel?.members.forEach(async (member: any) => {
          const user = await User.findOne({ userId: member })
          await CoreService.sendMail(ticketOptions.message, user?.email, ticketOptions.customerEmail, openTicketData.ticketId, ticketOptions.channelId, ticketOptions.workspaceId);
        })
      }

      if (channel?.slackChannelId) {
        const locationData = await ExternalService.getLocationFromIp(ticketOptions.ipAddress)


        let locationName;
        if (!locationData?.city || !locationData?.regionName || !locationData?.country) {
          locationName = 'Not Found'
        } else {
          locationName = `${locationData.city}, ${locationData.regionName}, ${locationData.country}` || '';
        }
        const blocks = [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `You have a new ticket:\n${ticketOptions.message}`
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "fields": [
              {
                "type": "mrkdwn",
                "text": `Type:\n${channel.name}`
              },
              {
                "type": "mrkdwn",
                "text": `E-Mail:\n${socketTicketPayload.customerEmail}`
              },
              {
                "type": "mrkdwn",
                "text": `Ticket ID:\n${socketTicketPayload.ticketId}`
              },
              {
                "type": "mrkdwn",
                "text": `Location:\n${locationName}`
              }
            ]
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Head over to your dashboard to reply"
            },
            "accessory": {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Go to chat ->"
              },
              "url": `${process.env.WEBSITE_URL}/${ticketOptions.workspaceId}/chat?channelId=${ticketOptions.channelId}&ticketId=${socketTicketPayload.ticketId}`
            }
          }
        ]
        const sendSlackPayload: ISendSlackMessage = {
          channelId: channel.slackChannelId,
          message: ticketOptions.message,
          token: channel.accessToken,
          blocks
        }

        const slackMessageResponse = await CoreService.sendSlackMessage(sendSlackPayload);
        console.log(`slackMessageResponse, ticketId:${openTicketData.ticketId}`, slackMessageResponse)

        await TicketModel.updateMany({ ticketId: openTicketData.ticketId }, { $set: { thread_ts: slackMessageResponse[0].result.ts } })
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("message", async (messageOptions: MessageOptions) => {
    const data = {
      source: "widget",
      messageOptions,
    };

    const channel = await ChannelModel.findOne({ channelId: messageOptions.channelId });

    if (channel?.slackChannelId) {
      const getThread_rs = await TicketModel.findOne({ ticketId: messageOptions.ticketId });
      if (getThread_rs?.thread_ts) {
        console.log('getThread_rs not found')
        const slackPayload: ISendSlackMessage = {
          channelId: channel.slackChannelId,
          message: messageOptions.message,
          token: channel.accessToken,
          thread_ts: getThread_rs?.thread_ts
        }
        await CoreService.sendSlackMessage(slackPayload);
      }
    }
    await sendMessage(mqChannel, data);
  });

  socket.on("reconnect", async (ticketId: any) => {
    await updateClientSocketId(ticketId.ticketId, socket.id);
  });

  socket.on("dashboard-connect-event", async (workspaceId: string) => {
    try {
      await createDashboardSocket(workspaceId, socket.id);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("dashboard-disconnect-event", async (workspaceId: string) => {
    try {
      await removeDashboardSocket(socket.id);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("disconnect", async (reason: any) => {
    try {
      await removeDashboardSocket(socket.id);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("dashboard-reconnect-event", async (workspaceId: string) => {
    try {
      await createDashboardSocket(workspaceId, socket.id);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on(
    "dashboard-message-event",
    async (messageOptions: MessageOptions) => {
      const data = {
        source: "dashboard",
        messageOptions,
      };

      await sendMessage(mqChannel, data);
    }
  );
  socket.on(
    "dashboard-update-ticket-status-event",
    async ({ ticketId, isOpen }: { ticketId: string; isOpen: boolean }) => {
      try {
        const updateResult = await updateTicketStatusByTicketId(
          ticketId,
          !isOpen
        );
        if (updateResult) {
          const ticket: any = await getTicketByIDTemp(ticketId);
          if (ticket) {
            if (isOpen) {
              io.to(ticket.socketId).emit("close-ticket", ticketId);
            } else {
              io.to(ticket.socketId).emit("reopen-ticket", ticketId);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  );
});
const MONGODB_DB_URI: string = process.env.DB_URI as string + process.env.DB_NAME as string;

mongoose.connect(MONGODB_DB_URI).then(() => {
  console.log("Connected to DB in ticket backend!");
}).catch((err: any) => {
  console.log(`Error: MongoDB connection error for  Db. Please make sure MongoDB is running. ${err}`);
});

io.on("socket-adapter-event", (data: any) => {
  if (io.sockets.adapter.sids.get(data.socketId) != undefined) {
    io.to(data.socketId).emit("message", data.msgOptions);
  }
});

app.get("/", (req, res) => res.send("hello from ticket service"));

app.post("/ticket/status", async (req, res) => {
  const { ticketId, isOpen } = req.body;
  try {
    const updateResult = await updateTicketStatus(ticketId, isOpen);
    if (updateResult) {
      const ticket: any = await getTicketByID(ticketId);
      if (ticket) {
        // await updateTicket(ticket, isOpen);
        if (isOpen) {
          io.to(ticket.socketId).emit("close-ticket", ticketId);
        } else {
          io.to(ticket.socketId).emit("reopen-ticket", ticketId);
        }
      }
    }
    return res.status(200).json({
      code: '200',
      message: `Ticket Status Fetched`,
      data: {
        ticketId: ticketId,
        isOpen: !isOpen,
      }
    });
  } catch (e: any) {
    if (e.response) {
      return res.status(e.response.status).json({
        code: e.response.data ? e.response.data.code : e.response.status,
        message: e.response.data ? e.response.data.message : e.message,
        data: e.response.data ? e.response.data.data : null,
      });
    } else {
      return res.status(500).json({
        code: "500",
        message: e.message,
      });
    }
  }
});

app.post("/channel", async (req, res) => {
  try {
    const { channelCode } = req.body;
    const channelId = await getChannelIDByReferenceCode(channelCode);
    res.send({ channelId: channelId });
  } catch (error) {
    console.error(error);
    res.sendStatus(404);
  }
});

app.get("/ticket/messages/:ticketId", async (req, res) => {
  const { ticketId } = req.params;

  try {
    const messages = await getMessagesByTicketID(ticketId);
    return res.status(200).json({
      code: "200",
      message: `Ticket Messaged Fetched`,
      data: messages,
    });
  } catch (e: any) {
    if (e.response) {
      return res.status(e.response.status).json({
        code: e.response.data ? e.response.data.code : e.response.status,
        message: e.response.data ? e.response.data.message : e.message,
        data: e.response.data ? e.response.data.data : null,
      });
    } else {
      return res.status(500).json({
        code: "500",
        message: e.message,
      });
    }
  }
});

app.get("/ticket/:widgetId", async (req, res) => {
  const { widgetId } = req.params;
  let getTicket = await TicketModel.find({ widgetId, isOpen: true }).populate('messages');
  const allTicketId = getTicket.map((data) => data.ticketId);

  const getMessages = await MessageModel.find({ ticketId: { $in: allTicketId } });

  for (let i = 0; i < getTicket.length; i++) {
    const ticketId = getTicket[i].ticketId;

    const getMessagesData = getMessages.filter((data: any) => data.ticketId == ticketId);
    getTicket[i].messages = getMessagesData
  }

  res.send({ ticket: getTicket });
})

app.get("/channel/:channelId", async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await getChannelByID(channelId);
    if (!channel) {
      return res.status(400).json({
        message: "No channel found",
      });
    }
    return res.status(200).json({
      message: "Channel data fetched successfully",
      channel,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(404);
  }
});

app.post('/slack/events', async (req, res) => {
  if (req.body.challenge) {
    return res.send(req.body.challenge); // Used only for the Slack Event callback URL verification process
  }

  const { event } = req.body;

  if (event.type === 'message') {
    const { text, thread_ts, bot_profile, app_id } = event;
    // send this message to the widget
    // get channelId, ticketId using thread_ts
    if (text && thread_ts && (!bot_profile || !app_id)) {
      const getTicketInformation = await TicketModel.findOne({ thread_ts });
      if (getTicketInformation.workspaceId && getTicketInformation.channelId && getTicketInformation.ticketId) {
        
        const messageOptions: MessageOptions = {
          workspaceId: getTicketInformation.workspaceId,
          channelId: getTicketInformation.channelId,
          type: "received",
          isRead: true,
          message: text,
          ticketId: getTicketInformation?.ticketId,
        }

        const data = {
          source: "dashboard",
          messageOptions
        }

        await sendMessage(mqChannel, data);
      }
    }
    // send this message to the dashboard
  }

});


httpServer.on("listening", () => init());
httpServer.listen(port, async () => console.log(`Listening on port ${port}`));

app.use("/health", (req: Request, res: Response) => {
  res.send("all ok from ticket backend | hello");
});

async function init() {
  getAdapterCollection()
    .then((collection) => {
      // @ts-ignore
      io.adapter(createAdapter(collection));
      console.log("Server event adapter created");
    })
    .catch((error) => console.error(error));

  // Open a message queue connection
  let queue = await connectQueue();
  mqChannel = queue?.channel as Channel;
  mqConnection = queue?.connection as Connection;

  // Initialize consumer
  await initConsumer(mqChannel, io);
}
