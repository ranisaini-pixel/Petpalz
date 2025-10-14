"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserList = exports.deleteUser = exports.logoutUser = exports.changePassword = exports.resetPassword = exports.getUserById = exports.updateUser = exports.otpVerification = exports.sendOTP = exports.loginUser = exports.signup = void 0;
const userModel_1 = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const dotenv = require("dotenv");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const nodemailer_1 = require("../utils/nodemailer");
dotenv.config();
const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, gender, email, password, congregationName, pinCode, stateId, cityId, } = req.body;
        const existedUser = await userModel_1.default.findOne({ email });
        if (existedUser?.isDeleted === true) {
            return next(new ApiError_1.ApiError(400, "User Profile Deleted"));
        }
        if (existedUser) {
            return next(new ApiError_1.ApiError(400, "User already exists"));
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel_1.default({
                firstName,
                lastName,
                gender,
                email,
                password: hashedPassword,
                congregationName,
                pinCode,
                stateId,
                cityId,
            });
            await newUser?.save();
            const createdUser = await userModel_1.default
                .findById(newUser._id)
                .select("-password");
            if (!createdUser) {
                return next(new ApiError_1.ApiError(400, "User not created"));
            }
            return res
                .status(201)
                .json(new ApiResponse_1.ApiResponse(201, "User created successfully", createdUser));
        }
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
};
exports.signup = signup;
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let existedUser = await userModel_1.default.findOne({ email });
        if (!existedUser) {
            return next(new ApiError_1.ApiError(400, "You are not registered, Register Yourself"));
        }
        else {
            let isPasswordValidate = await bcrypt.compare(password, existedUser.password);
            if (!isPasswordValidate) {
                return next(new ApiError_1.ApiError(400, "Password Incorrect"));
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
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.loginUser = loginUser;
const sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        let otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiration = moment().add(2, "minutes").toDate();
        let otpSaved = await userModel_1.default.findOneAndUpdate({ email }, {
            $set: {
                otp: otp,
                otpExpiration: otpExpiration,
            },
        }, {
            new: true,
        });
        //send OTP on mail
        await (0, nodemailer_1.sendMail)(email, "Your OTP Code", `Your OTP is: ${otp} <p>Valid for 2 minutes</p >`);
        if (!otpSaved) {
            return next(new ApiError_1.ApiError(400, "OTP not saved"));
        }
        return res
            .status(201)
            .json(new ApiResponse_1.ApiResponse(201, "OTP saved successfully", {}));
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.sendOTP = sendOTP;
const otpVerification = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const { _id } = req.query;
        const user = await userModel_1.default.findById({ _id });
        if (!user) {
            return next(new ApiError_1.ApiError(400, "User not exists"));
        }
        if (user.otp == otp) {
            if (user.otpExpiration ||
                new Date(user.otpExpiration).getTime() < Date.now()) {
                return next(new ApiError_1.ApiError(400, "OTP expired"));
            }
            else {
                await userModel_1.default.updateOne({ _id }, { $set: { otp: null, otpExpiration: null } });
                return res
                    .status(201)
                    .json(new ApiResponse_1.ApiResponse(200, "OTP verified successfully", {}));
            }
        }
        else {
            return next(new ApiError_1.ApiError(400, "Invalid OTP"));
        }
    }
    catch (error) {
        console.error("Error:", error);
        next(error);
    }
};
exports.otpVerification = otpVerification;
const updateUser = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const updatedUser = await userModel_1.default.findByIdAndUpdate({ _id }, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                gender: req.body.gender,
                email: req.body.email,
                congregationName: req.body.congregationName,
                pinCode: req.body.pinCode,
                state: req.body.state,
                city: req.body.city,
            },
        }, {
            new: true,
        });
        let updatedUserData = await userModel_1.default
            .findById({ _id })
            .select("-password -token");
        if (!updatedUser) {
            return next(new ApiError_1.ApiError(400, "User Profile not updated"));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "User Profile Updated", updatedUserData));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.updateUser = updateUser;
const getUserById = async (req, res, next) => {
    try {
        const user = await userModel_1.default
            .findById(res.locals.user._id)
            .select("-password -isDeleted -token");
        if (!user) {
            return next(new ApiError_1.ApiError(400, "User not found"));
        }
        else {
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, "user Details", user));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.getUserById = getUserById;
const resetPassword = async (req, res, next) => {
    try {
        const { _id } = req.query;
        const { password, confirmPassword } = req.body;
        if (password === confirmPassword) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await userModel_1.default.findByIdAndUpdate({ _id }, {
                $set: {
                    password: hashedPassword,
                },
            }, {
                new: true,
            });
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "Password has been Reset Successfully", {}));
        }
        else {
            return next(new ApiError_1.ApiError(400, "Password and Confirm Password should be equal"));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.resetPassword = resetPassword;
const changePassword = async (req, res, next) => {
    try {
        const { _id } = req.query;
        const { oldPassword, currentPassword, confirmPassword } = req.body;
        const user = await userModel_1.default.findById({ _id });
        if (!user) {
            next(new ApiError_1.ApiError(400, "User not found"));
        }
        let userPassword = user?.password;
        const isMatch = await bcrypt.compare(oldPassword, userPassword);
        if (isMatch) {
            if (oldPassword !== currentPassword) {
                if (currentPassword === confirmPassword) {
                    const hashedPassword = await bcrypt.hash(confirmPassword, 10);
                    await userModel_1.default.findByIdAndUpdate({ _id }, {
                        $set: {
                            password: hashedPassword,
                        },
                    }, {
                        new: true,
                    });
                    return res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, "Password has been changed Successfully", {}));
                }
                else {
                    next(new ApiError_1.ApiError(400, "currentPassword and confirmPassword should be equal"));
                }
            }
            else {
                next(new ApiError_1.ApiError(400, "oldPassword and currentPassword should not be equal"));
            }
        }
        else {
            next(new ApiError_1.ApiError(400, "Incorrect Password"));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.changePassword = changePassword;
const logoutUser = async (req, res) => {
    try {
        const { _id } = req.query;
        const user = await userModel_1.default.findById(_id);
        if (user) {
            await userModel_1.default.findByIdAndUpdate({ _id }, {
                $set: {
                    token: null,
                },
            }, {
                new: true,
            });
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "User Logout Successfully", {}));
        }
        else {
            next(new ApiError_1.ApiError(400, "User not found"));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.logoutUser = logoutUser;
const deleteUser = async (req, res, next) => {
    try {
        let _id = res.locals.user._id;
        let user = await userModel_1.default.findById({ _id });
        let addDeletedToEmail = user?.email + "_deleted_user";
        const deleted = await userModel_1.default.findByIdAndUpdate({ _id }, {
            $set: {
                isDeleted: true,
                email: addDeletedToEmail,
            },
        });
        if (!deleted) {
            return next(new ApiError_1.ApiError(400, "User not deleted"));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "User deleted successfully", null));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.deleteUser = deleteUser;
const getUserList = async (req, res) => {
    try {
        const usersList = await userModel_1.default
            .find()
            .select("-password -role -isDeleted -otp -otpExpiration -pinCode -congregationName -token -updatedAt -__v");
        if (!usersList) {
            return next(new ApiError_1.ApiError(400, "Users list not found"));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "Users List", usersList));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.getUserList = getUserList;
function next(arg0) {
    throw new Error("Function not implemented.");
}
function data(value) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=userController.js.map