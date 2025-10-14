import mongoose, { Document, ObjectId } from "mongoose";
declare enum genderType {
    male = "0",
    female = "1"
}
declare enum roleType {
    user = "0",
    admin = "1"
}
export interface IUser extends Document {
    firstName: string;
    lastName: string;
    gender: genderType;
    email: string;
    password: string;
    congregationName: string;
    otp: string;
    otpExpiration: Date;
    token: string;
    role: roleType;
    pinCode: string;
    stateId: ObjectId;
    cityId: ObjectId;
    isDeleted: boolean;
}
declare const userModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default userModel;
//# sourceMappingURL=userModel.d.ts.map