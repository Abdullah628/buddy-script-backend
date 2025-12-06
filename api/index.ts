import mongoose from "mongoose";
import app from "../src/app";
import { envVars } from "../src/config/env";

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  
  try {
    await mongoose.connect(envVars.DB_URL);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default async (req: any, res: any) => {
  await connectDB();
  return app(req, res);
};
