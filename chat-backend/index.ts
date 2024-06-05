import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import os from "os";
import { initializeDB } from "zeon-core/dist/func";
import { UserInterface } from "zeon-core/dist/types";
import oauthController from "./controller/slack/oauthController";
import {Logger} from "zeon-core/dist/index"
import {ZeonServices} from "zeon-core/dist/types/types"


const logger = new Logger(ZeonServices.CHAT)
const app: Express = express();
dotenv.config()


declare global {
  namespace Express {
    interface Request {
      //@ts-ignore
      user : UserInterface;
    }
  }
}



const channelRouter = require("./routes/channel")
const userRouter = require("./routes/user")
const teamRouter = require("./routes/team")
const ticketRouter = require("./routes/ticket")


const port = process.env.CHAT_BACKEND_PORT as string;

app.use(cors())




app.use(express.json());


mongoose
  //@ts-ignore
  .connect(process.env.DB_URI,{dbName:process.env.DB_NAME})
  .then(() => {
    initializeDB();
    console.log("Connected to DB chat backend",port);
    initializeDB();
  })
  .catch((e) => {
    console.log('DB Connection Failed Error Message: ',e);
    logger.error({
      message: "Error in connecting to DB",
      error: e,
    })
  });

app.use("/channel", channelRouter);
app.use("/user", userRouter);
app.use("/team", teamRouter);
app.use("/ticket", ticketRouter);


app.use("/health", (req, res)=>{
  console.log('chat backend health check');
  res.send("all ok from chat-backend");
});

app.get('/oauth/slack/authorize', oauthController.oauthSlackAuthorize);


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at ${os.hostname()}:${port}`);
});
