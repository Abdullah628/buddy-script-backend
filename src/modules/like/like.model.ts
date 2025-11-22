import { model, Schema } from "mongoose";
import { ILike, TargetType } from "./like.interface";

const likeSchema = new Schema<ILike>(
  {
    targetType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound unique index - prevent duplicate likes from same user
likeSchema.index({ targetType: 1, targetId: 1, userId: 1 }, { unique: true });

// Index for finding likes by target (for counting)
likeSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

// Index for finding likes by user
likeSchema.index({ userId: 1, createdAt: -1 });

// Index for checking if user liked something
likeSchema.index({ targetType: 1, targetId: 1, userId: 1 });

export const Like = model<ILike>("Like", likeSchema);
