/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PostServices } from "./post.service";
import AppError from "../../errorHelpers/AppError";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const post = await PostServices.createPost(req.body, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post Created Successfully",
      data: post,
    });
  }
);

const getFeed = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await PostServices.getFeed(
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Feed Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getUserTimeline = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const decodedToken = req.user as JwtPayload;

    const result = await PostServices.getUserTimeline(
      userId,
      req.query as Record<string, string>,
      decodedToken?.userId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Timeline Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSinglePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const post = await PostServices.getSinglePost(postId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Retrieved Successfully",
      data: post,
    });
  }
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const decodedToken = req.user as JwtPayload;

    const post = await PostServices.deletePost(postId, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Deleted Successfully",
      data: post,
    });
  }
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const decodedToken = req.user as JwtPayload;

    const post = await PostServices.updatePost(
      postId,
      req.body,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Updated Successfully",
      data: post,
    });
  }
);

export const PostControllers = {
  createPost,
  getFeed,
  getUserTimeline,
  getSinglePost,
  deletePost,
  updatePost,
};
