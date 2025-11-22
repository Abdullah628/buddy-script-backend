import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserControllers } from "./user.controller";
// import { Role } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

router.get("/me", checkAuth(), UserControllers.getMe);
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(),
  UserControllers.getAllUsers
);

router.patch(
  "/update-me",
  checkAuth(),
  UserControllers.updateMe
);



router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(),
  UserControllers.updateUser
);


router.get(
  "/:id",
  checkAuth(),
  UserControllers.getUserById
);



export const UserRoutes = router;
