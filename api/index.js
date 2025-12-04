import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import serverless from "serverless-http";

dotenv.config();

// connect only once
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API root OK");
});

app.use("/api/auth", authRoutes);

export default serverless(app);
