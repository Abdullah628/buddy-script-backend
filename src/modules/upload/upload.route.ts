import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UploadControllers } from "./upload.controller";

const router = Router();

// POST /api/uploads - upload image and return url
router.post("/", checkAuth(), UploadControllers.uploadImage);

export const UploadRoutes = router;
