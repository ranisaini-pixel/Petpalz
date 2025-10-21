import * as dotenv from "dotenv";
import { App } from "./src/app";

import { connectDB } from "./src/db/dbConnection";

dotenv.config();
const port = process.env.PORT || 3000;
const base_url = process.env.BASE_URL || "";

const myApp = new App(port, base_url);

connectDB
  .then(() => {
    console.log("MongoDB connected");
    myApp.initialize(); // Start the server
  })
  .catch((err) => {
    console.error("Server connection error:", err);
    process.exit();
  });
