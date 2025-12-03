import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "../routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// connect to MongoDB 
let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

app.use("/auth", authRoutes);

// Export handler for Vercel
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
