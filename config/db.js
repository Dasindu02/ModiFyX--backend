import mongoose from "mongoose";

let cached = global.mongoose; // global cache
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn; // use existing connection
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // avoid buffering during cold start
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
