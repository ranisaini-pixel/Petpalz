"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var statusType;
(function (statusType) {
    statusType["pending"] = "0";
    statusType["confirmed"] = "1";
    statusType["cancelled"] = "2";
})(statusType || (statusType = {}));
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
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: statusType,
        required: true,
    },
}, {
    timestamps: true,
    collection: "users",
    versionKey: false,
});
const requestUserModel = mongoose_1.default.model("users", requestUserSchema);
exports.default = requestUserModel;
//# sourceMappingURL=requestUsedModel.js.map