"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app_1 = require("./src/app");
const cookieparser = require("cookie-parser");
const dbConnection_1 = require("./src/db/dbConnection");
dotenv.config();
const port = process.env.PORT || 3000;
const base_url = process.env.BASE_URL || "";
const myApp = new app_1.App(port, base_url);
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({
    limit: "16kb",
}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieparser());
dbConnection_1.connectDB
    .then(() => {
    console.log("MongoDB connected");
    myApp.initialize(); // Start the server
})
    .catch((err) => {
    console.error("Server connection error:", err);
    process.exit();
});
//# sourceMappingURL=server.js.map