import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
   try {
        await mongoose.connect("mongodb://127.0.0.1:27017/spotifyClone");
        console.log("✔ Connection Stablished");
    } catch (error) {
        console.log("Connection issue.", error.message);
    }
}

export default connectDB;