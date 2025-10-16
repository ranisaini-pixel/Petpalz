import mongoose from "mongoose";
import { MONGO_URI } from "../../constant";

export const connectDB = mongoose
  .connect(MONGO_URI)
  .then(() => {
    // console.log("MongoDB connected and redirected to server");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit();
  });
