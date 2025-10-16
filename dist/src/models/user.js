"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var SSOType;
(function (SSOType) {
    SSOType["google"] = "1";
    SSOType["apple"] = "2";
    SSOType["twitter"] = "3";
    SSOType["facebook"] = "4";
})(SSOType || (SSOType = {}));
const socialDetailSchema = new mongoose_1.Schema({
    SSOType: {
        type: String,
        enum: SSOType,
    },
    socialId: {
        type: String,
    },
}, { _id: false });
const userSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    mobileNumber: {
        type: Number,
    },
    isMobileVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },
    otp: {
        type: String,
    },
    otpExpiration: {
        type: Date,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    socialDetails: [socialDetailSchema],
    token: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {
    timestamps: true,
    collection: "users",
    versionKey: false,
});
const user = mongoose_1.default.model("users", userSchema);
exports.default = user;
//# sourceMappingURL=user.js.map