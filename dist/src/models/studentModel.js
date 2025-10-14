"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const stateSchema = new mongoose_1.Schema({
    rollNo: {
        type: Number,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    collegeName: {
        type: String,
        required: true,
        trim: true,
    },
    token: {
        type: String,
    },
    course: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "countries",
        required: true,
    },
    state: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "states",
        required: true,
    },
    city: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "cities",
        required: true,
    },
}, {
    timestamps: true,
    collection: "students",
});
const studentModel = mongoose_1.default.model("students", stateSchema);
exports.default = studentModel;
//# sourceMappingURL=studentModel.js.map