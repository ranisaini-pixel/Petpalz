import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import post from "../models/post";
import { ERROR_MESSAGES } from "../utils/responseMessages";
import comment from "../models/comment";
import like from "../models/like";

dotenv.config();

export const toggleLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { entityId, type } = req.body;
    const userId = res.locals.user._id;

    if (type === "0") {
      const blogExists = await post.findById(entityId);
      if (!blogExists)
        return next(new ApiError(400, ERROR_MESSAGES.POST_NOT_FOUND));
    } else if (type === "1") {
      const commentExists = await comment.findById(entityId);
      if (!commentExists)
        return next(new ApiError(400, ERROR_MESSAGES.COMMENT_NOT_FOUND));
    } else {
      return next(
        new ApiError(400, "Invalid type. Use 0 for blog, 1 for comment")
      );
    }
    const existingLike = await like.findOne({ userId, entityId, type });

    if (existingLike) {
      await existingLike.deleteOne(); // unliked the blog/post

      //decrement blog like by 1
      if (existingLike.type === "0") {
        await post.updateOne(
          { _id: entityId },
          {
            $inc: { likeCount: -1 },
          }
        );
      }

      //decrement comment like by 1
      if (existingLike.type === "1") {
        await comment.updateOne(
          { _id: entityId },
          {
            $inc: { likeCount: -1 },
          }
        );
      }

      return res
        .status(200)
        .json(new ApiResponse(200, "Unliked successfully", {}));
    } else {
      const newLike = new like({ userId, entityId, type });
      const liked = await newLike.save();

      //increment blog like by 1
      if (liked.type === "0") {
        await post.updateOne(
          { _id: entityId },
          {
            $inc: { likeCount: 1 },
          }
        );
      }

      //increment comment like by 1

      if (liked.type === "1") {
        await comment.updateOne(
          { _id: entityId },
          {
            $inc: { likeCount: 1 },
          }
        );
      }

      return res
        .status(201)
        .json(new ApiResponse(201, "Liked successfully", {}));
    }
  } catch (error) {
    next(error);
  }
};
