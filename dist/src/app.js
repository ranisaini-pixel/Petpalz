"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express = require("express");
const userRoutes_1 = require("./routes/userRoutes");
const postRoute_1 = require("./routes/postRoute");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
class App {
    constructor(port, base_url) {
        this.app = express();
        this.port = port;
        this.base_url = base_url;
    }
    async initialize() {
        try {
            this.app.listen(this.port, () => {
                console.log(`🚀 Server is running on ${this.base_url}${this.port}`);
            });
        }
        catch (error) {
            console.log("Server Connection error:", error);
            process.exit();
        }
        this.initializeMiddlewares();
        this.initializeRoutes();
    }
    initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // Serve static files (e.g., uploaded images)
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        }));
        this.app.use(express.json({
            limit: "16kb",
        }));
        this.app.use(express.urlencoded({ extended: true, limit: "16kb" }));
        this.app.use(express.static("public"));
        this.app.use(cookieparser());
    }
    initializeRoutes() {
        this.app.use("/api/v1/users", userRoutes_1.default);
        this.app.use("/api/v1/posts", postRoute_1.default);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map