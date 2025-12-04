import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = conn.connection.readyState;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
};

export default connectDB;
