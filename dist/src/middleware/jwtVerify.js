"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const userModel_1 = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
dotenv.config();
const verifyJWT = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError_1.ApiError(401, "Unauthorized request");
        }
        // Verify token
        const decodedTokenInfo = jwt.verify(token, process.env.PRIVATE_KEY);
        const user = await userModel_1.default.findById(decodedTokenInfo.id);
        if (!user) {
            throw new ApiError_1.ApiError(401, "Unauthorized request");
        }
        if (token !== user?.token) {
            throw new ApiError_1.ApiError(401, "Unauthorized request");
        }
        // Attach user to request
        res.locals.user = user;
        next();
    }
    catch (error) {
        console.log("Error:", error);
        res.status(400).json(new ApiResponse_1.ApiResponse(400, error.message, null));
    }
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=jwtVerify.js.map