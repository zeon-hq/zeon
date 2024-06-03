// @ts-nocheck
import { instrument } from "@socket.io/admin-ui";
import { createAdapter } from "@socket.io/mongo-adapter";
import cors from "cors";
import express, { Request, Response } from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import MessageModel, { IMessageSource, IMessageType } from "./model/MessageModel";
import TicketModel from "./model/TicketModel";
import { sendMessageIo } from "./mq/producer";
import { MessageOptions } from "./schema/types/ticket";
import ChannelModel from "./model/ChannelModel";
import User from "./model/UserModel";
import CoreService, { ISendSlackMessage } from "./services/CoreService";
import {
  createMessage,
  getAdapterCollection,
  getChannelByID,
  getChannelIDByReferenceCode,
  getMessagesByTicketID,
  updateTicketStatus
} from "./services/DataBaseService";
import ExternalService from "./services/ExternalService";
import {
  openTicket,
} from "./services/SlackService";

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
  cors:{
    origin:['https://admin.socket.io'],
    credentials: true
  }
});
instrument(io, {
  auth: false,
  mode: "development",
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: string | number = process.env.TICKET_BACKEND_PORT || 8080;


io.on("connection", (socket:Socket) => {
  socket.on("join_ticket", (data)=> {
    socket.join(data.workspaceId);
    // poc
    // boom working one    
    // socket.broadcast.to(data.ticketId).emit("message", {
    // "test":"new"
    // })

  // boom bang!  working    
    // io.to(data.ticketId).emit("message", {
    //   "test":"new"
    //   });
  });

  socket.on("dashboard_typing", (data) =>{
    io.to(data?.workspaceId).emit("dashboard_typing", data);
  });

  socket.on("dashboard_stop_typing", (data) =>{
    io.to(data?.workspaceId).emit("dashboard_stop_typing", data);
  }); 
  
  socket.on("widget_typing", (data) =>{
    io.to(data?.workspaceId).emit("widget_typing", data);
  });

  socket.on("widget_stop_typing", (data) => {
    io.to(data?.workspaceId).emit("widget_stop_typing", data);
  });

});
const MONGODB_DB_URI: string = process.env.DB_URI as string + process.env.DB_NAME as string;

mongoose.connect(MONGODB_DB_URI).then(() => {
  console.log("Connected to DB in ticket backend!");
}).catch((err: any) => {
  console.log(`Error: MongoDB connection error for  Db. Please make sure MongoDB is running. ${err}`);
});



app.post("/ticket/status", async (req, res) => {
  const { ticketId, isOpen } = req.body;
  try {
    await updateTicketStatus(ticketId, isOpen);
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

// const processedEvents = new Set();

app.post('/slack/events', async (req, res) => {
  if (req.body.challenge) {
    return res.send(req.body.challenge); // Used only for the Slack Event callback URL verification process
  }

  const { event } = req.body;

  if (!event
    //  || processedEvents.has(event.event_id)
    ) {
    return res.sendStatus(200);
  }

  // processedEvents.add(event.event_id);

  if (event?.type === 'message') {
    const { text, thread_ts, bot_profile, app_id } = event;
    if (text && thread_ts && (!bot_profile || !app_id)) {
      const getTicketInformation = await TicketModel.findOne({ thread_ts });
      if (getTicketInformation?.workspaceId && getTicketInformation?.channelId && getTicketInformation?.ticketId) {

        const message = event.text;
        const messageOptions = {
          workspaceId: getTicketInformation.workspaceId,
          channelId: getTicketInformation.channelId,
          isRead: true,
          time: Date.now().toString(),
          createdAt: Date.now().toString(),
          type: IMessageType.RECEIVED,
          message: message,
          ticketId: getTicketInformation.ticketId,
          messageSource: IMessageSource.SLACK,
          source: IMessageSource.SLACK
        };

        createMessage(messageOptions);
        io.to(getTicketInformation.workspaceId).emit("message", messageOptions);
      }
    }
  }
  res.sendStatus(200);
});


app.post('/send/message', async (req, res) => {
  const { ticketId, workspaceId, messageData, messageSource, isNewTicket } = req.body;

  // create new ticket
  // store the data in mongo
  let socketTicketPayload: ISocketTicketPayload;
  const widgetId = messageData?.widgetId || "";
  const channelId = messageData?.channelId;
  const channel = await ChannelModel.findOne({ channelId });
  const isAIEnabled = channel?.toObject().isAIEnabled;
  const agentName = channel?.toObject().agentName;
  const isEmailConfigured = channel?.emailNewTicketNotification;
  const isSlackConfigured = channel?.slackChannelId;

  const getThread_rs = await TicketModel.findOne({ ticketId });
  
  if (isNewTicket) {
    await openTicket(messageData, "no_socket_id"); // pass socketId
    
    socketTicketPayload = {
      workspaceId: workspaceId,
      message: messageData.message,
      customerEmail: messageData.customerEmail,
      isOpen: messageData.isOpen,
      assignedUser: messageData.assignedUser,
      ticketId,
      widgetId,
      isNewTicket,
      messageSource
    }

    if (isSlackConfigured) {
      const locationData = await ExternalService.getLocationFromIp(messageData.ipAddress)


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
            "text": `You have a new ticket:\n${messageData.message}`
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
            "url": `${process.env.WEBSITE_URL}/${workspaceId}/chat?channelId=${channelId}&ticketId=${socketTicketPayload.ticketId}`
          }
        }
      ]
      const sendSlackPayload: ISendSlackMessage = {
        channelId: channel.slackChannelId,
        message: messageData.message,
        token: channel.accessToken,
        blocks
      }

      const slackMessageResponse = await CoreService.sendSlackMessage(sendSlackPayload);

      const thread_ts = slackMessageResponse?.[0]?.result?.ts;
      if (thread_ts) {
        await TicketModel.updateMany({ ticketId: socketTicketPayload.ticketId }, { $set: { thread_ts } });
      } else {
        console.error('Error in sending slack message')
      }
    }

    if (isEmailConfigured) { 
      channel?.members.forEach(async (member: any) => {
        const user = await User.findOne({ userId: member })
        await CoreService.sendMail(`You have a new ticket:\n${messageData.message}` , user?.email, messageData.customerEmail, ticketId, channelId, workspaceId);
      })
    }

    io.to(workspaceId).emit("message", socketTicketPayload)
  } else {
    // store the actual message in the message collection
    await createMessage({...messageData, createdAt: new Date()});
    socketTicketPayload = {
      workspaceId: workspaceId,
      message: messageData.message,
      time: messageData.createdAt,
      type: messageData.type,
      isRead: messageData.isRead,
      ticketId,
      isNewTicket,
      widgetId,
      messageSource
    }

    io.to(workspaceId).emit("message", socketTicketPayload);

    if (isSlackConfigured) {
      // send to slack thread
      if (isSlackConfigured) {
        const sendSlackPayload: ISendSlackMessage = {
          channelId: channel.slackChannelId,
          message: messageData.message,
          token: channel.accessToken,
          thread_ts: getThread_rs?.thread_ts
        }

        await CoreService.sendSlackMessage(sendSlackPayload);
      }
    }

  }

  if (isAIEnabled && messageSource ==  "widget") {
    const aiMessagepayload = {
      question: messageData.message,
      history: [],
      workspaceId,
      channelId
    }

    io.to(workspaceId).emit("ai_responding", {
      ticketId,
      workspaceId,
      channelId,
      agentName
    });

    const aiResponse = await CoreService.getAIMessage(aiMessagepayload);
    
    io.to(workspaceId).emit("ai_stop_responded", {
      ticketId,
      workspaceId,
      channelId
    });
    
    if (!aiResponse?.error) {

      if (aiResponse.text === 'human_intervention_needed') {
      
      io.to(workspaceId).emit("human_intervention_needed", {
        ticketId,
        workspaceId,
        channelId
      });

      if (isSlackConfigured) {
        const sendSlackPayload: ISendSlackMessage = {
          channelId: channel.slackChannelId,
          message: 'Human Intervention Needed',
          token: channel.accessToken,
          thread_ts: getThread_rs?.thread_ts
        }

        await CoreService.sendSlackMessage(sendSlackPayload);
      }

        if (isEmailConfigured) {
          channel?.members.forEach(async (member: any) => {
            const user = await User.findOne({ userId: member })
            await CoreService.sendMail('human intervention needed', user?.email, messageData?.customerEmail, ticketId, channelId, workspaceId);
          })
        }

      } else {
      // success
      const message = aiResponse?.text;
      const messageOptions: MessageOptions = {
        workspaceId,
        channelId,
        type: IMessageType.RECEIVED,
        isRead: true,
        time: messageData.createdAt,
        message,
        ticketId,
        widgetId,
        messageSource: IMessageSource.BOTH
      }
      await createMessage({ ...messageData, createdAt: new Date(), message, type: IMessageType.RECEIVED });
      // io.emit("message", messageOptions);
      io.to(workspaceId).emit("message", messageOptions);

      if (isSlackConfigured) {
        const sendSlackPayload: ISendSlackMessage = {
          channelId: channel.slackChannelId,
          message: message,
          token: channel.accessToken,
          thread_ts: getThread_rs?.thread_ts
        }

        await CoreService.sendSlackMessage(sendSlackPayload);
      }
    }
    } else {
      const message = `${aiResponse?.error} \n Note: this is only appears in the dashboard, customers won't see this message`;
      const messageOptions: MessageOptions = {
        workspaceId,
        channelId,
        type: IMessageType.SENT,
        isRead: true,
        time: messageData.createdAt,
        message,
        ticketId,
        widgetId,
        messageSource: "widget"
      }
      if (isSlackConfigured) {
        const sendSlackPayload: ISendSlackMessage = {
          channelId: channel.slackChannelId,
          message: message,
          token: channel.accessToken,
          thread_ts: getThread_rs?.thread_ts
        }

        await CoreService.sendSlackMessage(sendSlackPayload);
      }
      await createMessage({ ...messageData, createdAt: new Date(), message, type: IMessageType.SENT });
      io.to(workspaceId).emit("message", messageOptions);

    }
  }
  
  return res.status(200).json({
    message: "Channel data fetched successfully"
  });
})

// httpServer.on("listening", () => init());
init();
httpServer.listen(port, async () => console.log(`Listening on port ${port}`));

app.use("/health", (req: Request, res: Response) => {
  res.send("all ok from ticket backend | hello All !");
});

async function init() {
  getAdapterCollection()
    .then((collection) => {
      io.adapter(createAdapter(collection));
      console.log("Server event adapter created");
    }).catch((error) => console.error(error));
}