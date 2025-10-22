import mongoose, { Document, ObjectId } from "mongoose";
declare enum likeType {
    post = "0",
    comment = "1"
}
export interface ILike extends Document {
    userId: ObjectId;
    entityId?: ObjectId;
    type: likeType;
    likeCount: number;
}
declare const like: mongoose.Model<ILike, {}, {}, {}, mongoose.Document<unknown, {}, ILike, {}, {}> & ILike & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default like;
//# sourceMappingURL=like.d.ts.map