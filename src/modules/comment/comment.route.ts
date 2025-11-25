import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { CommentControllers } from "./comment.controller";
import {
  createCommentZodSchema,
  updateCommentZodSchema,
} from "./comment.validation";

const router = Router({ mergeParams: true });

// POST /api/posts/:postId/comments — add comment
router.post(
  "/",
  checkAuth(),
  validateRequest(createCommentZodSchema),
  CommentControllers.createComment
);

// GET /api/posts/:postId/comments?page=1&limit=20 — list comments (top-level)
router.get("/", CommentControllers.getComments);

// GET /api/posts/:postId/comments/:commentId/replies — list replies
router.get(
  "/:commentId/replies",
  CommentControllers.getReplies
);

// PATCH /api/comments/:commentId — update comment
router.patch(
  "/:commentId",
  checkAuth(),
  validateRequest(updateCommentZodSchema),
  CommentControllers.updateComment
);

// DELETE /api/comments/:commentId — delete comment
router.delete("/:commentId", checkAuth(), CommentControllers.deleteComment);

export const CommentRoutes = router;
