"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const countrySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
}, {
    timestamps: true,
    collection: "countries",
    versionKey: false,
});
const countryModel = mongoose_1.default.model("countries", countrySchema);
exports.default = countryModel;
//# sourceMappingURL=countryModel.js.map