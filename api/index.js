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

// Middleware to connect DB on every request (reuses cached connection)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).send("Database connection failed");
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("API root OK");
});

// Auth routes
app.use("/api/auth", authRoutes);

export default serverless(app);
