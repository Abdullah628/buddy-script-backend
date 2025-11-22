import { Types } from "mongoose";
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IGenericResponse } from "../../interfaces/common";
import { QueryBuilder } from "../../utils/queryBuilder";
import { ILike, TargetType } from "./like.interface";
import { Like } from "./like.model";
import { Post } from "../post/post.model";
import { Comment } from "../comment/comment.model";
import { User } from "../user/user.model";

const likeTarget = async (
  targetType: TargetType,
  targetId: string,
  decodedToken: JwtPayload
) => {
  const userId = decodedToken.userId;

  // Verify target exists
  if (targetType === "post") {
    const post = await Post.findOne({ _id: targetId, isDeleted: false });
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }
  } else if (targetType === "comment") {
    const comment = await Comment.findOne({ _id: targetId, isDeleted: false });
    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
    }
  }

  // Check if already liked
  const existingLike = await Like.findOne({
    targetType,
    targetId: new Types.ObjectId(targetId),
    userId,
  });

  if (existingLike) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already liked");
  }

  // Create like
  const like = await Like.create({
    targetType,
    targetId: new Types.ObjectId(targetId),
    userId,
  });

  // Increment like count
  if (targetType === "post") {
    await Post.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
  } else if (targetType === "comment") {
    await Comment.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
  }

  return like;
};

const unlikeTarget = async (
  targetType: TargetType,
  targetId: string,
  decodedToken: JwtPayload
) => {
  const userId = decodedToken.userId;

  // Find and delete like
  const like = await Like.findOneAndDelete({
    targetType,
    targetId,
    userId,
  });

  if (!like) {
    throw new AppError(httpStatus.NOT_FOUND, "Like not found");
  }

  // Decrement like count
  if (targetType === "post") {
    await Post.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
  } else if (targetType === "comment") {
    await Comment.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
  }

  return { message: "Unliked successfully" };
};

const getLikers = async (
  targetType: TargetType,
  targetId: string,
  query: Record<string, string>
): Promise<IGenericResponse<any[]>> => {
  // Verify target exists
  if (targetType === "post") {
    const post = await Post.findOne({ _id: targetId, isDeleted: false });
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }
  } else if (targetType === "comment") {
    const comment = await Comment.findOne({ _id: targetId, isDeleted: false });
    if (!comment) {
      throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
    }
  }

  const baseQuery = Like.find({
    targetType,
    targetId,
  })
    .populate("userId", "firstName lastName avatarUrl email")
    .sort({ createdAt: -1 });

  const queryBuilder = new QueryBuilder(baseQuery, query).paginate();

  const likers = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return {
    data: likers,
    meta,
  };
};

const checkIfLiked = async (
  targetType: TargetType,
  targetId: string,
  userId: string
) => {
  const like = await Like.findOne({
    targetType,
    targetId,
    userId,
  });

  return { isLiked: !!like };
};

export const LikeServices = {
  likeTarget,
  unlikeTarget,
  getLikers,
  checkIfLiked,
};
