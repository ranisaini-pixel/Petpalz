"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userAvailabilitySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
    collection: "user_availabilities",
    versionKey: false,
});
const userAvailabilityModel = mongoose_1.default.model("user_availabilities", userAvailabilitySchema);
exports.default = userAvailabilityModel;
//# sourceMappingURL=userAvailabilityModel.js.map