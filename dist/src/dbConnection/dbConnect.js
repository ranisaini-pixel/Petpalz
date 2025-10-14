"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const connectDb = async () => {
    try {
        await mongoose_1.default.connect("mongodb://127.0.0.1:27017/Geography");
        console.log("Mongodb Connected Successful");
    }
    catch (error) {
        console.log("Mongodb Connection Failed");
    }
};
exports.default = connectDb;
//# sourceMappingURL=dbConnect.js.map