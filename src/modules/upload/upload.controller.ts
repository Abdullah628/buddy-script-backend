/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UploadService } from "./upload.service";

const uploadImage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Expecting either { file: '<data-uri or url>' } or file upload middleware that populates req.file.path
  const { file, folder } = req.body as { file?: string; folder?: string };

  if (!file && !(req as any).file) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "No file provided. Send a 'file' field (data URI or URL) or use multipart form upload.",
      data: null,
    });
  }

  // If middleware attached file.path (e.g., multer) prefer that
  const fileToUpload = file || (req as any).file?.path;

  const result = await UploadService.uploadImage(fileToUpload as string, folder);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "File uploaded successfully",
    data: result,
  });
});

export const UploadControllers = {
  uploadImage,
};
