import { model, Schema } from "mongoose";
import { IAuthorSnapshot, IComment } from "./comment.interface";

const authorSnapshotSchema = new Schema<IAuthorSnapshot>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatarUrl: { type: String },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const commentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorSnapshot: {
      type: authorSnapshotSchema,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for better query performance
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ postId: 1, parentCommentId: 1, createdAt: -1 });
commentSchema.index({ authorId: 1, createdAt: -1 });
commentSchema.index({ isDeleted: 1 });
commentSchema.index({ parentCommentId: 1 });

export const Comment = model<IComment>("Comment", commentSchema);
