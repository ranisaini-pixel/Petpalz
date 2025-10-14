"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const ApiError_1 = require("../utils/ApiError");
const isAdmin = async (req, res, next) => {
    try {
        if (role === "admin") {
            next();
        }
        else {
            return next(new ApiError_1.ApiError(400, "Access denied: Admin role required."));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.isAdmin = isAdmin;
function next(error) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=isAdmin.js.map