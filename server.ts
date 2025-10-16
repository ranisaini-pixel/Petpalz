import * as express from "express";
import * as dotenv from "dotenv";
import * as cors from "cors";
import { App } from "./src/app";
import * as cookieparser from "cookie-parser";
import { connectDB } from "./src/db/dbConnection";

dotenv.config();
const port = process.env.PORT || 3000;
const base_url = process.env.BASE_URL || "";

const myApp = new App(port, base_url);

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));
app.use(cookieparser());

connectDB
  .then(() => {
    console.log("MongoDB connected");
    myApp.initialize(); // Start the server
  })
  .catch((err) => {
    console.error("Server connection error:", err);
    process.exit();
  });
