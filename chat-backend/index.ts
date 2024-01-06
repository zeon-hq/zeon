import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import os from "os";
import { initializeDB } from "zeon-core/dist/func";
import { UserInterface } from "zeon-core/dist/types";
import oauthController from "./controller/slack/oauthController";
const app: Express = express();



declare global {
  namespace Express {
    interface Request {
      user : UserInterface;
    }
  }
}



const channelRouter = require("./routes/channel")
const userRouter = require("./routes/user")
const teamRouter = require("./routes/team")
const ticketRouter = require("./routes/ticket")



dotenv.config();

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

app.get('/oauth/slack/un-authorize/:channelId', oauthController.unOAuthSlackAuthorize);


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at ${os.hostname()}:${port}`);
});
