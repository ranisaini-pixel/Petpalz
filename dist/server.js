"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const app_1 = require("./src/app");
const dbConnection_1 = require("./src/db/dbConnection");
dotenv.config();
const port = process.env.PORT || 3000;
const base_url = process.env.BASE_URL || "";
const myApp = new app_1.App(port, base_url);
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