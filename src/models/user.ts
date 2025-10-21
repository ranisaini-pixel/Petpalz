import mongoose, { Document, Schema, ObjectId } from "mongoose";

enum SSOType {
  "google" = "1",
  "apple" = "2",
  "twitter" = "3",
  "facebook" = "4",
}

export interface ISocialDetail {
  SSOType: SSOType;
  socialId: string;
}

export interface IUser extends Document {
  userName: string;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  mobileNumber: Number;
  isMobileVerified: boolean;
  password?: string;
  profileImage: string;
  otp: string;
  otpExpiration: Date;
  token: string;
  dateOfBirth: Date;
  socialDetails: ISocialDetail[];
  isDeleted: boolean;
}

const socialDetailSchema = new Schema<ISocialDetail>(
  {
    SSOType: {
      type: String,
      enum: SSOType,
    },
    socialId: {
      type: String,
    },
  },
  { _id: false }
);

const userSchema: Schema<IUser> = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    mobileNumber: {
      type: Number,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      unique: true,
      required: true,
    },
    profileImage: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpiration: {
      type: Date,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    socialDetails: [socialDetailSchema],
    token: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
    versionKey: false,
  }
);

const user = mongoose.model<IUser>("users", userSchema);
export default user;
