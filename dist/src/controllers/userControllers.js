"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersList = exports.getUserPosts = exports.getUsersById = exports.SSOLogin = exports.MobileOtpVerification = exports.loginWithMobileNumber = exports.loginUser = exports.checkEmail = exports.signup = void 0;
const user_1 = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const responseMessages_1 = require("../utils/responseMessages");
const mongoose_1 = require("mongoose");
const post_1 = require("../models/post");
dotenv.config();
const signup = async (req, res, next) => {
    try {
        const { userName, fullName, email, mobileNumber, dateOfBirth, password, socialDetails, } = req.body;
        const profileImage = req.file;
        const existedUser = await user_1.default.findOne({ email });
        if (existedUser) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.USER_ALREADY_EXISTS));
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const finalFullName = fullName && fullName.trim() !== "" ? fullName : userName;
            const newUser = new user_1.default({
                userName,
                fullName: finalFullName,
                email,
                password: hashedPassword,
                mobileNumber,
                dateOfBirth,
                profileImage: profileImage?.filename,
            });
            if (socialDetails && socialDetails.length > 0) {
                newUser.socialDetails = socialDetails;
            }
            const createdUser = await newUser?.save();
            delete createdUser?.password;
            if (!createdUser) {
                return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.USER_NOT_CREATED));
            }
            return res
                .status(201)
                .json(new ApiResponse_1.ApiResponse(201, responseMessages_1.SUCCESS_MESSAGES.USER_CREATED, createdUser));
        }
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
};
exports.signup = signup;
const checkEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const emailExisted = await user_1.default.findOne({ email });
        if (emailExisted) {
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.EMAIL_EXISTED));
        }
        else {
            return res
                .status(202)
                .json(new ApiResponse_1.ApiResponse(202, responseMessages_1.SUCCESS_MESSAGES.EMAIL_NOT_EXISTS, {}));
        }
    }
    catch (error) {
        next(error);
        console.log(error);
    }
};
exports.checkEmail = checkEmail;
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let existedUser = await user_1.default.findOne({ email });
        if (!existedUser) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.USER_NOT_REGISTERED));
        }
        else {
            let isPasswordValidate = bcrypt.compare(password, existedUser.password || "");
            if (!isPasswordValidate) {
                return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.PASSWORD_INCORRECT));
            }
            else {
                const token = jwt.sign({ id: existedUser._id }, process.env.PRIVATE_KEY, {
                    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
                });
                const loggedInUserDetails = await user_1.default.findOneAndUpdate({ email }, {
                    $set: {
                        token: token,
                    },
                }, {
                    new: true,
                    upsert: true,
                });
                return res
                    .status(200)
                    .json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.LOGIN_USER_SUCCESSFULLY, loggedInUserDetails));
            }
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.loginUser = loginUser;
const loginWithMobileNumber = async (req, res, next) => {
    try {
        const { mobileNumber } = req.body;
        const mobileNumberExists = await user_1.default.findOne({ mobileNumber });
        if (mobileNumberExists) {
            await user_1.default.findOneAndUpdate({ mobileNumber }, {
                $set: {
                    otp: "0000",
                    otpExpiration: new Date(),
                },
            });
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, responseMessages_1.ERROR_MESSAGES.OTP_SEND_SUCCESSFULLY, {}));
        }
        else {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.MOBILE_NUMBER_NOT_EXISTS));
        }
    }
    catch (error) {
        next(error);
        console.log(error);
    }
};
exports.loginWithMobileNumber = loginWithMobileNumber;
const MobileOtpVerification = async (req, res, next) => {
    try {
        const { otp, mobileNumber } = req.body;
        const userExists = await user_1.default.findOne({ mobileNumber });
        if (!userExists) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        if (userExists.otp !== otp) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.INVALID_OTP));
        }
        const generatedTime = new Date(userExists.otpExpiration).getTime();
        const currentTime = Date.now();
        const timeDifference = currentTime - generatedTime;
        if (!userExists.otpExpiration || timeDifference > 2 * 60 * 1000) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.OTP_EXPIRED));
        }
        await user_1.default.updateOne({ mobileNumber }, { $set: { otp: null, otpExpiration: null } });
        // const userDetails = await user.findOne({ mobileNumber });
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.OTP_VERIFIED, userExists));
    }
    catch (error) {
        console.error("Error", error);
        next(error);
    }
};
exports.MobileOtpVerification = MobileOtpVerification;
const SSOLogin = async (req, res, next) => {
    try {
        const { email, SSOType, socialId } = req.body;
        const userExists = await user_1.default.findOne({ email });
        if (!userExists) {
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        if (!userExists.socialDetails || userExists.socialDetails.length === 0) {
            userExists.socialDetails = [];
            userExists.socialDetails.push({
                SSOType: SSOType,
                socialId: socialId,
            });
            await userExists.save();
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.USER_DETAILS_UPDATED, userExists));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.USER_DETAILS_UPDATED, userExists));
        }
    }
    catch (error) {
        next(error);
        console.log("Error:", error);
    }
};
exports.SSOLogin = SSOLogin;
const getUsersById = async (req, res, next) => {
    try {
        const userId = res.locals.user;
        if (!userId) {
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        const userDetails = await user_1.default.findById(userId);
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.USER_DETAILS, userDetails));
    }
    catch (error) {
        console.error("Error", error);
        next(error);
    }
};
exports.getUsersById = getUsersById;
const getUserPosts = async (req, res, next) => {
    try {
        const userId = res.locals.user;
        if (!userId) {
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        const pipeline = [];
        pipeline.push({
            $match: {
                author: new mongoose_1.default.Types.ObjectId(userId),
            },
        }, {
            $project: {
                author: 1,
                content: 1,
            },
        });
        const postDetails = await post_1.default.aggregate(pipeline);
        const totalPosts = await post_1.default.countDocuments({ author: userId });
        if (!postDetails.length) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.POST_NOT_FOUND));
        }
        else {
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.POST_FOUND, {
                postDetails,
                totalPosts,
            }));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.getUserPosts = getUserPosts;
const getUsersList = async (req, res, next) => {
    try {
        const { searchTerm = "" } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const searchCondition = searchTerm
            ? {
                $or: [
                    { userName: { $regex: searchTerm, $options: "i" } },
                    { fullName: { $regex: searchTerm, $options: "i" } },
                    { email: { $regex: searchTerm, $options: "i" } },
                ],
            }
            : {};
        const pipeline = [];
        if (searchTerm) {
            pipeline.push({
                $match: searchCondition,
            });
            pipeline.push({
                $project: {
                    userName: 1,
                    fullName: 1,
                    email: 1,
                    isEmailVerified: 1,
                    mobileNumber: 1,
                    isMobileVerified: 1,
                    dateOfBirth: 1,
                },
            });
            pipeline.push({ $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });
            const users = await user_1.default.aggregate(pipeline);
            const totalUsers = await user_1.default.countDocuments(searchCondition);
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.USER_LIST_FETCHED, {
                pagination: {
                    total: totalUsers,
                    page,
                    limit,
                    totalPages: Math.ceil(totalUsers / limit),
                },
                users,
            }));
        }
    }
    catch (error) {
        console.error("Error", error);
        next(error);
    }
};
exports.getUsersList = getUsersList;
//# sourceMappingURL=userControllers.js.map