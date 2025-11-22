import { Types } from "mongoose";
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IGenericResponse } from "../../interfaces/common";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IComment } from "./comment.interface";
import { Comment } from "./comment.model";
import { User } from "../user/user.model";
import { Post } from "../post/post.model";

const createComment = async (
  postId: string,
  payload: Partial<IComment>,
  decodedToken: JwtPayload
) => {
  const userId = decodedToken.userId;

  // Verify post exists
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  // Get user details for author snapshot
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // If parentCommentId is provided, verify it exists and belongs to the same post
  if (payload.parentCommentId) {
    const parentComment = await Comment.findOne({
      _id: payload.parentCommentId,
      postId: postId,
      isDeleted: false,
    });
    if (!parentComment) {
      throw new AppError(httpStatus.NOT_FOUND, "Parent comment not found");
    }
  }

  const commentData: Partial<IComment> = {
    ...payload,
    postId: new Types.ObjectId(postId),
    authorId: userId,
    authorSnapshot: {
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    },
  };

  const comment = await Comment.create(commentData);

  // Increment post comment count
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

  return comment;
};

const getComments = async (
  postId: string,
  query: Record<string, string>
): Promise<IGenericResponse<IComment[]>> => {
  // Verify post exists
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  const baseQuery = Comment.find({
    postId: postId,
    parentCommentId: null, // Only top-level comments
    isDeleted: false,
  })
    .populate("authorId", "firstName lastName avatarUrl")
    .sort({ createdAt: -1 });

  const queryBuilder = new QueryBuilder(baseQuery, query).paginate();

  const comments = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return {
    data: comments,
    meta,
  };
};

const getReplies = async (
  postId: string,
  commentId: string,
  query: Record<string, string>
): Promise<IGenericResponse<IComment[]>> => {
  // Verify parent comment exists
  const parentComment = await Comment.findOne({
    _id: commentId,
    postId: postId,
    isDeleted: false,
  });
  if (!parentComment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  const baseQuery = Comment.find({
    postId: postId,
    parentCommentId: new Types.ObjectId(commentId),
    isDeleted: false,
  })
    .populate("authorId", "firstName lastName avatarUrl")
    .sort({ createdAt: -1 });

  const queryBuilder = new QueryBuilder(baseQuery, query).paginate();

  const replies = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return {
    data: replies,
    meta,
  };
};

const updateComment = async (
  commentId: string,
  payload: Partial<IComment>,
  decodedToken: JwtPayload
) => {
  const userId = decodedToken.userId;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  if (comment.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  // Verify ownership
  if (comment.authorId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this comment"
    );
  }

  // Only allow updating text
  const { text } = payload;
  const updateData = text ? { text } : {};

  const updatedComment = await Comment.findByIdAndUpdate(commentId, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedComment;
};

const deleteComment = async (
  commentId: string,
  decodedToken: JwtPayload
) => {
  const userId = decodedToken.userId;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
  }

  // Verify ownership
  if (comment.authorId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this comment"
    );
  }

  // Soft delete
  const deletedComment = await Comment.findByIdAndUpdate(
    commentId,
    { isDeleted: true },
    { new: true }
  );

  // Decrement post comment count
  await Post.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });

  return deletedComment;
};

export const CommentServices = {
  createComment,
  getComments,
  getReplies,
  updateComment,
  deleteComment,
};
