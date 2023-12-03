import config from "config";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import mongoose from "mongoose";
import os from "os";
import { initializeDB } from "zeon-core/dist/func";
import { UserInterface } from "zeon-core/dist/types";
console.log("NODE_ENV: " + config.util.getEnv("NODE_ENV"));
const app: Express = express();


declare global {
  namespace Express {
    interface Request {
      user : UserInterface
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


initializeDB();

app.use("/channel", channelRouter);
app.use("/user", userRouter);
app.use("/team", teamRouter);
app.use("/ticket", ticketRouter);


app.get("/health", (req, res) => res.send("all ok from chat-backend"));


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at ${os.hostname()}:${port}`);
});
