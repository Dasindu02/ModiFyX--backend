// api/index.js
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

// Root route
app.get("/", async (req, res) => {
  try {
    await connectDB(); // connect to MongoDB per request
    res.send("API is working!");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB connection failed");
  }
});

// Auth routes
app.use("/api/auth", async (req, res, next) => {
  try {
    await connectDB(); // connect per request
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("DB connection failed");
  }
}, authRoutes);

// Export serverless handler
export default serverless(app);
