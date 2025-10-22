import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface IPost extends Document {
  content: string;
  userId: ObjectId;
  files: string[];
  likeCount: number;
  commentCount: number;
  isDeleted: boolean;
}

const postSchema: Schema<IPost> = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    files: [
      {
        type: String,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "posts",
    versionKey: false,
  }
);

const post = mongoose.model<IPost>("posts", postSchema);
export default post;
