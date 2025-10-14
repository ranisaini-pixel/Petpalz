"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const stateSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    countryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "country",
        required: true,
    },
}, {
    timestamps: true,
    collection: "states",
    versionKey: false,
});
const stateModel = mongoose_1.default.model("states", stateSchema);
exports.default = stateModel;
//# sourceMappingURL=stateModel.js.map