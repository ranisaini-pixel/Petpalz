"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiResponse_1 = require("../utils/ApiResponse");
//Global Error Handler
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";
    const message = err.message;
    return res.status(statusCode).json(new ApiResponse_1.ApiResponse(statusCode, message, {}));
};
exports.default = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map