import z from "zod";
import { objectIdRegex } from "../../interfaces/common";

const mediaSchema = z.object({
  url: z
    .string({ message: "Media URL must be a string" })
    .url({ message: "Invalid media URL format" }),
  type: z
    .string({ message: "Media type must be a string" })
    .min(1, { message: "Media type is required" }),
  meta: z.record(z.string(), z.any()).optional(),
});

export const createPostZodSchema = z.object({
  text: z
    .string({ message: "Text must be a string" })
    .min(1, { message: "Post text is required" })
    .max(2000, { message: "Post text cannot exceed 2000 characters" }),
  media: z.array(mediaSchema).optional(),
  visibility: z
    .enum(["public", "private"], {
      message: "Visibility must be 'public' or 'private'",
    })
    .default("public"),
  tags: z
    .array(z.string())
    .optional(),
});

export const updatePostZodSchema = z.object({
  text: z
    .string({ message: "Text must be a string" })
    .min(1, { message: "Post text is required" })
    .max(2000, { message: "Post text cannot exceed 2000 characters" })
    .optional(),
  visibility: z
    .enum(["public", "private"], {
      message: "Visibility must be 'public' or 'private'",
    })
    .optional(),
  tags: z
    .array(z.string())
    .optional(),
});
