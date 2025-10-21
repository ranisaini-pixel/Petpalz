import mongoose, { Document, ObjectId } from "mongoose";
export interface IPost extends Document {
    content: string;
    author: ObjectId;
    media: string;
    likeCount: number;
    commentCount: number;
    isDeleted: boolean;
}
declare const post: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost, {}, {}> & IPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default post;
//# sourceMappingURL=post.d.ts.map