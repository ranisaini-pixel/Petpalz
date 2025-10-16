"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express = require("express");
const dotenv = require("dotenv");
const dbConnection_1 = require("./src/db/dbConnection");
dotenv.config();
class App {
    constructor(port, base_url) {
        this.app = express();
        this.port = port;
        this.base_url = base_url;
    }
    async initialize() {
        this.initializeMiddlewares();
        this.initializeRoutes();
    }
    initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }
    initializeRoutes() {
        this.app.use("/api");
    }
    connectDatabase() {
        dbConnection_1.connectDB
            .then(() => {
            this.app.listen(this.port, () => {
                console.log(`🚀 Server is running on ${this.base_url}${this.port}`);
            });
        })
            .catch((error) => {
            console.log("Server connection error", error);
            process.exit();
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map