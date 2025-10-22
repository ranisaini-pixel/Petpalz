"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var likeType;
(function (likeType) {
    likeType["post"] = "0";
    likeType["comment"] = "1";
})(likeType || (likeType = {}));
const likeSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true,
    },
    entityId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: likeType,
        required: true,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    collection: "likes",
    versionKey: false,
});
// To prevent double likes
likeSchema.index({ entityId: 1, userId: 1 }, { unique: true });
const like = mongoose_1.default.model("likes", likeSchema);
exports.default = like;
//# sourceMappingURL=like.js.map