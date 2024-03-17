import "web-streams-polyfill/dist/polyfill.es6.js";
import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import workspaceRoutes from "./routes/workspace";
import companyRoutes from "./routes/company";
import contactRoutes from "./routes/contact";
import dataModelRoutes from "./routes/dataModel";
import cors from "cors";
import { verifyIdentity } from "./functions/user"
import { UserInterface } from "./schema/User"
import { initializeDB } from "./functions/workspace"
import CommunicationController from "./controller/CommunicationController";
import oauthController from "./controller/oauthController";
import notesRoutes from "./routes/notes";
import AIRoute from "./routes/AIRoute";

const app = express();
const port = process.env.CORE_BACKEND_PORT
import AIController from "./controller/AIController";

declare global {
  namespace Express {
    interface Request {
      user?: UserInterface
    }
  }
}

// connect to mongodb
initializeDB();

// setup cors to allow all origins
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001","https://dev.zeonhq.com", "https://zeon-finance.flutterflow.app","http://localhost:5687","https://app.zeonhq.com","http://zeon-dashboard:5687"],
  // ALLOW ALL METHODs
  methods: "*",
  // ALLOW ALL HEADERS
  allowedHeaders: "*",
  credentials: true
})); 

// set up router
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up routes
app.use("/auth", authRoutes);
app.use("/user", verifyIdentity, userRoutes);
app.use("/workspaces", verifyIdentity,workspaceRoutes);
app.use("/companies",verifyIdentity, companyRoutes);
app.use("/contacts",verifyIdentity, contactRoutes);
app.use("/notes",verifyIdentity, notesRoutes);
app.use("/datamodel", verifyIdentity,dataModelRoutes);
app.use("/ai", AIRoute);

app.post("/internal/communication/send-email", CommunicationController.sendEmail);

app.post('/internal/slack/message', oauthController.sendMessage);


app.get("/health", (req: Request, res: Response)=>{
  console.log('core service health check');
  res.send("all ok from zeon core service health |");
});

// run server at port 6000
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

// export verifyIdentity so that it can be imported when this package is used as a dependency

export {
  verifyIdentity
}