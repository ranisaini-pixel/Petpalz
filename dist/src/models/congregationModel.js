"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const congregationSchema = new mongoose_1.Schema({
    congregationName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    congregationState: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "states",
        required: true,
    },
    congregationCity: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "cities",
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    collection: "congregations",
    versionKey: false,
});
const congregationModel = mongoose_1.default.model("congregations", congregationSchema);
exports.default = congregationModel;
//# sourceMappingURL=congregationModel.js.map