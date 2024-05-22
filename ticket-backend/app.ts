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
import { ITicketOptions, MessageOptions } from "./schema/types/ticket";

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

  socket.on("open-ticket", async (ticketOptions: ITicketOptions) => {
    const channelId = ticketOptions.channelId;
    const workspaceId = ticketOptions.workspaceId;
    const widgetId = ticketOptions.widgetId;
    try {
      const openTicketData: any = await openTicket(ticketOptions, socket.id);
      const ticketId = openTicketData.ticketId;


      const socketTicketPayload: ISocketTicketPayload = {
        workspaceId: workspaceId,
        message: ticketOptions.message,
        customerEmail: ticketOptions.customerEmail,
        isOpen: ticketOptions.isOpen,
        assignedUser: ticketOptions.assignedUser,
        ticketId: ticketId,
        widgetId: widgetId
      }

      io.in(ticketId).emit("open-ticket", socketTicketPayload);


      const channel = await ChannelModel.findOne({ channelId: channelId });
      const isEmailConfigured = channel?.emailNewTicketNotification;
      const isSlackConfigured = channel?.slackChannelId;
      const isAIEnabled = channel?.isAIEnabled;

      if (isEmailConfigured) { 
        channel?.members.forEach(async (member: any) => {
          const user = await User.findOne({ userId: member })
          await CoreService.sendMail(ticketOptions.message, user?.email, ticketOptions.customerEmail, openTicketData.ticketId, channelId, workspaceId);
        })
      }

      if (isSlackConfigured) {
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
              "url": `${process.env.WEBSITE_URL}/${workspaceId}/chat?channelId=${channelId}&ticketId=${socketTicketPayload.ticketId}`
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


        await TicketModel.updateMany({ ticketId: openTicketData.ticketId }, { $set: { thread_ts: slackMessageResponse[0].result.ts } })
      }

      // if AI Enabled
      // if (isAIEnabled || true) {
      //   const aiMessagepayload = {
      //     question: ticketOptions.message,
      //     history: [],
      //     workspaceId, 
      //     channelId
      //   }

      //   const aiResponse = await CoreService.getAIMessage(aiMessagepayload);
      //   if (aiResponse) {
      //     const messageOptions: MessageOptions = {
      //       workspaceId,
      //       channelId,
      //       type: "received",
      //       isRead: true,
      //       message: aiResponse?.text,
      //       ticketId: openTicketData.ticketId,
      //     }

      //     const dashboardData = {
      //       source: "dashboard",
      //       messageOptions
      //     }


      //     const widgetData = {
      //       source: "widget",
      //       messageOptions
      //     }

      //   }
      // }
    } catch (error) {
      console.error(error);
    }
  });


  socket.on("message", async (messageOptions: MessageOptions) => {
    const channelId = messageOptions?.channelId;
    const workspaceId = messageOptions?.workspaceId;
    const ticketId = messageOptions?.ticketId;
    const message = messageOptions.message;
 
    const channel = await ChannelModel.findOne({ channelId });
    const isSlackConfigured = channel?.slackChannelId;
    const isAIEnabled = channel?.isAIEnabled;

    // send message to slack when the slack in configured
    if (isSlackConfigured) {
      const getThread_rs = await TicketModel.findOne({ ticketId });
      if (getThread_rs?.thread_ts) {
        const slackPayload: ISendSlackMessage = {
          channelId,
          message ,
          token: channel.accessToken,
          thread_ts: getThread_rs?.thread_ts
        }
        await CoreService.sendSlackMessage(slackPayload);
      }
    }

    const data = {
      source: "widget",
      messageOptions,
    };


    // configure send message here
    await sendMessageIo(socket, data);

     // if AI Enabled
     // messageOptions?.isAIEnabled is to turn off the AI for the auto reply things
    //    if (messageOptions?.isAIEnabled != false && isAIEnabled || true) {
    //   const aiMessagepayload = {
    //     question: messageOptions.message,
    //     history: [],
    //     workspaceId, 
    //     channelId
    //   }
      
    //   const aiResponse = await CoreService.getAIMessage(aiMessagepayload);
    //   if (aiResponse) {
    //     const messageOptions: MessageOptions = {
    //       workspaceId,
    //       channelId,
    //       type: "received",
    //       isRead: true,
    //       message: aiResponse?.text,
    //       ticketId
    //     }

    //     const data = {
    //       source: "dashboard",
    //       messageOptions
    //     }


    // configure send message here

    //     const widgetData = {
    //       source: "widget",
    //       messageOptions
    //     }

    // configure send message here
    //   }
    // }
  });





  socket.on("join_ticket", (data)=> {
    socket.join(data.workspaceId);
    
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

        // configure send message here
        await sendMessageIo(socket, data);
      }
    }
    // send this message to the dashboard
  }

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
      channelId
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
