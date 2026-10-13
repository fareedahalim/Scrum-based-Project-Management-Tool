import mongoose from "mongoose";
import logger from "../../config/logger.js";
import { env } from "../../config/env.js";

export const connectMongoDB = async(): Promise<void> => {
    try {
       await mongoose.connect(env.MONGODB_URI);
       logger.info("MongoDB connected"); 
    } catch (error) {
        logger.error("MongoDB connection failed", error);
        process.exit(1);
        
    }
}