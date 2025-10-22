import mongoose, { Document } from "mongoose";
declare enum SSOType {
    "google" = "1",
    "apple" = "2",
    "twitter" = "3",
    "facebook" = "4"
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
declare const user: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default user;
//# sourceMappingURL=user.d.ts.map