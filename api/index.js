// api/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import serverless from "serverless-http";

dotenv.config();

// ❗ Connect only once (global, outside requests)
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("API is working!");
});

// Auth routes
app.use("/api/auth", authRoutes);

export default serverless(app);
