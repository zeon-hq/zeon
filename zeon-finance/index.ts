import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { verifyIdentity, initializeDB } from 'zeon-core/dist/func'
import cors from "cors";
import expenseRoutes from "./routes/expense";
import categoryRoutes from "./routes/category";
import rootRoutes from "./routes/root";
import mongoose from "mongoose"



mongoose
  //@ts-ignore
  .connect("mongodb+srv://ajaym94:Kasphersky1@cluster0.gxtzcur.mongodb.net/", {dbName: "finance"})
  .then(() => {
    console.log("Connected to DB from finance");
    initializeDB()
  })
  .catch((e) => {
    console.log(e);
  });

const app = express();
const port = process.env.PORT


// setup cors to allow all origins
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001","https://dev.zeonhq.com"],
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
app.use("/expense", expenseRoutes);
app.use("/category", categoryRoutes);
app.use("/", rootRoutes);



// run server at port 6000
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

