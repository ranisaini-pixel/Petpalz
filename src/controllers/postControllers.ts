import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import post, { IPost } from "../models/post";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/successMessage";
import mongoose from "mongoose";

dotenv.config();

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { author, content } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    //extracting file path
    const filePaths = files.map((file) => file.filename);

    const newPost: IPost = new post({
      content,
      author,
      files: filePaths,
    });

    let postCreated = await newPost?.save();

    if (!postCreated) {
      return next(new ApiError(400, ERROR_MESSAGES.POST_NOT_CREATED));
    }

    const postWithAuthor = await post.aggregate([
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
          files: 1,
          createdAt: 1,
          "authorDetails._id": 1,
          "authorDetails.username": 1,
        },
      },
    ]);

    return res
      .status(201)
      .json(
        new ApiResponse(201, SUCCESS_MESSAGES.POST_CREATED, postWithAuthor)
      );
  } catch (error: any) {
    console.log(error);
    return next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;

    await post.findByIdAndUpdate(
      { _id },
      {
        $set: {
          content: req.body.content,
        },
      },
      {
        new: true,
      }
    );

    let updatedPostData = await post.findById({ _id });

    if (!updatedPostData) {
      return next(new ApiError(400, ERROR_MESSAGES.POST_NOT_UPDATED));
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(200, SUCCESS_MESSAGES.POST_UPDATED, updatedPostData)
        );
    }
  } catch (error: any) {
    console.log("Error:", error);
    next(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const userId = res.locals.user;

    if (!userId) {
      return next(new ApiError(404, ERROR_MESSAGES.USER_NOT_EXISTS));
    }

    const pipeline: any[] = [];

    pipeline.push(
      {
        $match: {
          postId,
        },
      },
      {
        $project: {
          author: 1,
          content: 1,
        },
      }
    );

    const postDetails = await post.aggregate(pipeline);

    const totalPosts = await post.countDocuments({ author: userId });

    if (!postDetails.length) {
      return next(new ApiError(400, ERROR_MESSAGES.POST_NOT_FOUND));
    } else {
      return res.status(200).json(
        new ApiResponse(200, SUCCESS_MESSAGES.POST_FOUND, {
          postDetails,
          totalPosts,
        })
      );
    }
  } catch (error: any) {
    console.log("Error:", error);
    next(error);
  }
};

export const getPostByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user;

    if (!userId) {
      return next(new ApiError(404, ERROR_MESSAGES.USER_NOT_EXISTS));
    }

    const pipeline: any[] = [];

    pipeline.push(
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          author: 1,
          content: 1,
        },
      }
    );

    const postDetails = await post.aggregate(pipeline);

    const totalPosts = await post.countDocuments({ author: userId });

    if (!postDetails.length) {
      return next(new ApiError(400, ERROR_MESSAGES.POST_NOT_FOUND));
    } else {
      return res.status(200).json(
        new ApiResponse(200, SUCCESS_MESSAGES.POST_FOUND, {
          postDetails,
          totalPosts,
        })
      );
    }
  } catch (error: any) {
    console.log("Error:", error);
    next(error);
  }
};

export const getPostsList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, searchTerm = "" } = req.query;

    const pipeline: any[] = [
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

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) }
    );

    const result = await post.aggregate(pipeline);
    const totalCount = await post.countDocuments(result);

    return res.status(201).json(
      new ApiResponse(201, SUCCESS_MESSAGES.POST_LIST_FOUND, {
        result,
        page,
        limit,
        totalCount,
      })
    );
  } catch (error) {
    next(error);
    console.log("Error:", error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user._id;
    const { _id } = req.params;

    if (!userId) {
      return next(new ApiError(404, ERROR_MESSAGES.USER_NOT_EXISTS));
    }

    const deleted = await post.findByIdAndUpdate(
      { _id },
      {
        $set: {
          isDeleted: true,
        },
      }
    );

    if (!deleted) {
      return next(new ApiError(400, ERROR_MESSAGES.POST_NOT_DELETED));
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, SUCCESS_MESSAGES.POST_DELETED, null));
    }
  } catch (error: any) {
    console.log("Error:", error);
    next(error);
  }
};
