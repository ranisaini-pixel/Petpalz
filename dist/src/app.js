"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express = require("express");
const userRoutes_1 = require("./routes/userRoutes");
const dotenv = require("dotenv");
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
    }
    initializeRoutes() {
        this.app.use("/api/v1/users", userRoutes_1.default);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map