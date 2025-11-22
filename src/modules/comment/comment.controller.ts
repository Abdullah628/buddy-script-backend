/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CommentServices } from "./comment.service";
import AppError from "../../errorHelpers/AppError";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const decodedToken = req.user as JwtPayload;
    const comment = await CommentServices.createComment(
      postId,
      req.body,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Comment Created Successfully",
      data: comment,
    });
  }
);

const getComments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const result = await CommentServices.getComments(
      postId,
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getReplies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, commentId } = req.params;
    const result = await CommentServices.getReplies(
      postId,
      commentId,
      req.query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Replies Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const updateComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const decodedToken = req.user as JwtPayload;

    const comment = await CommentServices.updateComment(
      commentId,
      req.body,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment Updated Successfully",
      data: comment,
    });
  }
);

const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    const decodedToken = req.user as JwtPayload;

    const comment = await CommentServices.deleteComment(
      commentId,
      decodedToken
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comment Deleted Successfully",
      data: comment,
    });
  }
);

export const CommentControllers = {
  createComment,
  getComments,
  getReplies,
  updateComment,
  deleteComment,
};
