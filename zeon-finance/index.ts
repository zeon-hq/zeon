import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { verifyIdentity, initializeDB } from "zeon-core/dist/func";
import cors from "cors";
import expenseRoutes from "./routes/expense";
import categoryRoutes from "./routes/category";
import rootRoutes from "./routes/root";
import mongoose from "mongoose";
import { Request, Response } from "express";

mongoose
  //@ts-ignore
  .connect(process.env.DB_URI, { dbName: process.env.DB_NAME })
  .then(() => {
    console.log("Connected to DB from finance");
    initializeDB();
  })
  .catch((e) => {
    console.log(e);
  });

const app = express();
const port = process.env.FINANCE_BACKEND_PORT;

// setup cors to allow all origins
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://dev.zeonhq.com",
      "https://app.zeonhq.com",
    ],
    // ALLOW ALL METHODs
    methods: "*",
    // ALLOW ALL HEADERS
    allowedHeaders: "*",
    credentials: true,
  })
);

// set up router
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up routes
app.use("/expense", expenseRoutes);
app.use("/category", categoryRoutes);
app.get("/health", (req: Request, res: Response) => {
  console.log("finance service health check");
  res.send("all ok from zeon finance service");
});
app.use("/", rootRoutes);


// run server at port 6000
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
