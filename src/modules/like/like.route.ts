import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { LikeControllers } from "./like.controller";

const router = Router();

// like post
router.post("/posts/:postId/like", checkAuth(), LikeControllers.likePost);

// unlike post
router.delete("/posts/:postId/like", checkAuth(), LikeControllers.unlikePost);

// list post likers
router.get("/posts/:postId/likes", LikeControllers.getPostLikers);

// like comment
router.post("/comments/:commentId/like", checkAuth(), LikeControllers.likeComment);

// unlike comment
router.delete(
  "/comments/:commentId/like",
  checkAuth(),
  LikeControllers.unlikeComment
);

// list comment likers
router.get("/comments/:commentId/likes", LikeControllers.getCommentLikers);

export const LikeRoutes = router;
