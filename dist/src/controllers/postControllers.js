"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.getPostsList = exports.getPostById = exports.updatePost = exports.createPost = void 0;
const dotenv = require("dotenv");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const post_1 = require("../models/post");
const responseMessages_1 = require("../utils/responseMessages");
dotenv.config();
const createPost = async (req, res, next) => {
    try {
        const userToken = res.locals.user;
        const { userId, content } = req.body;
        const files = req.files;
        if (!userToken) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        if (!files || files.length === 0) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.UPLOAD_FAILED));
        }
        //extracting file path
        const filePaths = files.map((file) => file.filename);
        const newPost = new post_1.default({
            content,
            userId,
            files: filePaths,
        });
        let postCreated = await newPost?.save();
        if (!postCreated) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.POST_NOT_CREATED));
        }
        const postWithAuthor = await post_1.default.aggregate([
            {
                $match: { _id: postCreated._id },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
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
                    files: 1,
                    createdAt: 1,
                    "authorDetails._id": 1,
                    "authorDetails.username": 1,
                },
            },
        ]);
        return res
            .status(201)
            .json(new ApiResponse_1.ApiResponse(201, responseMessages_1.SUCCESS_MESSAGES.POST_CREATED, postWithAuthor));
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
};
exports.createPost = createPost;
const updatePost = async (req, res, next) => {
    try {
        const userId = res.locals.user._id;
        const { _id } = req.params;
        if (!userId) {
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        const existingPost = await post_1.default.findById(_id);
        if (!existingPost) {
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.POST_NOT_FOUND));
        }
        if (existingPost.userId.toString() !== userId.toString()) {
            return next(new ApiError_1.ApiError(403, responseMessages_1.ERROR_MESSAGES.UNAUTHORIZED_ACTION));
        }
        let updatedFiles = [];
        if (req.files && Array.isArray(req.files)) {
            updatedFiles = req.files.map((file) => `${file.filename}`);
        }
        const updatedPost = await post_1.default.findByIdAndUpdate(_id, {
            $set: {
                content: req.body.content,
                files: updatedFiles.length > 0 ? updatedFiles : existingPost.files,
            },
        }, { new: true });
        if (!updatedPost) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.POST_NOT_UPDATED));
        }
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.POST_UPDATED, updatedPost));
    }
    catch (error) {
        console.error("Error", error);
        next(error);
    }
};
exports.updatePost = updatePost;
const getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = res.locals.user;
        if (!userId) {
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        const pipeline = [];
        pipeline.push({
            $match: {
                postId,
            },
        }, {
            $project: {
                userId: 1,
                content: 1,
                files: 1,
            },
        });
        const postDetails = await post_1.default.aggregate(pipeline);
        const totalPosts = await post_1.default.countDocuments({ author: userId });
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
exports.getPostById = getPostById;
const getPostsList = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, searchTerm = "" } = req.query;
        const pipeline = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
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
                profileImage: 1,
                likeCount: 1,
                commentCount: 1,
                files: 1,
            },
        });
        pipeline.push({ $sort: { createdAt: -1 } }, { $skip: (Number(page) - 1) * Number(limit) }, { $limit: Number(limit) });
        const result = await post_1.default.aggregate(pipeline);
        const totalCount = await post_1.default.countDocuments(result);
        return res.status(201).json(new ApiResponse_1.ApiResponse(201, responseMessages_1.SUCCESS_MESSAGES.POST_LIST_FOUND, {
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
            return next(new ApiError_1.ApiError(404, responseMessages_1.ERROR_MESSAGES.USER_NOT_EXISTS));
        }
        const existingPost = await post_1.default.findById(_id);
        if (existingPost?.userId.toString() !== userId.toString()) {
            return next(new ApiError_1.ApiError(403, responseMessages_1.ERROR_MESSAGES.UNAUTHORIZED_ACTION));
        }
        const deleted = await post_1.default.findByIdAndUpdate({ _id }, {
            $set: {
                isDeleted: true,
            },
        });
        if (!deleted) {
            return next(new ApiError_1.ApiError(400, responseMessages_1.ERROR_MESSAGES.POST_NOT_DELETED));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, responseMessages_1.SUCCESS_MESSAGES.POST_DELETED, null));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.deletePost = deletePost;
//# sourceMappingURL=postControllers.js.map