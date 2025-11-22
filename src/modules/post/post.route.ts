import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PostControllers } from "./post.controller";
import {
  createPostZodSchema,
  updatePostZodSchema,
} from "./post.validation";
import { CommentRoutes } from "../comment/comment.route";
const router = Router();

// POST /api/posts — create post (text, mediaKeys[], visibility)
router.post(
  "/",
  checkAuth(),
  validateRequest(createPostZodSchema),
  PostControllers.createPost
);

// GET /api/posts/feed?cursor=...&limit=20 — global feed (public)
router.get("/feed", PostControllers.getFeed);

// GET /api/posts/user/:userId?cursor... — user timeline
router.get("/user/:userId", PostControllers.getUserTimeline);

// GET /api/posts/:postId — get single post (with top comments)
router.get("/:postId", PostControllers.getSinglePost);

// DELETE /api/posts/:postId — delete (soft delete)
router.delete("/:postId", checkAuth(), PostControllers.deletePost);

// PATCH /api/posts/:postId — update post (optional)
router.patch(
  "/:postId",
  checkAuth(),
  validateRequest(updatePostZodSchema),
  PostControllers.updatePost
);

// Mount comment routes
router.use("/:postId/comments", CommentRoutes);

export const PostRoutes = router;
