import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import post from "../models/post";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/responseMessages";
import comment, { IComment } from "../models/comment";
import mongoose from "mongoose";

dotenv.config();

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId, content, parentComment } = req.body;
    const user = res.locals.user;

    const existedPost = await post.findById(postId);
    if (!existedPost) {
      return next(new ApiError(400, ERROR_MESSAGES.POST_NOT_FOUND));
    }

    const newComment: IComment = new comment({
      postId,
      userId: user,
      content,
      parentComment: parentComment || null,
    });

    const savedComment = await newComment.save();

    await post.updateOne(
      { _id: postId },
      {
        $inc: { commentCount: 1 },
      }
    );

    return res
      .status(201)
      .json(new ApiResponse(201, SUCCESS_MESSAGES.COMMENT_ADDED, savedComment));
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;

    const commentExists = await comment.findById({ _id });

    if (!commentExists) {
      return next(new ApiError(404, ERROR_MESSAGES.COMMENT_NOT_FOUND));
    }

    const updatedComment = await comment.findByIdAndUpdate(
      { _id },
      {
        $set: {
          content: req.body.content,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedComment) {
      return next(new ApiError(404, ERROR_MESSAGES.COMMENT_NOT_UPDATED));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, SUCCESS_MESSAGES.COMMENT_UPDATED, updatedComment)
      );
  } catch (error: any) {
    console.log("Error:", error);
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    let userId = res.locals.user._id;

    const commentExists = await comment.findById(_id);

    if (!commentExists) {
      return next(new ApiError(404, ERROR_MESSAGES.COMMENT_NOT_FOUND));
    }

    if (commentExists.userId.toString() !== userId.toString()) {
      return next(new ApiError(403, ERROR_MESSAGES.UNAUTHORIZED_ACTION));
    }

    const deleted = await comment.findByIdAndDelete({ _id });

    if (!deleted) {
      return next(new ApiError(400, ERROR_MESSAGES.COMMENT_NOT_DELETED));
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, SUCCESS_MESSAGES.COMMENT_DELETED, null));
    }
  } catch (error: any) {
    console.log("Error:", error);
    next(error);
  }
};

export const getUserComments = async (
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
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          userId: 1,
          content: 1,
        },
      }
    );

    const postDetails = await comment.aggregate(pipeline);

    const totalPosts = await comment.countDocuments({ userId: userId });

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
