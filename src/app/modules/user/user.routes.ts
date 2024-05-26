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

router.get("/get-users", auth("ADMIN"), userController.getAllUsers);
router.get("/donor-list", userController.getAllDonor);

router.get("/my-profile", auth("USER", "ADMIN"), userController.getMyProfile);
router.get(
  "/user-details/:id",
  auth("USER", "ADMIN"),
  userController.getUserDetails
);
router.put(
  "/update-profile",
  auth("USER", "ADMIN"),
  userController.updateMyProfile
);
router.put(
  "/update-user/:id",
  auth("ADMIN"),
  userController.updateUserRoleStatus
);

router.post(
  "/change-password",
  auth("USER", "ADMIN"),
  userController.changePassword
);

export const userRouters = router;
