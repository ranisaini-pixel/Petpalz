import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface IComment extends Document {
  postId: ObjectId;
  userId: ObjectId;
  content: string;
  parentComment?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema<IComment> = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "posts",
      required: true,
    },
    userId: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    ],
    content: {
      type: String,
      required: true,
    },
    parentComment: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
        default: null,
      },
    ],
  },
  {
    timestamps: true,
    collection: "comments",
    versionKey: false,
  }
);

//TTL index, this will auto delete comments after 24 hours
// commentSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });
// commentSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

const comment = mongoose.model<IComment>("comments", commentSchema);
export default comment;
