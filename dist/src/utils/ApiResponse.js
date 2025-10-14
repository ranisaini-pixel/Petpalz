"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, message = "Success", data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}
exports.ApiResponse = ApiResponse;
// export { ApiResponse };
const successResponse = (data, message = "Success") => {
    return new ApiResponse(200, message, data);
};
exports.successResponse = successResponse;
const errorResponse = (message = "Error", statusCode = 400) => {
    return new ApiResponse(statusCode, message, null);
};
exports.errorResponse = errorResponse;
//# sourceMappingURL=ApiResponse.js.map