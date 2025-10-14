"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var statusType;
(function (statusType) {
    statusType["pending"] = "0";
    statusType["confirmed"] = "1";
    statusType["cancelled"] = "2";
    statusType["closed"] = "3";
})(statusType || (statusType = {}));
var preferenceType;
(function (preferenceType) {
    preferenceType["I can Drive"] = "0";
    preferenceType["I Need a Ride"] = "1";
})(preferenceType || (preferenceType = {}));
var responseType;
(function (responseType) {
    responseType["Yes! Text Me"] = "0";
    responseType["Yes! Call Me"] = "1";
    responseType["I Can't Right"] = "2";
    responseType["Possibly Later"] = "3";
    responseType["Text Me"] = "4";
    responseType["Call Me"] = "5";
})(responseType || (responseType = {}));
const requestUserSchema = new mongoose_1.Schema({
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    preference: {
        type: String,
        enum: preferenceType,
        required: true,
    },
    numberOfPassenger: {
        type: Number,
        default: null,
    },
    response: {
        type: String,
        enum: responseType,
        default: null,
    },
    status: {
        type: String,
        enum: statusType,
        default: statusType.pending,
        required: true,
    },
}, {
    timestamps: true,
    collection: "requestedUsers",
    versionKey: false,
});
const requestUserModel = mongoose_1.default.model("requestedUsers", requestUserSchema);
exports.default = requestUserModel;
//# sourceMappingURL=requestUserModel.js.map