"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserComments = exports.deleteComment = exports.updateComment = exports.addComment = void 0;
const dotenv = require("dotenv");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const post_1 = require("../models/post");
const responseMessages_1 = require("../utils/responseMessages");
const comment_1 = require("../models/comment");
const mongoose_1 = require("mongoose");
dotenv.config();
const addComment = async (req, res, next) => {
    try {
        const { postId, content, parentComment } = req.body;
        const user = res.locals.user;
        const existedPost = await post_1.default.findById(postId);
        if (!existedPost) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.POST_NOT_FOUND));
        }
        const newComment = new comment_1.default({
            postId,
            userId: user,
            content,
            parentComment: parentComment || null,
        });
        const savedComment = await newComment.save();
        await post_1.default.updateOne({ _id: postId }, {
            $inc: { commentCount: 1 },
        });
        return res
            .status(201)
            .json(new ApiResponse_1.ApiResponse(201, responseMessages_1.SUCCESS_MESSAGES.COMMENT_ADDED, savedComment));
    }
    catch (error) {
        console.log(error);
        next(error);
    }
};
exports.addComment = addComment;
const updateComment = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const commentExists = await comment_1.default.findById({ _id });
        if (!commentExists) {
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.COMMENT_NOT_FOUND));
        }
        const updatedComment = await comment_1.default.findByIdAndUpdate({ _id }, {
            $set: {
                content: req.body.content,
            },
        }, { new: true, runValidators: true });
        if (!updatedComment) {
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.COMMENT_NOT_UPDATED));
        }
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.COMMENT_UPDATED, updatedComment));
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.updateComment = updateComment;
const deleteComment = async (req, res, next) => {
    try {
        const { _id } = req.params;
        let userId = res.locals.user._id;
        const commentExists = await comment_1.default.findById(_id);
        if (!commentExists) {
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.COMMENT_NOT_FOUND));
        }
        if (commentExists.userId.toString() !== userId.toString()) {
            return next(new ApiError_1.ApiError(403, responseMessages_1.ERROR_MESSAGES.UNAUTHORIZED_ACTION));
        }
        const deleted = await comment_1.default.findByIdAndDelete({ _id });
        if (!deleted) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.COMMENT_NOT_DELETED));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.COMMENT_DELETED, null));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.deleteComment = deleteComment;
const getUserComments = async (req, res, next) => {
    try {
        const userId = res.locals.user;
        if (!userId) {
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        const pipeline = [];
        pipeline.push({
            $match: {
                userId: new mongoose_1.default.Types.ObjectId(userId),
            },
        }, {
            $project: {
                userId: 1,
                content: 1,
            },
        });
        const postDetails = await comment_1.default.aggregate(pipeline);
        const totalPosts = await comment_1.default.countDocuments({ userId: userId });
        if (!postDetails.length) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.POST_NOT_FOUND));
        }
        else {
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.POST_FOUND, {
                postDetails,
                totalPosts,
            }));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.getUserComments = getUserComments;
//# sourceMappingURL=commentController.js.map