import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";
const router = express.Router();

router.post(
  "/register",
  validateRequest(userValidation.registerUser),
  userController.registerUser
);

router.get("/donor-list", auth("USER"), userController.getAllDonor);

router.get("/my-profile", auth("USER"), userController.getMyProfile);
router.put(
  "/my-profile",
  auth("USER"),
  validateRequest(userValidation.updateProfileSchema),
  userController.updateMyProfile
);

export const userRouters = router;