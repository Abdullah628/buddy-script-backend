/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { IGenericResponse } from "../../interfaces/common";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IPost } from "./post.interface";
import { Post } from "./post.model";
import { User } from "../user/user.model";

const createPost = async (
  payload: Partial<IPost>,
  decodedToken: JwtPayload
) => {
  const userId = decodedToken.userId;

  // Get user details for author snapshot
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const postData: Partial<IPost> = {
    ...payload,
    authorId: userId,
    authorSnapshot: {
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
    },
  };

  const post = await Post.create(postData);

  return post;
};

const getFeed = async (
  query: Record<string, string>
): Promise<IGenericResponse<IPost[]>> => {
  const modifiedQuery = { ...query };

  const baseQuery = Post.find({
    visibility: "public",
    isDeleted: false,
  }).populate("authorId", "firstName lastName avatarUrl");

  const queryBuilder = new QueryBuilder(baseQuery, modifiedQuery)
    .sort()
    .paginate();

  const posts = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return {
    data: posts,
    meta,
  };
};

const getUserTimeline = async (
  userId: string,
  query: Record<string, string>,
  currentUserId?: string
): Promise<IGenericResponse<IPost[]>> => {
  const modifiedQuery = { ...query };

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Build filter - if viewing own posts, show all; otherwise only public
  const filter: any = {
    authorId: userId,
    isDeleted: false,
  };

  if (userId !== currentUserId) {
    filter.visibility = "public";
  }

  const baseQuery = Post.find(filter).populate(
    "authorId",
    "firstName lastName avatarUrl"
  );

  const queryBuilder = new QueryBuilder(baseQuery, modifiedQuery)
    .sort()
    .paginate();

  const posts = await queryBuilder.build();
  const meta = await queryBuilder.getMeta();

  return {
    data: posts,
    meta,
  };
};

const getSinglePost = async (postId: string) => {
  const post = await Post.findOne({
    _id: postId,
    isDeleted: false,
  })
    .populate("authorId", "firstName lastName avatarUrl email")
    .lean();

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  // Check if post is private - in production, you might want to check user permissions
  if ((post as any).visibility === "private") {
    // You can add additional permission checks here
  }

  // Return post with top comments
  // This assumes you'll implement comment fetching separately
  return {
    ...post,
    topComments: [], // Placeholder for future comment integration
  };
};

const deletePost = async (postId: string, decodedToken: JwtPayload) => {
  const userId = decodedToken.userId;

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  // Verify ownership
  if (post.authorId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this post"
    );
  }

  // Soft delete
  const deletedPost = await Post.findByIdAndUpdate(
    postId,
    { isDeleted: true },
    { new: true }
  );

  return deletedPost;
};

const updatePost = async (
  postId: string,
  payload: Partial<IPost>,
  decodedToken: JwtPayload
) => {
  const userId = decodedToken.userId;

  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, "Post not found");
  }

  // Verify ownership
  if (post.authorId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this post"
    );
  }

  // Prevent updating authorId and authorSnapshot
  const { authorId, authorSnapshot, ...updateData } = payload;

  const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedPost;
};

export const PostServices = {
  createPost,
  getFeed,
  getUserTimeline,
  getSinglePost,
  deletePost,
  updatePost,
};
