// api/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import serverless from "serverless-http";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Root route (optional)
app.get("/", (req, res) => {
  res.send("API is working!");
});

// API routes
app.use("/api/auth", authRoutes);

// Export the serverless handler
export const handler = serverless(app);
