"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = require("mongoose");
const constant_1 = require("../../constant");
exports.connectDB = mongoose_1.default
    .connect(constant_1.MONGO_URI)
    .then(() => {
    // console.log("MongoDB connected and redirected to server");
})
    .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit();
});
//# sourceMappingURL=dbConnection.js.map