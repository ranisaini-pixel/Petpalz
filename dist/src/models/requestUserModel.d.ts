import mongoose, { Document, ObjectId } from "mongoose";
declare enum statusType {
    pending = "0",
    confirmed = "1",
    cancelled = "2",
    closed = "3"
}
declare enum preferenceType {
    "I can Drive" = "0",
    "I Need a Ride" = "1"
}
declare enum responseType {
    "Yes! Text Me" = "0",
    "Yes! Call Me" = "1",
    "I Can't Right" = "2",
    "Possibly Later" = "3",
    "Text Me" = "4",
    "Call Me" = "5"
}
export interface IRequestUser extends Document {
    receiverId: ObjectId;
    senderId: ObjectId;
    preference: preferenceType;
    numberOfPassenger: Number;
    response: responseType;
    status: statusType;
}
declare const requestUserModel: mongoose.Model<IRequestUser, {}, {}, {}, mongoose.Document<unknown, {}, IRequestUser, {}, {}> & IRequestUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default requestUserModel;
//# sourceMappingURL=requestUserModel.d.ts.map