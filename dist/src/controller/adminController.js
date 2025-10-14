"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDetails = exports.ForgotPassword = exports.loginAdmin = void 0;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const userModel_1 = require("../models/userModel");
const nodemailer_1 = require("../utils/nodemailer");
const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let existedUser = await userModel_1.default.findOne({ email });
        if (!existedUser) {
            return next(new ApiError_1.ApiError(400, "Invalid credentials"));
        }
        else {
            if (existedUser.role === "1") {
                let isPasswordValidate = await bcrypt.compare(password, existedUser.password);
                if (!isPasswordValidate) {
                    return next(new ApiError_1.ApiError(400, "Invalid credentials"));
                }
                else {
                    const token = jwt.sign({ id: existedUser._id }, process.env.PRIVATE_KEY, {
                        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
                    });
                    await userModel_1.default.findOneAndUpdate({ email }, {
                        $set: {
                            token: token,
                        },
                    }, {
                        new: true,
                        upsert: true,
                    });
                    const loggedInUser = await userModel_1.default
                        .findById(existedUser._id)
                        .select("-firstName -lastName -gender -email -password -country -state -city -congregationName -pinCode -stateId -cityId -createdAt -updatedAt");
                    return res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, "Login Successful", loggedInUser));
                }
            }
            else {
                return next(new ApiError_1.ApiError(400, "Access Denied, You are not an admin"));
            }
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.loginAdmin = loginAdmin;
const ForgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        let otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiration = moment().add(2, "minutes").toDate();
        let existedUser = await userModel_1.default.findOne({ email });
        if (existedUser) {
            //send OTP on mail
            await (0, nodemailer_1.sendMail)(email, "Your OTP Code", `Your OTP is: ${otp} <p>Valid for 2 minutes</p >`);
            //otp saved to database
            let otpSaved = await userModel_1.default.findOneAndUpdate({ email }, {
                $set: {
                    otp: otp,
                    otpExpiration: otpExpiration,
                },
            }, {
                new: true,
            });
            if (!otpSaved) {
                return next(new ApiError_1.ApiError(400, "OTP not saved"));
            }
            return res
                .status(201)
                .json(new ApiResponse_1.ApiResponse(201, "OTP saved successfully", {}));
        }
        else {
            return next(new ApiError_1.ApiError(400, "Admin not exists"));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.ForgotPassword = ForgotPassword;
const getAdminDetails = async (req, res, next) => {
    try {
        const { _id } = req.query;
        const admin = await userModel_1.default
            .findById({ _id })
            .select("-password -isDeleted -token");
        if (!admin) {
            return next(new ApiError_1.ApiError(400, "Admin not found"));
        }
        else {
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, "Admin Details", admin));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.getAdminDetails = getAdminDetails;
//# sourceMappingURL=adminController.js.map