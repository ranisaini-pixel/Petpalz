"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
// Extending the Core Node.js Error class
class ApiError extends Error {
    //our own constructor
    constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;
        // console.log("inside api error");
        //proper error line where error locating
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor); //context
        }
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map