"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.getPostsList = exports.getPostByUserId = exports.getPostById = exports.updatePost = exports.createPost = void 0;
const dotenv = require("dotenv");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const post_1 = require("../models/post");
const successMessage_1 = require("../utils/successMessage");
const mongoose_1 = require("mongoose");
dotenv.config();
const createPost = async (req, res, next) => {
    try {
        const content = req.file;
        const author = req.file;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const newPost = new post_1.default({
            content,
            author,
            file,
        });
        let postCreated = await newPost?.save();
        if (!postCreated) {
            return next(new ApiError_1.ApiError(400, successMessage_1.ERROR_MESSAGES.POST_NOT_CREATED));
        }
        const postWithAuthor = await post_1.default.aggregate([
            {
                $match: { _id: postCreated._id },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails",
                },
            },
            {
                $unwind: "$authorDetails",
            },
            {
                $project: {
                    content: 1,
                    createdAt: 1,
                    "authorDetails._id": 1,
                    "authorDetails.username": 1,
                    "authorDetails.profileImage": 1,
                },
            },
        ]);
        return res
            .status(201)
            .json(new ApiResponse_1.ApiResponse(201, successMessage_1.SUCCESS_MESSAGES.POST_CREATED, postWithAuthor));
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
};
exports.createPost = createPost;
const updatePost = async (req, res, next) => {
    try {
        const { _id } = req.params;
        await post_1.default.findByIdAndUpdate({ _id }, {
            $set: {
                content: req.body.content,
            },
        }, {
            new: true,
        });
        let updatedPostData = await post_1.default.findById({ _id });
        if (!updatedPostData) {
            return next(new ApiError_1.ApiError(400, successMessage_1.ERROR_MESSAGES.POST_NOT_UPDATED));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, successMessage_1.SUCCESS_MESSAGES.POST_UPDATED, updatedPostData));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.updatePost = updatePost;
const getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = res.locals.user;
        if (!userId) {
            return next(new ApiError_1.ApiError(404, successMessage_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        const pipeline = [];
        pipeline.push({
            $match: {
                postId,
            },
        }, {
            $project: {
                author: 1,
                content: 1,
            },
        });
        const postDetails = await post_1.default.aggregate(pipeline);
        const totalPosts = await post_1.default.countDocuments({ author: userId });
        if (!postDetails.length) {
            return next(new ApiError_1.ApiError(400, successMessage_1.ERROR_MESSAGES.POST_NOT_FOUND));
        }
        else {
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, successMessage_1.SUCCESS_MESSAGES.POST_FOUND, {
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
exports.getPostById = getPostById;
const getPostByUserId = async (req, res, next) => {
    try {
        const userId = res.locals.user;
        if (!userId) {
            return next(new ApiError_1.ApiError(404, successMessage_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        const pipeline = [];
        pipeline.push({
            $match: {
                author: new mongoose_1.default.Types.ObjectId(userId),
            },
        }, {
            $project: {
                author: 1,
                content: 1,
            },
        });
        const postDetails = await post_1.default.aggregate(pipeline);
        const totalPosts = await post_1.default.countDocuments({ author: userId });
        if (!postDetails.length) {
            return next(new ApiError_1.ApiError(400, successMessage_1.ERROR_MESSAGES.POST_NOT_FOUND));
        }
        else {
            return res.status(200).json(new ApiResponse_1.ApiResponse(200, successMessage_1.SUCCESS_MESSAGES.POST_FOUND, {
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
exports.getPostByUserId = getPostByUserId;
const getPostsList = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, searchTerm = "" } = req.query;
        const pipeline = [
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDetails",
                },
            },
            { $unwind: "$authorDetails" },
        ];
        if (searchTerm && searchTerm !== "") {
            pipeline.push({
                $match: {
                    $or: [
                        {
                            "authorDetails.fullName": {
                                $regex: searchTerm,
                                $options: "i",
                            },
                        },
                        {
                            "authorDetails.userName": {
                                $regex: searchTerm,
                                $options: "i",
                            },
                        },
                        {
                            "authorDetails.email": {
                                $regex: searchTerm,
                                $options: "i",
                            },
                        },
                    ],
                },
            });
        }
        pipeline.push({
            $project: {
                fullName: "$authorDetails.fullName",
                userName: "$authorDetails.userName",
                email: "$authorDetails.email",
                content: 1,
            },
        });
        pipeline.push({ $sort: { createdAt: -1 } }, { $skip: (Number(page) - 1) * Number(limit) }, { $limit: Number(limit) });
        const result = await post_1.default.aggregate(pipeline);
        const totalCount = await post_1.default.countDocuments(result);
        return res.status(201).json(new ApiResponse_1.ApiResponse(201, successMessage_1.SUCCESS_MESSAGES.POST_LIST_FOUND, {
            result,
            page,
            limit,
            totalCount,
        }));
    }
    catch (error) {
        next(error);
        console.log("Error:", error);
    }
};
exports.getPostsList = getPostsList;
const deletePost = async (req, res, next) => {
    try {
        const userId = res.locals.user._id;
        const { _id } = req.params;
        if (!userId) {
            return next(new ApiError_1.ApiError(404, successMessage_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        const deleted = await post_1.default.findByIdAndUpdate({ _id }, {
            $set: {
                isDeleted: true,
            },
        });
        if (!deleted) {
            return next(new ApiError_1.ApiError(400, successMessage_1.ERROR_MESSAGES.POST_NOT_DELETED));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, successMessage_1.SUCCESS_MESSAGES.POST_DELETED, null));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.deletePost = deletePost;
//# sourceMappingURL=postControllers.js.map