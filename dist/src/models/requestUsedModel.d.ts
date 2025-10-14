import mongoose, { Document, ObjectId } from "mongoose";
declare enum statusType {
    pending = "0",
    confirmed = "1",
    cancelled = "2"
}
export interface IRequestUser extends Document {
    receiverId: ObjectId;
    senderId: ObjectId;
    content: string;
    status: statusType;
}
declare const requestUserModel: mongoose.Model<IRequestUser, {}, {}, {}, mongoose.Document<unknown, {}, IRequestUser, {}, {}> & IRequestUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default requestUserModel;
//# sourceMappingURL=requestUsedModel.d.ts.map