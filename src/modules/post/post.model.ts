import { model, Schema } from "mongoose";
import { IAuthorSnapshot, IMedia, IPost, Visibility } from "./post.interface";

const mediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    type: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  {
    versionKey: false,
    _id: false,
  }
);

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

const postSchema = new Schema<IPost>(
  {
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
    media: [mediaSchema],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    pinned: {
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
postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ isDeleted: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ pinned: -1, createdAt: -1 });

export const Post = model<IPost>("Post", postSchema);
