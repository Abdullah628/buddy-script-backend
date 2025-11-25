/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { configureCloudinary } from "../../utils/cloudinary";

// Configure when module is loaded (throws if env missing)
const cloudinary = configureCloudinary();

/**
 * Uploads a file (base64 data URI or remote URL) to Cloudinary.
 * @param file - data URI (base64) or remote URL or local path supported by Cloudinary uploader
 * @param folder - optional folder name in Cloudinary
 */
const uploadImage = async (file: string, folder?: string) => {
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, "No file provided for upload");
  }

  try {
    const opts: any = { resource_type: "image" };
    if (folder) opts.folder = folder;

    const result = await cloudinary.uploader.upload(file, opts);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      raw: result,
    };
  } catch (err: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, err.message || "Cloudinary upload failed");
  }
};

export const UploadService = {
  uploadImage,
};
