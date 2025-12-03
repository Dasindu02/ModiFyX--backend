// api/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import serverless from "serverless-http";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URL = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("ModifyX Backend Running Successfully on Vercel!");
});

// ❗IMPORTANT: Do NOT use app.listen() on Vercel
// Export serverless handler instead
export const handler = serverless(app);
