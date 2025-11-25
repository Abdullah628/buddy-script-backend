import { v2 as cloudinary } from "cloudinary";

/**
 * Returns a configured Cloudinary instance. This function is lazy — it will
 * configure Cloudinary only when called so importing this module won't throw
 * during serverless cold-starts if env vars are missing.
 */
export const getConfiguredCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  }

  return cloudinary;
};

export default cloudinary;
