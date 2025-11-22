import z from "zod";

export const createCommentZodSchema = z.object({
  text: z
    .string({ message: "Comment text must be a string" })
    .min(1, { message: "Comment text is required" })
    .max(1000, { message: "Comment text cannot exceed 1000 characters" }),
  parentCommentId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, { message: "parentCommentId must be a valid Mongo ObjectId" })
    .optional()
    .nullable(),
});

export const updateCommentZodSchema = z.object({
  text: z
    .string({ message: "Comment text must be a string" })
    .min(1, { message: "Comment text is required" })
    .max(1000, { message: "Comment text cannot exceed 1000 characters" })
    .optional(),
});
