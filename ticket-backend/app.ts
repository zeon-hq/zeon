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
import { MessageOptions, TicketOptions } from "./schema/types/ticket";
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
import CoreService from "./services/CoreService"

const app = express();
const httpServer = createServer(app);
app.use(cors());
const io = new Server(httpServer, {
  // transports: ["websocket"],
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: string | number = process.env.TICKET_BACKEND_PORT || 8080;
console.log('ticket_backend_port', port);

let mqChannel: Channel;
let mqConnection: Connection;

io.on("connection", (socket) => {
  console.log("New client connected ", socket.id);
  socket.on("open-ticket", async (ticketOptions: TicketOptions) => {
    try {
      console.log('------ ticket Options: ', ticketOptions)
      const openTicketData: any = await openTicket(ticketOptions, socket.id);
      socket.emit("open-ticket-complete", openTicketData);
      console.log('----------- open ticket', openTicketData)
      const socketIds = await getConnectedDashboardSockets(
        ticketOptions.workspaceId
      );
      io.to(socketIds).emit("open-ticket", {
        workspaceId: ticketOptions.workspaceId,
        message: ticketOptions.message,
        customerEmail: ticketOptions.customerEmail,
        isOpen: ticketOptions.isOpen,
        assignedUser: ticketOptions.assignedUser,
        ticketId: openTicketData.ticketId,
        widgetId:ticketOptions.widgetId
      });

      // send email 
      console.log('---------------- send email')
      await CoreService.sendMail(ticketOptions.message, ticketOptions.customerEmail, ticketOptions.customerEmail);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("message", async (messageOptions: MessageOptions) => {
    const data = {
      source: "widget",
      messageOptions,
    };

    await sendMessage(mqChannel, data);

  });

  socket.on("reconnect", async (ticketId: any) => {
    await updateClientSocketId(ticketId.ticketId, socket.id);
  });

  socket.on("dashboard-connect-event", async (workspaceId: string) => {
    try {
      await createDashboardSocket(workspaceId, socket.id);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("dashboard-disconnect-event", async (workspaceId: string) => {
    try {
      await removeDashboardSocket(socket.id);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", async (reason: any) => {
    try {
      await removeDashboardSocket(socket.id);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("dashboard-reconnect-event", async (workspaceId: string) => {
    try {
      await createDashboardSocket(workspaceId, socket.id);
    } catch (error) {
      console.log(error);
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
          const ticket:any = await getTicketByIDTemp(ticketId);
          if (ticket) {
            if (isOpen) {
              io.to(ticket.socketId).emit("close-ticket", ticketId);
            } else {
              io.to(ticket.socketId).emit("reopen-ticket", ticketId);
            }
          }
        }
      } catch (error) {
        console.log(error);
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

app.get("/", (req,res) =>  res.send("hello from ticket service"));

app.post("/ticket/status", async (req, res) => {
  const { ticketId, isOpen } = req.body;
  try {
      const updateResult = await updateTicketStatus(ticketId, isOpen);
      if (updateResult) {
          const ticket:any = await getTicketByID(ticketId);
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
    const channelId = await getChannelIDByReferenceCode(req.body.channelCode);
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

app.get("/ticket/:widgetId", async(req, res)=>{
  const widgetId = req.params.widgetId;
  let getTicket = await TicketModel.find({widgetId, isOpen:true}).populate('messages');
  const allTicketId = getTicket.map((data)=> data.ticketId);

  const getMessages = await MessageModel.find({ticketId:{$in:allTicketId}});

  for (let i = 0; i < getTicket.length; i++) {
    const ticketId = getTicket[i].ticketId;

    const getMessagesData = getMessages.filter((data:any)=> data.ticketId == ticketId);
    getTicket[i].messages = getMessagesData    
  }

  res.send({ ticket: getTicket });
})

app.get("/channel/:channelId", async (req, res) => {
  try {
    const channelId = req.params.channelId;
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

httpServer.on("listening", () => init());
httpServer.listen(port, async () => console.log(`Listening on port ${port}`));

app.use("/health", (req: Request, res: Response)=>{
  console.log('ticket service health check')
  res.send("all ok from ticket backend");
});

async function init() {
  getAdapterCollection()
    .then((collection) => {
      // @ts-ignore
      io.adapter(createAdapter(collection));
      console.log("Server event adapter created");
    })
    .catch((error) => console.log(error));

  // Open a message queue connection
  let queue = await connectQueue();
  mqChannel = queue?.channel as Channel;
  mqConnection = queue?.connection as Connection;

  // Initialize consumer
  await initConsumer(mqChannel, io);
}
