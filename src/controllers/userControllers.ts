import user, { IUser } from "../models/user";
import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/successMessage";

dotenv.config();

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      userName,
      fullName,
      email,
      mobileNumber,
      dateOfBirth,
      password,
      socialDetails,
    } = req.body;

    const existedUser = await user.findOne({ email });

    if (existedUser) {
      return next(new ApiError(400, ERROR_MESSAGES.USER_ALREADY_EXISTS));
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const finalFullName =
        fullName && fullName.trim() !== "" ? fullName : userName;

      const newUser: IUser = new user({
        userName,
        fullName: finalFullName,
        email,
        password: hashedPassword,
        mobileNumber,
        dateOfBirth,
      });

      if (socialDetails && socialDetails.length > 0) {
        newUser.socialDetails = socialDetails;
      }

      const createdUser = await newUser?.save();
      delete createdUser?.password;

      if (!createdUser) {
        return next(new ApiError(400, ERROR_MESSAGES.USER_NOT_CREATED));
      }
      return res
        .status(201)
        .json(new ApiResponse(201, SUCCESS_MESSAGES.USER_CREATED, createdUser));
    }
  } catch (error: any) {
    console.log(error);
    return next(error);
  }
};

export const checkEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const emailExisted = await user.findOne({ email });

    if (emailExisted) {
      return next(new ApiError(404, ERROR_MESSAGES.EMAIL_EXISTED));
    } else {
      return res
        .status(202)
        .json(new ApiResponse(202, SUCCESS_MESSAGES.EMAIL_NOT_EXISTS, {}));
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    let existedUser = await user.findOne({ email });

    if (!existedUser) {
      return next(new ApiError(400, ERROR_MESSAGES.USER_NOT_REGISTERED));
    } else {
      let isPasswordValidate = bcrypt.compare(
        password,
        existedUser.password || ""
      );

      if (!isPasswordValidate) {
        return next(new ApiError(400, ERROR_MESSAGES.PASSWORD_INCORRECT));
      } else {
        const token = jwt.sign(
          { id: existedUser._id },
          process.env.PRIVATE_KEY as string,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY as "1D",
          }
        );

        const loggedInUserDetails = await user.findOneAndUpdate(
          { email },
          {
            $set: {
              token: token,
            },
          },
          {
            new: true,
            upsert: true,
          }
        );

        return res
          .status(200)
          .json(
            new ApiResponse(
              200,
              SUCCESS_MESSAGES.LOGIN_USER_SUCCESSFULLY,
              loggedInUserDetails
            )
          );
      }
    }
  } catch (error: any) {
    console.log("Error:", error);
    next(error);
  }
};

export const loginWithMobileNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mobileNumber } = req.body;

    const mobileNumberExists = await user.findOne({ mobileNumber });

    if (mobileNumberExists) {
      await user.findOneAndUpdate(
        { mobileNumber },
        {
          $set: {
            otp: "0000",
            otpExpiration: new Date(),
          },
        }
      );

      return res
        .status(200)
        .json(new ApiResponse(200, ERROR_MESSAGES.OTP_SEND_SUCCESSFULLY, {}));
    } else {
      return next(new ApiError(400, ERROR_MESSAGES.MOBILE_NUMBER_NOT_EXISTS));
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const MobileOtpVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp } = req.body;
    const { _id } = req.query;

    const userExists = await user.findById({ _id });

    if (!userExists) {
      return next(new ApiError(400, ERROR_MESSAGES.USER_NOT_EXISTS));
    }

    const OTP_VALIDITY_DURATION = 2 * 60 * 1000;

    if (userExists.otp == otp) {
      if (
        !userExists.otpExpiration ||
        new Date(userExists.otpExpiration).getTime() + OTP_VALIDITY_DURATION <
          Date.now()
      ) {
        return next(new ApiError(400, ERROR_MESSAGES.OTP_EXPIRED));
      } else {
        await user.updateOne(
          { _id },
          { $set: { otp: null, otpExpiration: null } }
        );

        return res
          .status(201)
          .json(new ApiResponse(200, SUCCESS_MESSAGES.OTP_VERIFIED, {}));
      }
    } else {
      return next(new ApiError(400, ERROR_MESSAGES.INVALID_OTP));
    }
  } catch (error: any) {
    console.error("Error:", error);
    next(error);
  }
};

export const SSOLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, SSOType, socialId } = req.body;

    const userExists = await user.findOne({ email });

    if (!userExists) {
      return next(new ApiError(404, ERROR_MESSAGES.USER_NOT_EXISTS));
    }

    if (!userExists.socialDetails || userExists.socialDetails.length === 0) {
      userExists.socialDetails = [];

      userExists.socialDetails.push({
        SSOType,
        socialId,
      });

      await userExists.save();

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            SUCCESS_MESSAGES.USER_DETAILS_UPDATED,
            userExists
          )
        );
    } else {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            SUCCESS_MESSAGES.USER_DETAILS_UPDATED,
            userExists
          )
        );
    }
  } catch (error) {
    next(error);
    console.log("Error:", error);
  }
};

export const getUsersById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user;

    if (!userId) {
      return next(new ApiError(404, ERROR_MESSAGES.USER_NOT_EXISTS));
    }

    const userDetails = await user.findById(userId);

    return res
      .status(200)
      .json(new ApiResponse(200, SUCCESS_MESSAGES.USER_DETAILS, userDetails));
  } catch (error) {
    console.error("Error", error);
    next(error);
  }
};

export const getUsersList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { searchTerm = "" } = req.query;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const pipeline: any[] = [];

    if (searchTerm) {
      pipeline.push({
        $match: {
          $or: [
            { userName: { $regex: searchTerm, $options: "i" } },
            { fullName: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push({
      $project: {
        userName: 1,
        fullName: 1,
        email: 1,
        isEmailVerified: 1,
        mobileNumber: 1,
        isMobileVerified: 1,
        dateOfBirth: 1,
      },
    });

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    const users = await user.aggregate(pipeline);

    const totalUsers = await user.countDocuments(
      searchTerm
        ? {
            $or: [
              { userName: { $regex: searchTerm, $options: "i" } },
              { fullName: { $regex: searchTerm, $options: "i" } },
              { email: { $regex: searchTerm, $options: "i" } },
            ],
          }
        : {}
    );

    return res.status(200).json(
      new ApiResponse(200, SUCCESS_MESSAGES.USER_LIST_FETCHED, {
        pagination: {
          total: totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
        },
        users,
      })
    );
  } catch (error) {
    console.error("Error", error);
    next(error);
  }
};
