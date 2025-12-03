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

// Routes
app.get("/", (req, res) => res.send("API is working!"));
app.use("/api/auth", authRoutes);

// Connect to MongoDB
connectDB().catch(err => console.error("MongoDB connection failed:", err));

// Export the serverless handler
export const handler = serverless(app);
