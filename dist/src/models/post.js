"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    commentCount: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {
    timestamps: true,
    collection: "posts",
    versionKey: false,
});
const post = mongoose_1.default.model("posts", postSchema);
exports.default = post;
//# sourceMappingURL=post.js.map