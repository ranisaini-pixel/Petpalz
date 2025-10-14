"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const citySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    state: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "states",
        required: true,
    },
}, {
    timestamps: true,
    collection: "cities",
    versionKey: false,
});
const cityModel = mongoose_1.default.model("cities", citySchema);
exports.default = cityModel;
//# sourceMappingURL=cityModel.js.map