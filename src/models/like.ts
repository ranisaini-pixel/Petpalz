import mongoose, { Schema, Document, ObjectId } from "mongoose";

enum likeType {
  post = "0",
  comment = "1",
}

export interface ILike extends Document {
  userId: ObjectId;
  entityId?: ObjectId;
  type: likeType;
  likeCount: number;
}

const likeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: likeType,
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "likes",
    versionKey: false,
  }
);

// To prevent double likes
likeSchema.index({ entityId: 1, userId: 1 }, { unique: true });

const like = mongoose.model<ILike>("likes", likeSchema);
export default like;
