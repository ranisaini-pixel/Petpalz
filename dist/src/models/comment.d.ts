import mongoose, { Document, ObjectId } from "mongoose";
export interface IComment extends Document {
    postId: ObjectId;
    userId: ObjectId;
    content: string;
    parentComment?: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const comment: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment, {}, {}> & IComment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default comment;
//# sourceMappingURL=comment.d.ts.map