import z from "zod";

export const likePostZodSchema = z.object({
  targetType: z
    .enum(["post", "comment"], {
      message: "targetType must be 'post' or 'comment'",
    })
    .optional(),
});

export const likeCommentZodSchema = z.object({
  targetType: z
    .enum(["post", "comment"], {
      message: "targetType must be 'post' or 'comment'",
    })
    .optional(),
});
