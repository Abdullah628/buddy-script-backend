/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { LikeServices } from "./like.service";
import { TargetType } from "./like.interface";

const likePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const decodedToken = req.user as JwtPayload;

    const like = await LikeServices.likeTarget("post", postId, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post Liked Successfully",
      data: like,
    });
  }
);

const unlikePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const decodedToken = req.user as JwtPayload;

    const result = await LikeServices.unlikeTarget("post", postId, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Unliked Successfully",
      data: result,
    });
  }
);

const getPostLikers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const result = await LikeServices.getLikers(
      "post",
      postId,
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post Likers Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const likeComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const decodedToken = req.user as JwtPayload;

    const like = await LikeServices.likeTarget("comment", commentId, decodedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment Liked Successfully",
      data: like,
    });
  }
);

const unlikeComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const decodedToken = req.user as JwtPayload;

    const result = await LikeServices.unlikeTarget(
      "comment",
      commentId,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment Unliked Successfully",
      data: result,
    });
  }
);

const getCommentLikers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const result = await LikeServices.getLikers(
      "comment",
      commentId,
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment Likers Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const LikeControllers = {
  likePost,
  unlikePost,
  getPostLikers,
  likeComment,
  unlikeComment,
  getCommentLikers,
};
