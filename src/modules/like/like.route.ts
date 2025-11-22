import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { LikeControllers } from "./like.controller";

const router = Router();

// POST /api/posts/:postId/like — like post
router.post("/posts/:postId/like", checkAuth(), LikeControllers.likePost);

// DELETE /api/posts/:postId/like — unlike post
router.delete("/posts/:postId/like", checkAuth(), LikeControllers.unlikePost);

// GET /api/posts/:postId/likes?limit=50 — list post likers
router.get("/posts/:postId/likes", LikeControllers.getPostLikers);

// POST /api/comments/:commentId/like — like comment
router.post("/comments/:commentId/like", checkAuth(), LikeControllers.likeComment);

// DELETE /api/comments/:commentId/like — unlike comment
router.delete(
  "/comments/:commentId/like",
  checkAuth(),
  LikeControllers.unlikeComment
);

// GET /api/comments/:commentId/likes — list comment likers
router.get("/comments/:commentId/likes", LikeControllers.getCommentLikers);

export const LikeRoutes = router;
