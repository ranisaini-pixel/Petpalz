"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "posts",
        required: true,
    },
    userId: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
    ],
    content: {
        type: String,
        required: true,
    },
    parentComment: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "comments",
            default: null,
        },
    ],
}, {
    timestamps: true,
    collection: "comments",
    versionKey: false,
});
//TTL index, this will auto delete comments after 24 hours
commentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });
commentSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });
const comment = mongoose_1.default.model("comments", commentSchema);
exports.default = comment;
//# sourceMappingURL=comment.js.map