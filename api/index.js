import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import serverless from "serverless-http";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Start DB connection (do NOT await here)
const dbReady = connectDB();

// Ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  await dbReady;
  next();
});

app.get("/", (req, res) => {
  res.send("API root OK");
});

app.use("/api/auth", authRoutes);

export default serverless(app);
