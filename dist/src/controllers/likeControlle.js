"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLike = void 0;
const dotenv = require("dotenv");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const post_1 = require("../models/post");
const responseMessages_1 = require("../utils/responseMessages");
const comment_1 = require("../models/comment");
const like_1 = require("../models/like");
dotenv.config();
const toggleLike = async (req, res, next) => {
    try {
        const { entityId, type } = req.body;
        const userId = res.locals.user._id;
        if (type === "0") {
            const blogExists = await post_1.default.findById(entityId);
            if (!blogExists)
                return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.POST_NOT_FOUND));
        }
        else if (type === "1") {
            const commentExists = await comment_1.default.findById(entityId);
            if (!commentExists)
                return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.COMMENT_NOT_FOUND));
        }
        else {
            return next(new ApiError_1.ApiError(400, "Invalid type. Use 0 for blog, 1 for comment"));
        }
        const existingLike = await like_1.default.findOne({ userId, entityId, type });
        if (existingLike) {
            await existingLike.deleteOne(); // unliked the blog/post
            //decrement blog like by 1
            if (existingLike.type === "0") {
                await post_1.default.updateOne({ _id: entityId }, {
                    $inc: { likeCount: -1 },
                });
            }
            //decrement comment like by 1
            if (existingLike.type === "1") {
                await comment_1.default.updateOne({ _id: entityId }, {
                    $inc: { likeCount: -1 },
                });
            }
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "Unliked successfully", {}));
        }
        else {
            const newLike = new like_1.default({ userId, entityId, type });
            const liked = await newLike.save();
            //increment blog like by 1
            if (liked.type === "0") {
                await post_1.default.updateOne({ _id: entityId }, {
                    $inc: { likeCount: 1 },
                });
            }
            //increment comment like by 1
            if (liked.type === "1") {
                await comment_1.default.updateOne({ _id: entityId }, {
                    $inc: { likeCount: 1 },
                });
            }
            return res
                .status(201)
                .json(new ApiResponse_1.ApiResponse(201, "Liked successfully", {}));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.toggleLike = toggleLike;
//# sourceMappingURL=likeControlle.js.map